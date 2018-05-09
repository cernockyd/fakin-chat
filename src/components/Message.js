import React, {Component} from 'react';
import { Loading } from 'react-simple-chatbot'
import { isLocalhost } from '../registerServiceWorker';

class Message extends Component {

  constructor(props) {
    super();
    const text = props.messages;

    this.state = {
      value: text[text.length-1],
      loading: !isLocalhost,
    }
  }

  componentDidMount() {
    if (!isLocalhost)
      setTimeout(() => {
        this.setState({loading: false});
        this.props.triggerNextStep();
      }, this.state.value.length*70);
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return <Loading />
    }

    return (
      <div>{ this.state.value }</div>
    )

  }
}

export default Message;