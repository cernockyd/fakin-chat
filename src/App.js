import React, { Component } from 'react';
import './App.css';
import avatar from './static/bot.jpg';
import ChatBot from 'react-simple-chatbot';

const defaultSteps = [
{
  id: 1,
  message: 'Ahoj, já jsem robot Petr',
  trigger: 2,
},
{
  id: 2,
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


class App extends Component {

  constructor() {
    super();

    this.state = {
      steps: defaultSteps,
      debugChange: false,
      debugSteps: JSON.stringify(defaultSteps)
    }

  }

  render() {
    const {steps, debugSteps, debugChange} = this.state;

    return (
      <div><div className="App">
        <div className="BotWrapper" style={{marginTop: 40}}>
          {!debugChange ?
            <ChatBot
              bubbleStyle={{
                background: '#9900FF',
                letterSpacing: '0.5px',
                fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto Oxygen-Sans,Ubuntu,Cantarell,“Fira Sans”,“Droid Sans”,Helvetica Neue,Helvetica,Hiragino Kaku Gothic Pro,Meiryo,Arial,sans-serif'
              }}
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
              botAvatar={avatar}
              steps={steps}
            />
            :
            <p style={{color: 'white', position: 'relative', zIndex: 100000}}>submit changes</p>
          }
        </div>
      </div>
      { false &&
        <div style={{
        fontFamily: 'monospace',
        background: 'white',
        padding: 20,
        zIndex: 10000,
        overflow: 'scroll',
        height: 200,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <div>
          <h4>Debugging:</h4>
          <button style={{}} disabled onClick={() => {
            const newSteps = JSON.parse(debugSteps);
            this.setState({steps: newSteps, debugChange: false})
          }}>Load</button>
          <textarea
            style={{fontFamily: 'monospace', width: '100%', height: 200}}
            value={debugSteps}
            onChange={(e) => {
              this.setState({ debugSteps: e.target.value, debugChange: false });
            }}
          />
        </div>
      </div>
      }
    </div>
    );
  }
}

export default App;
