# react-simple-websocket

> A simple websocket component for React

## Installation

```
$ npm install react-simple-websocket --save
$ yarn add react-simple-websocket
```

## Usage

``` react
import React from 'react';
import SimpleWS from 'react-simple-websocket';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    const that = this;

    that.state = {
      wsData: "",
    };

    that.sender = null;
  }

  onMessage = data => {
    const that = this;

    //get the data from ws
    that.setState({
      wsData: data
    });
  };

  onOpen = sender => {
    const that = this;
    that.sender = sender;

    //use sender to send your data
    sender("xxxxx");
  };

   onClick = () => {
    const that = this;

    that.sender('halo,it's me!');
  };

  render() {
    return (
      <div>
        <SimpleWS
          url="ws://localhost:8080"
          onOpen={that.onOpen}
          onMessage={that.onMessage}
          onClose={that.onClose}
        />
        <button onClick={that.onClick}>send</button>
      </div>
    );
  }
};
```

## Properties

``` javascript
  static propTypes = {
    url: PropTypes.string.isRequired,
    onOpen: PropTypes.func,
    onMessage: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onClose: PropTypes.func,
    debug: PropTypes.bool,
    reconnect: PropTypes.bool
  };

  static defaultProps = {
    debug: false,
    reconnect: true
  };
```

# License

MIT
