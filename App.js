import React, { Component } from 'react';
import './App.css';
import './data.json';
import nut from './nut.png';
import Button from '@material-ui/core/Button';

class App extends Component {  
  constructor(props) {
    super(props);
    this.state =
      {
        currentWord : [],
        currentScore : 0,
        lifes : 3,
        st : "start",
        animation : "App-logo",
        data : require('./data.json'),
        moving : false,
        animationDuring : 1000,
        maxCountLifes : 3,
        failedWords : []
      };

    this.runGame = this.runGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.incScore = this.incScore.bind(this);
    this.takeLife = this.takeLife.bind(this);
    this.changeWord = this.changeWord.bind(this);
  }

  changeWord() {
    const newWord = this.state.data[parseInt(Math.random() * Object.values(this.state.data).length)];
    this.setState(
      {
        currentWord : newWord,
        animation : "App-logo",
        moving : false,
      });
  }

  runGame() {
    this.setState(
      { 
        st : "run",
        currentScore : 0,
        lifes : this.state.maxCountLifes,
        failedWords : [] 
      }
    );
    this.changeWord();
  }

  gameOver() {
    setTimeout( () => {
      this.setState({ st : "over" });
    }, 900);
  }

  incScore() {
    this.setState({ currentScore : this.state.currentScore + 1 });
  }

  takeLife() {
    this.setState({ lifes : this.state.lifes - 1 });
    if (this.state.lifes === 0) {
      this.gameOver();
    }
  }

  handlePressEvent = (event) => {
    if (this.state.moving || this.state.st != "run") {
      return;
    }
    
    var isChoiseIT = false;
    if (event.code === "KeyD") {
      this.setState({animation : "App-logo-anim-right"})
    } else if (event.code === "KeyA") {
      this.setState({animation : "App-logo-anim-left"});
      isChoiseIT = true;
    } else {
      return;
    }

    this.setState({ moving : true });
    if ((this.state.currentWord.isIT === isChoiseIT)) {
      this.incScore();
    }
    else {
      const curr = this.state.currentWord
      let newFailed = this.state.failedWords;
      newFailed.push(curr);
      this.setState( {failedWords : newFailed} );
      this.takeLife();
    }
    setTimeout(this.changeWord, 900);
  }

  componentDidMount() {
    document.addEventListener("keypress", this.handlePressEvent);
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.handlePressEvent);
  }

  showFailedWords = () => {
    let words = [];
    for (let i = 0; i < this.state.failedWords.length; ++i) {
      words.push(<p>{this.state.failedWords[i].name} - {this.state.failedWords[i].definition}</p>)
    }
    return (
      <div>
        {words}
      </div>
    );
  }

  lifesTable = () => {
    let lifes = [];
    
    let i = 0;
    for (; i < this.state.lifes; ++i) {
      lifes.push(<td><img src={nut} className="Nut"></img></td>);
    }
    for (; i < this.state.maxCountLifes; ++i) {
      lifes.push(<td><img src={nut} className="Nut-shake"></img></td>)
    }

    return (
      <table className="Lifes">
        <tr>
          {lifes}
        </tr>
      </table>
    );
  }

  currentView() {
    if (this.state.st === "start") {
      return (<Button variant="raised" color="primary" onClick={this.runGame}>Start</Button>);
    }
    else if (this.state.st === "run") {
      return (
        <div>
          <p className='Score'>Score: {this.state.currentScore}</p>
          <p className={this.state.animation}>{this.state.currentWord.name}</p>
          <p>{this.lifesTable()}</p>
        </div>
      );
    }
    else if (this.state.st === "over") {
      return (
        <div>
          <p>GAME OVER</p>
          <p>Your score: {this.state.currentScore}</p>
          {this.showFailedWords()}
          <button className='Start-button' onClick={this.runGame}>Start</button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.currentView()}
        </header>
      </div>
    );
  }
}

export default App;
