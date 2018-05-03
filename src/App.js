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
  headerFontSize: '15px',
  botBubbleColor: '#9900FF',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#727272',
};

const App = () => {
  return (
    <div className="App">
      <div className="BotWrapper" style={{marginTop: 40}}>
        <ThemeProvider theme={theme}>
          <ChatBot
            avatarStyle={{
              "WebkitAnimation": "Lmuha .3s ease forwards",
              "animation": "Lmuha .3s ease forwards",
              "borderRadius": "50%",
              "boxShadow": "none",
              "height": "40px",
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
            style={{width: '280px'}}
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
