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
    let features = getState('features');
    const ask1Value = this.props.steps['ask1'].value;
    if (ask1Value === 0) {
      features = {
        pages: this.getRandomBetween(1),
        type: this.getRandomBetween(2),
        theme: this.getRandomBetween(5),
        category: this.getRandomBetween(14),
        mood: this.getRandomBetween(2),
        images: this.getRandomBetween(1)
      };
      setState({features: features});
    } else {

    }

    let featureKey = '';
    let featureActionKey = '';
    let waitAnswer = getState('waitAnswer');
    let currentContext = getState('currentContext');
    let end = getState('end');
    let books = getState('books');

    let nullFeatures = [];
    nullFeatures = this.validateFeatures(features);


    if (currentContext === 'category') {
      switch (features.type) {
        case 0:
          featureActionKey = 'Proza';
          break;
        default:
          featureActionKey = 'Drama';
      }
    }

    // think of this „if, else if“ block below as messages router

    // if not waiting for answer
    if (!waitAnswer && currentContext === '' && nullFeatures.length > 0) {
      if (features.type === null) {
        featureKey = this.getRandomFeature(nullFeatures.filter(function(item) {
          return item !== 'category';
        }));
      } else {
        featureKey = this.getRandomFeature(nullFeatures);
      }

      setState({ features, currentContext: featureKey, waitAnswer: true });
      this.setNextMessage(GetRandomQuestion(featureKey));

    } else if (currentContext !== '' && waitAnswer) {
      // next action

      featureKey = featureActionKey+currentContext;

      setState({waitAnswer: false});
      this.setNextAction(featureKey);

    } else if (currentContext !== '' && !waitAnswer) {
      // get value from last action

      const key = 'Action'+featureActionKey+currentContext;
      const lastValue = this.props.steps[key].value;
      // if poezie
      if (currentContext === 'type' && lastValue === 2) {
        features['category'] = 5; // based on books metadata
      }
      features[currentContext] = lastValue;
      setState({currentContext: '', features: features});

      this.props.triggerNextStep();

    } else if (!waitAnswer && nullFeatures.length === 0) {

      switch (end) {
        case 0:
          const k = books.length;
          setTimeout(() => {
            const recommendation = Recommend(features, k+1);
            recommendation.then((result) => this.setRecommendaiton(result));
          }, 1500);
          if (k === 0) {
            setState({end: 1});
          } else {
            setState({end: 2});
          }
          break;
        case 1:
          if (books.length === 1) {
            if (ask1Value === 0) {
              this.setNextMessage(GetRandomMessage('endAlternate'));
            } else {
              this.setNextMessage(GetRandomMessage('end'));
            }
          }
          setState({end: 2});
          break;
        case 2:
          setState({end: 3});
          if (books.length === 3) {
            this.setNextAction('endReload');
          } else {
            this.setNextAction('end');
          }
          break;
        case 3:
          let lastValue = 1;
          if (books.length === 3) {
            lastValue = this.props.steps['ActionendReload'].value;
          } else {
            lastValue = this.props.steps['Actionend'].value;
          }

          if (lastValue === 0) {
            setState({end: 0});
            this.props.triggerNextStep();
          } else {
            window.location.reload();
          }

          break;
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

  getRandomBetween(max) {
    return Math.floor(Math.random() * max);
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