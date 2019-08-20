import React, { Component } from 'react';
import './App.css';
import './data.json';
import belka_live from './belka_live.png';
import belka_run from './belka_run.png';
import belka_dead from './belka_dead.png';
import IT from './IT.png';
import notIT from './notIT.png'
import dellemc from './dellemc.png'
import axios from 'axios';
import { Input, Button, Table, FormControl, TableRow, TableCell, TableHead, TableBody, Paper, Slide, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@material-ui/core';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import gameOverLogo from './gameover.png'; 
import theme from './theme';
import themeWinner from './themeWinner';
import shortRow from './shortRow';
import greenWinner from './greenWinner';
import { func } from 'prop-types';


class App extends Component {  
  constructor(props) {
    super(props);

    let words = Object.values(require('./data.json'));
    for (let i = 0; i < words.length; ++i) {
      const randItem = parseInt(Math.random() * words.length);
      const tmp = words[randItem];
      words[randItem] = words[i];
      words[i] = tmp;
    }

    this.state =
      {
        currentWord : [],
        currentScore : 0,
        lifes : 3,
        st : "start",
        animation : "App-logo",
        data : words,
        moving : false,
        animationDuring : 1000,
        maxCountLifes : 3,
        failedWords : [],
        maxTimer : 5,
        currentTimer : 5,
        belkaIsRunning : false,
        currentName : "",
        errorName : false,
        records : [],
        shift : 0,
        nameAlredyExist : false,
      };

    this.runGame = this.runGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.incScore = this.incScore.bind(this);
    this.takeLife = this.takeLife.bind(this);
    this.changeWord = this.changeWord.bind(this);
    this.saveWrongAnswer = this.saveWrongAnswer.bind(this);
    this.openMainMenu = this.openMainMenu.bind(this);
    this.openRecords = this.openRecords.bind(this);
    this.checkName = this.checkName.bind(this);
    this.refuseName = this.refuseName.bind(this);
  }

  refuseName() {
    this.setState(
      {
        currentName : "",
        nameAlredyExist : false,
      }
    );
  }
  
  checkName () {
    this.runGame();
  }

  saveWrongAnswer() {
    const curr = this.state.currentWord
    let newFailed = this.state.failedWords;
    newFailed.push(curr);
    this.setState( {failedWords : newFailed} );
  }

  tickTack() {
    if ( this.state.st === "run" && !this.state.moving) {
      this.setState({ currentTimer : this.state.currentTimer - 1 });
      if ( this.state.currentTimer === 0 ) {
        this.failedByTimer();
      }  
    }
  }

  failedByTimer() {
    this.setState({animation : "App-logo-anim-failed-by-time"});
    this.takeLife();
    setTimeout( () => {
      this.changeWord();
    }, 1000);
    this.saveWrongAnswer();
    clearInterval(this.interval);
  }

  changeWord() {
    const isIT = Math.random() > 0.5;
    const size = this.state.data.length;
    let localShift = this.state.shift;
    let newRand;
    let newWord;
    do {
      newRand = parseInt((localShift + Math.random() * 0.2) * size);
      newWord = this.state.data[newRand];
      localShift += 0.1;
      if (localShift > 0.8) {
        localShift = 0;
      }
    } while ((newRand > size)
             || (newWord.isIT != isIT)
             || (this.state.currentWord != []) 
                 && (this.state.currentWord.name == newWord.name))
                 
    clearInterval(this.interval);
    this.setState(
      {
        belkaIsRunning : false,
        currentTimer : this.state.maxTimer,
        currentWord : newWord,
        animation : "App-logo",
        moving : false,
        shift : localShift
      });
    
    this.interval = setInterval(() => this.tickTack(), 1000);
  }

  openMainMenu() {
    this.setState(
      {
        st : "start",
        currentName : ""
      }
    );
  }
  
  openRecords() {
    this.setState( { st : "records" } );
  }

  runGame() {
    this.setState(
      { 
        errorName : false,
        st : "run",
        currentScore : 0,
        lifes : this.state.maxCountLifes,
        failedWords : [],
        nameAlredyExist : false,
      }
    );
    this.changeWord();
  }

  gameOver() {
    this.writeCurrentResult();
    setTimeout( () => {
      this.setState({ st : "over",})
    }, 900);
    clearInterval(this.interval);
  }

  incScore() {
    this.setState({ currentScore : this.state.currentScore + 1 });
  }

  takeLife() {
    this.setState(
      {
        belkaIsRunning : true, 
        lifes : this.state.lifes - 1 
      }
    );

    if (this.state.lifes === 0) {
      this.gameOver();
    }
  }

  handlePressEvent = (event) => {
    if (event.keyCode == 13) {
      if (this.state.st === "start") {
        this.checkName();
      }
      else if (this.state.st === "over") {
        this.openMainMenu();
      }
      else {
        return;
      }
    }
    if (this.state.moving || this.state.st !== "run") {
      return;
    }
    
    var isChoiseIT = false;
    if (event.keyCode === 39) {
      this.setState({animation : "App-logo-anim-right"})
    } else if (event.keyCode === 37) {
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
      this.saveWrongAnswer();
      this.takeLife();
    }
    setTimeout(this.changeWord, 900);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handlePressEvent);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handlePressEvent);
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
      lifes.push(<td><img src={belka_live} className="Belka-live"></img></td>);
    }
    if (this.state.belkaIsRunning) {
      lifes.push(<td><img src={belka_run} className="Belka-run"></img></td>);
      ++i;
    }
    for (; i < this.state.maxCountLifes; ++i) {
      lifes.push(<td><img src={belka_dead} className="Belka-dead"></img></td>);
    }

    return (
      <table className="Lifes">
        <tr>
          {lifes}
        </tr>
      </table>
    );
  }
  
  writeCurrentResult() {
    const newRecord = {
      "name" : this.state.currentName,  
      "score" : this.state.currentScore
    };
  }

  updateName = (event) => {
    this.setState( {currentName : event.target.value} );
  }

  recordTable() {
    const records = Object.values(this.state.records);
    let firstRecords = [];
    const countRecords = records.length > 10 ? 10 : records.length;
    let wasRecord = false;
    for (let i = 0; i < countRecords; ++i) {
      if (this.state.currentName === records[i].name && this.state.currentScore == records[i].score
          && !wasRecord && this.state.st === "over") {
        firstRecords.push(
        <MuiThemeProvider theme={themeWinner}>
          <TableRow>
            <MuiThemeProvider theme={greenWinner}>
              <TableCell align="right">{i + 1}</TableCell>
            </MuiThemeProvider>
            <TableCell>{records[i].name}</TableCell>
            <TableCell>{records[i].score}</TableCell>
          </TableRow>
        </MuiThemeProvider>
        );
        wasRecord = true;
      }
      else {
        firstRecords.push(
         <TableRow>
            <MuiThemeProvider theme={shortRow}>
              <TableCell align="right">{i + 1}</TableCell>
            </MuiThemeProvider>
            <TableCell>{records[i].name}</TableCell>
            <TableCell>{records[i].score}</TableCell>
          </TableRow>
        );
      }
    }
    
    return ( 
      <MuiThemeProvider theme={theme}>
        <hr className="verLine"></hr>
        <Table className="Records" manWidth='700'>
          <TableHead>
            <TableRow>
              <MuiThemeProvider theme={shortRow}>
                <TableCell align="right">#</TableCell>
              </MuiThemeProvider>
              <TableCell>Name</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {firstRecords}
          </TableBody>
        </Table>
     </MuiThemeProvider>
    )
  }

  confirmationDialog() {
    return (
      <Dialog open={this.state.nameAlredyExist}>
        <DialogContent>
          <DialogTitle>
          Такое имя уже существует
          </DialogTitle>
          <DialogContentText>
            Пожалуйста, поменяйте имя, если до этого вы с ним не играли. Продолжить играть с этим именем?
          </DialogContentText>
        </DialogContent>
        <MuiThemeProvider theme={theme}>
          <DialogActions>
            <Button variant="raised" color="primary" onClick={this.refuseName}>Поменять имя</Button>
            <Button variant="raised" color="primary" onClick={this.runGame}>Продолжить</Button>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog>
    )
  }

  currentView() {
    if (this.state.st === "start") {
      return (
        <div className="Text-left">
          <p>Определи, относится ли данная aббревиатура к IT или нет</p>
          <p>Используй ←, если да и →, если нет</p>
          <FormControl>
            <br></br>
            <div>
              <Button variant="raised" color="primary" onClick={this.checkName}>Start</Button>
            </div>
          </FormControl>
          {this.confirmationDialog()}
        </div>
      );
    }
    else if (this.state.st === "run") {
      return (
        <div>
          <div className="ITtext">
            <img src={IT} className='IT'></img>
             <p>IT</p>
          </div>
          <div className="notITtext">
            <img src={notIT} className='notIT'></img>
            <p>Not IT</p>
          </div>
          <p className='Score'>Score: {this.state.currentScore}</p>
          <p className='Timer'>{this.state.currentTimer}</p>
          <p className={this.state.animation}>{this.state.currentWord.name}</p>
          <p>{this.lifesTable()}</p>
        </div>
      );
    }
    else if (this.state.st === "over") {
      return (
        <div>
          <div className="Text-left">
            <img src={gameOverLogo} className="Game-over"></img>
            <br></br>
            <p>Your score: {this.state.currentScore}</p>
            <br></br>
            {this.showFailedWords()}
            <Button className="Button" variant="raised" color="primary" onClick={this.openMainMenu}>End</Button>
          </div>
        </div>
      )
    }
    else {
      console.error("Not valid state")
    }
  }

  render() {
    return (
      <div className="App">
        <header onKeyDown={this.arrow} className="App-header">
          {this.currentView()}
          <img src={belka_live} className="Belka-logo"></img>
          <img src={dellemc} className="DellEMC-logo"></img>
        </header>
      </div>
    );
  }
}

export default App;
