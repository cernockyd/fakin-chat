import React, { Component } from 'react';
import './App.css';
import logo from './static/logo.png';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import DynamicQuestion from './components/DynamicQuestion';
import GetRandomMessage from './lib/MessagesHelper';

const defaultSteps = [
  {
    id: 'SayHi',
    message: GetRandomMessage('SayHi'),
    trigger: 'SayHi2'
  },
  {
    id: 'SayHi2',
    message: GetRandomMessage('SayHi2'),
    trigger: 'intent1'
  },
  {
    id: 'intent1',
    options: [
        { value: 'true', label: GetRandomMessage('yes1'), trigger: 'intent' },
        { value: 'false', label: GetRandomMessage('no1'), trigger: 'dummy' }
    ]
  },
  {
    id: 'dummy',
    message: GetRandomMessage('dummy'),
    end: true
  },
  {
    id: 'intent',
    component: <DynamicQuestion />,
    replace: true,
    waitAction: true,
    asMessage: true,
    trigger: 'intent'
  }
];

const theme = {
  background: '#f5f8fb',
  fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto Oxygen-Sans,Ubuntu,Cantarell,“Fira Sans”,“Droid Sans”,Helvetica Neue,Helvetica,Hiragino Kaku Gothic Pro,Meiryo,Arial,sans-serif',
  headerBgColor: '#EF6C00',
  headerFontColor: '#fff',
  headerFontSize: '16px',
  botBubbleColor: '#9900FF',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#000',
};

const App = () => {
  return (
    <div className="App">
      <div className="BotWrapper">
        <a href="/"><img src={logo} className="logo" /></a>
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
            hideBotAvatar
            steps={defaultSteps}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}

export default App;
