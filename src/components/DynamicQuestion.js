import { Loading } from 'react-simple-chatbot'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GetRandomMessage, { GetRandomQuestion } from '../lib/MessagesHelper';
import Recommend from '../lib/Recommend';

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
    this.setNextAction = this.setNextAction.bind(this);
    this.setRecommendaiton = this.setRecommendaiton.bind(this);
    this.messageController = this.messageController.bind(this);
  }

  messageController() {
    let { actions } = this.props;
    const { setState, getState } = actions;
    let featureKey = '';
    let waitAnswer = getState('waitAnswer');
    let currentContext = getState('currentContext');
    let features = getState('features');
    let books = getState('books');

    let nullFeatures = [];
    nullFeatures = this.validateFeatures(features);

    console.log(nullFeatures);

    // think of this „if, else if“ block below as messages router

    // if not waiting for answer
    if (!waitAnswer && currentContext === '' && nullFeatures.length > 0) {
      featureKey = this.getRandomFeature(nullFeatures);
      setState({ features, currentContext: featureKey, waitAnswer: true });
      this.setNextMessage(GetRandomQuestion(featureKey));

    } else if (currentContext !== '' && waitAnswer) {
      featureKey = currentContext;
      setState({waitAnswer: false});
      this.setNextAction(featureKey);

    } else if (currentContext !== '' && !waitAnswer) {

      const key = 'Action'+currentContext;
      const lastValue = this.props.steps[key].value;
      console.log(lastValue);
      features[currentContext] = lastValue;
      setState({currentContext: '', features: features});

      this.props.triggerNextStep();

    } else if (!waitAnswer && nullFeatures.length === 0) {

      if (books.length === 0) {

        setTimeout(() => {
          const recommendation = Recommend(features, 1);
          recommendation.then((result) => this.setRecommendaiton(result));
        }, 1500);


      } else {
        this.setNextMessage(GetRandomMessage('end'), true);
      }

    }

    //this.setMessage(GetRandomMessage(featureKey));


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

  setNextMessage(message, end = false) {
    let messages = this.props.messages;
    messages.push(message);

    this.setThatState({ messages: messages });

    const nextStep = (!end) ? 'showMessage' : 'showMessageEnd';

    if (message) {
      this.props.triggerNextStep({ trigger: nextStep, value: null });
    } else {
      this.props.triggerNextStep();
    }
  }

  setNextAction(context) {
    if (context) {
      this.props.triggerNextStep({ trigger: 'Action'+context, value: null });
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
      return <Loading />;
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