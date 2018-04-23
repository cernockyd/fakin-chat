import React, { Component } from 'react';
import './App.css';
import avatar from './static/bot.jpg';
import ChatBot from 'react-simple-chatbot';

const defaultSteps = [{
  id: 1,
  message: 'Hello World',
  trigger: 2,
},
{
  id: 2,
  message: ({ previousValue, steps }) => 'Hello',
  trigger: ({ value, steps }) => '3',
},
{
  id: 3,
  message: 'Bye',
  end: true,
}];


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
              hideHeader
              hideUserAvatar
              botAvatar={avatar}
              steps={steps}
            />
            :
            <p style={{color: 'white', position: 'relative', zIndex: 100000}}>submit changes</p>
          }
        </div>
      </div>
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
    );
  }
}

export default App;
