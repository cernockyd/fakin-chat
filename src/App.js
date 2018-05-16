import React, { Component } from 'react';
import './App.css';
import JSONPretty from 'react-json-pretty';
import logo from './static/logo.png';
import bot from './static/bot.png';
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
  const time = isLocalhost ? 0 : 70;

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
      delay: 0,
      waitAction: true,
      asMessage: true,
      trigger: 'loop',
    },
    {
      id: 'showMessage',
      component: <Message messages={state.messages} />,
      asMessage: true,
      waitAction: true,
      delay: 0,
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
      id: 'Actionweights',
      options: [
          { value: 0, label: 'Téma', trigger: 'loop' },
          { value: 1, label: 'Žánr', trigger: 'loop' },
          { value: 1, label: 'Jak se u knihy cítím', trigger: 'loop' },
          { value: 2, label: 'Počet stran', trigger: 'loop' }
      ],
    },
    {
      id: 'Actionpages',
      options: [
          { value: 1, label: GetRandomAnswer('pages', 'true'), trigger: 'loop' },
          { value: 0, label: GetRandomAnswer('pages', 'false'), trigger: 'loop' }
      ],
    },
    {
      id: 'Actiontype',
      options: [
          { value: 0, label: 'Próza', trigger: 'loop' },
          { value: 1, label: 'Drama', trigger: 'loop' },
          { value: 2, label: 'Poezie', trigger: 'loop' }
      ],
    },
    {
      id: 'Actiontheme',
      options: [
          { value: 0, label: 'Život', trigger: 'loop' },
          { value: 1, label: 'Příroda', trigger: 'loop' },
          { value: 2, label: 'Válka', trigger: 'loop' },
          { value: 3, label: 'Volnočasové aktivity', trigger: 'loop' },
          { value: 4, label: 'Komunismus', trigger: 'loop' },
          { value: 5, label: 'Náboženství', trigger: 'loop' }
      ],
    },
    {
      id: 'Actioncategory',
      options: [
        { value: 0, label: 'historický román', trigger: 'loop' },
        { value: 1, label: 'román', trigger: 'loop' },
        { value: 2, label: 'humoristický román', trigger: 'loop' },
        { value: 3, label: 'komedie', trigger: 'loop' },
        { value: 4, label: 'literatura náuční', trigger: 'loop' },
        //{ value: 5, label: '', trigger: 'loop' },
        { value: 6, label: 'literatura pro deti', trigger: 'loop' },
        { value: 7, label: 'pohádky', trigger: 'loop' },
        { value: 8, label: 'biografický román', trigger: 'loop' },
        { value: 9, label: 'deníky', trigger: 'loop' },
        { value: 10, label: 'povídky', trigger: 'loop' },
        { value: 11, label: 'absurdní drama', trigger: 'loop' },
        { value: 12, label: 'novela', trigger: 'loop' },
        { value: 13, label: 'tragédie', trigger: 'loop' },
        { value: 14, label: 'duchovní literatura', trigger: 'loop' }
      ],
    },
    {
      id: 'Actionmood',
      options: [
          { value: 1, label: 'Šťastné', trigger: 'loop' },
          { value: 2, label: 'Smutné', trigger: 'loop' },
          { value: 0, label: 'Něco mezi', trigger: 'loop' }
      ],
    },
    {
      id: 'Actionimages',
      options: [
          { value: 0, label: GetRandomAnswer('images', 'true'), trigger: 'loop' },
          { value: 1, label: GetRandomAnswer('images', 'false'), trigger: 'loop' }
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
        category: null,
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
        <ThemeProvider theme={theme}>
          <ChatBot
            bubbleStyle={{
              lineHeight: 1.25,
              fontSize: '16px',
              padding: '8px 12px'
            }}
            style={{boxShadow: 'none', width: '100%', borderRadius: 0}}
            hideHeader
            footerStyle={{display: 'none'}}
            hideUserAvatar
            botAvatar={bot}
            avatarStyle={{
              "WebkitAnimation": "Lmuha .3s ease forwards",
              "animation": "Lmuha .3s ease forwards",
              "borderRadius": "50%",
              "boxShadow": "none",
              "height": "40px",
              "float": "left",
              "border": "1px solid #eff0f1",
              "background": "#fff",
              "minWidth": "40px",
              "padding": "2px",
              "WebkitTransform": "scale(0)",
              "MsTransform": "scale(0)",
              "transform": "scale(0)",
              "WebkitTransformOrigin": "bottom right",
              "MsTransformOrigin": "bottom right",
              "transformOrigin": "bottom right",
              "fontFamily": "sans-serif",
              "letterSpacing": "0.5px"
            }}
            userDelay={0}
            botDelay={isLocalhost ? 0 : 1000}
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
            position: 'fixed',
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
