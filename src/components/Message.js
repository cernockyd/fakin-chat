import React, {Component} from 'react';

class Message extends Component {

  constructor(props) {
    super();
    const text = props.messages;

    this.state = {
      value: text[text.length-1]
    }

  }

  render() {
    return (
      <div>{ this.state.value }</div>
    )
  }
}

export default Message;