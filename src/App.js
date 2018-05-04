import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import './App.css';

const defaultSteps = [
  {
    id: 1,
    message: 'Ahoj, já jsem robot Petr',
    trigger: 2,
  },
  {
    id: 2,
    trigger: 3,
    message: 'Můžu vám pomoci s výběrem knihy?'
  },
  {
    id: 3,
    options: [
      { value: 1, label: 'Jasně!' },
      { value: 2, label: 'ne'}
    ],
  },
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
        <ThemeProvider theme={theme}>
          <ChatBot
            bubbleStyle={{
              boxShadow: 'none',
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
