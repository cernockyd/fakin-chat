import React, {Component} from 'react';

class ShowMessage extends Component {

  constructor(props) {
    super();
    const text = props.messages;

    console.log(text);

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

export default ShowMessage;