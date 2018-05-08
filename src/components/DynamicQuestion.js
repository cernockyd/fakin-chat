import ChatBot, { Loading } from 'react-simple-chatbot'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GetRandomMessage from '../lib/MessagesHelper';

export default class DynamicQuestion extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
      steps: {}
    }

    this.setThatState = this.props.actions.setState;

    // console.log('triggered: DynamicQuestion');
    // console.log('previousStep:', props.previousStep);

    // console.log(this.props.actions);

    this.setNextMessage = this.setNextMessage.bind(this);
    this.setRecommendaiton = this.setRecommendaiton.bind(this);
    this.messageController = this.messageController.bind(this);
  }

  messageController() {
    const { features, actions, books } = this.props;
    let messages = this.props.messages;
    const { setState, getState } = actions;
    let featureKey = '';

    let nullFeatures = this.validateFeatures(features);
    if (nullFeatures.length > 0) {
      featureKey = this.getRandomFeature(nullFeatures);
    }

    this.setMessage(GetRandomMessage(featureKey));

    if (books.length == 0) {
      this.setRecommendaiton({
        image: 'http://www.levneknihkupectvi.cz/images/products/22397.jpg',
        name: 'Lovci mamutů',
        author: 'Eduard Štorch',
        description: 'popisssss'
      });
    }

    this.setMessage(GetRandomMessage(featureKey));



  }

  validateFeatures(features) {
    let arr = [];
    for (var key in features) {
      if (features.hasOwnProperty(key) && features[key] == null) {
        arr.push(key);
      }
    }
    return arr;
  }

  getRandomFeature(features) {
    return features[Math.floor(Math.random() * features.length)];
  }

  setMessage(message) {
    let messages = this.props.messages;
    messages.push(message);

    this.setThatState({messages: messages});
    this.setState({ loading: false, result: message });
  }

  setRecommendaiton(book) {
    let books = this.props.books;
    books.push(book);
    this.setThatState({books: books});
    if (book) {
      this.props.triggerNextStep({ trigger: 'showBook', value: null });
    }
  }

  setNextMessage(message) {
    let messages = this.props.messages;
    messages.push(message);

    this.setThatState({ messages: messages });

    const nextStep = this.props.messages.length < 10 ? 'showMessage' : 'showMessageEnd';

    if (message) {
      this.props.triggerNextStep({ trigger: nextStep, value: null });
    } else {
      this.props.triggerNextStep();
    }
  }

  componentDidMount() {
    this.messageController();
  }


  render () {
    const { loading, result } = this.state

    if (loading) {
      return <Loading />
    } else {
      return result;
    }

  }

}

DynamicQuestion.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
  step: PropTypes.object,
  previousStep: PropTypes.object,
}

DynamicQuestion.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
  step: undefined,
  previousStep: undefined,
}