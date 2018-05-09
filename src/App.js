import React, { Component } from 'react';
import './App.css';
import JSONPretty from 'react-json-pretty';
import logo from './static/logo.png';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import DynamicQuestion from './components/DynamicQuestion';
import Message from './components/Message';
import Book from './components/Book';
import GetRandomMessage, { GetRandomAnswer } from './lib/MessagesHelper';
import { isLocalhost } from './registerServiceWorker';

const SayHi = GetRandomMessage('SayHi');
const SayHi2 = GetRandomMessage('SayHi2');
const SayHi3 = GetRandomMessage('SayHi3');
const SayHi4 = GetRandomMessage('SayHi4');

const stepsWithState = (state) => {
  const time = isLocalhost ? 0 : 80;

  return [
    {
      id: 'SayHi',
      message: SayHi,
      delay: SayHi.length*time,
      trigger: 'SayHi2'
    },
    {
      id: 'SayHi2',
      message: SayHi2,
      delay: SayHi2.length*time,
      trigger: 'ask1'
    },
    {
      id: 'SayHi3',
      message: SayHi3,
      delay: SayHi3.length*time,
      trigger: 'SayHi4'
    },
    {
      id: 'SayHi4',
      message: SayHi4,
      delay: SayHi4.length*time,
      trigger: 'loop'
    },
    {
      id: 'ask1',
      options: [
          { value: 'true', label: GetRandomMessage('yes1'), trigger: 'SayHi3' },
          { value: 'false', label: GetRandomMessage('no1'), trigger: 'dummy' }
      ],
    },
    {
      id: 'dummy',
      message: GetRandomMessage('dummy'),
      end: true
    },
    {
      id: 'loop',
      component: <DynamicQuestion {...state} />,
      replace: true,
      waitAction: true,
      asMessage: true,
      trigger: 'loop',
    },
    {
      id: 'showMessage',
      component: <Message messages={state.messages} />,
      asMessage: true,
      trigger: 'loop',
    },
    {
      id: 'showMessageEnd',
      component: <Message messages={state.messages} />,
      asMessage: true,
      end: true,
    },
    {
      id: 'showBook',
      component: <Book books={state.books} />,
      asMessage: false,
      trigger: 'loop',
    },
    {
      id: 'Actionpages',
      options: [
          { value: 'true', label: GetRandomAnswer('pages', 'true'), trigger: 'loop' },
          { value: 'false', label: GetRandomAnswer('pages', 'false'), trigger: 'loop' }
      ],
    },
  ];
}

const theme = {
  background: '#f5f8fb',
  fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto Oxygen-Sans,Ubuntu,Cantarell,“Fira Sans”,“Droid Sans”,Helvetica Neue,Helvetica,Hiragino Kaku Gothic Pro,Meiryo,Arial,sans-serif',
  headerBgColor: '#EF6C00',
  headerFontColor: '#fff',
  headerFontSize: '16px',
  botBubbleColor: '#FF9900',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#000',
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      features: {
        pages: null,
        type: null,
        theme: null,
        categories: null,
        mood: null,
        images: null
      },
      currentContext: '',
      waitAnswer: false,
      messages: [],
      books: [],
      actions: {
        setState: (obj) => this.setState(obj),
        getState: this.getState.bind(this)
      }
    }

  }

  getState(name) {
    return this.state[name];
  }

  render() {
    return (
      <div className="App">
      <div className="BotWrapper">
        {!isLocalhost && <a href="/"><img src={logo} alt="logo" className="logo" /></a>}
        <ThemeProvider theme={theme}>
          <ChatBot
            bubbleStyle={{
              lineHeight: 1.25,
              borderRadius: '18px',
              fontSize: '16px',
              padding: '8px 12px',
              borderBottom: '1px solid #ccc'
            }}
            style={{boxShadow: 'none', width: 320}}
            hideHeader
            footerStyle={{display: 'none'}}
            hideUserAvatar
            userDelay={0}
            botDelay={0}
            hideBotAvatar
            steps={stepsWithState(this.state)}
          />
        </ThemeProvider>
      </div>
      {isLocalhost &&
        <JSONPretty
          style={{
            resize: 'horizontal',
            background: '#000',
            color: '#fff',
            padding: 0,
            position: 'absolute',
            width: 300,
            zIndex: 10000,
            top: 0,
            margin: 0,
            left: 0,
            bottom: 0,
            overflow: 'auto',
          }}
          json={this.state}
        />
      }
      </div>
    );
  }

}

export default App;
