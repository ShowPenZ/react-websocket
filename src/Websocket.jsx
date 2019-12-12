import React from 'react';
import PropTypes from 'prop-types';

function isFunction(arg) {
  if (typeof arg === 'function') {
    return true;
  }
}

class Websocket extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onOpen: PropTypes.func,
    onMessage: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onClose: PropTypes.func,
    debug: PropTypes.bool,
    reconnect: PropTypes.bool,
  };

  static defaultProps = {
    debug: false,
    reconnect: true,
  };

  constructor(props) {
    super(props);
    const that = this;
    const { url } = that.props;

    that.state = {
      WS: window.WebSocket ? new window.WebSocket(url) : new window.MozWebSocket(url),
      reconnectTime: 0,
    };

    that.reconnectFailureTimes = 0;
    that.reconnectTimer = null;
    that.needReconnet = true;
  }

  componentDidMount() {
    const that = this;

    that.structureWebSocket();
  }

  componentWillUnmount() {
    const that = this;
    const { WS } = that.state;

    that.needReconnet = false;

    clearTimeout(that.reconnectTimer);

    that.printLog(`WS is close`);

    WS.close();
  }

  structureWebSocket = () => {
    const that = this;
    const { WS } = that.state;
    const { onOpen, onMessage, onError, onClose, reconnect, url } = that.props;

    WS.onopen = () => {
      that.printLog('ws is connected');

      if (isFunction(onOpen)) {
        onOpen(that.sendData);
      }
    };

    WS.onmessage = data => {
      that.printLog(`wsData:${data.data}`);

      if (isFunction(onMessage)) {
        onMessage(data.data);
      }
    };

    WS.onclose = e => {
      const { code, reason, wasClean } = e;

      that.printLog(`WS is disconneted,reason:${reason}`);

      if (isFunction(onClose)) {
        onClose(code, reason, wasClean);
      }

      if (reconnect && that.needReconnet) {
        that.reconnectFailureTimes++;

        if (that.reconnectFailureTimes < 3) {
          that.reconnectTimer = window.setTimeout(() => {
            that.setState({
              WS: window.WebSocket ? new window.WebSocket(url) : new window.MozWebSocket(url),
            });
            that.structureWebSocket();
          }, 15 * 1000);
        }
      }
    };

    WS.onerror = e => {
      if (isFunction(onError)) {
        onError();
      }
    };
  };

  sender = msg => {
    const that = this;
    const { WS } = that.state;

    if (WS && WS.readyState === 1) {
      WS.send(msg);
    }
  };

  sendData = msg => {
    const that = this;

    return that.sender(msg);
  };

  printLog = val => {
    const that = this;
    const { debug } = that.props;

    if (debug) {
      console.log(val);
    }
  };

  render() {
    const that = this;
    const { children } = that.props;

    return <div>{children}</div>;
  }
}

export default Websocket;
