import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Alert from 'react-s-alert';

import Header from './components/header.jsx';
import Search from './components/Search.jsx';
import Display from './components/Display.jsx';

import FlashcardMain from './components/FlashcardMain.jsx'
import Favorites from './components/Favorites.jsx';

import './s-alert-default.css';
import './style.css';

import {Tabs, Tab} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cafes: [],
      username: '',
      password: '',
      userId: '',
      creditCard: {
        number: '',
        name: '',
        code: '',
        month: '',
        year: '',
      },
      loggedIn: false,
      showIndivCafe: false,
      showFavorites: false,
      showStudyCards: false,
      flashcardDeckNames: []
    };

    var hello = 'hello';

    this.handleYelp = this.handleYelp.bind(this);

    this.handleUser = this.handleUser.bind(this);
    this.handlePassword = this.handlePassword.bind(this);

    this.handleCreditCardNumber = this.handleCreditCardNumber.bind(this);
    this.handleCreditCardName = this.handleCreditCardName.bind(this);
    this.handleCreditCardCode = this.handleCreditCardCode.bind(this);
    this.handleCreditCardMonth = this.handleCreditCardMonth.bind(this);
    this.handleCreditCardYear = this.handleCreditCardYear.bind(this);

    this.loginUser = this.loginUser.bind(this);
    this.registerUser = this.registerUser.bind(this);

    this.logout = this.logout.bind(this);
    this.handleSession = this.handleSession.bind(this);

    this.handleYelp = this.handleYelp.bind(this);
    this.renderIndivCafe = this.renderIndivCafe.bind(this);

    this.showStudyCards = this.showStudyCards.bind(this);
    this.showMain = this.showMain.bind(this);

    this.fetchDeckNames = this.fetchDeckNames.bind(this);
  }

  handleYelp(data) {
    this.setState({
      cafes: data
    });
  }

  handleUser(e) {
    this.setState({
      username: e.target.value
    });
  }

  handlePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  
  handleCreditCardNumber(e) {
    let stateCard = Object.assign({}, this.state.creditCard);
    stateCard.number = e.target.value
    this.setState ({
      creditCard: stateCard
    })
  }  
  handleCreditCardName(e) {
    let stateCard = Object.assign({}, this.state.creditCard);
    stateCard.name = e.target.value
    this.setState ({
      creditCard: stateCard
    })
  }  
  handleCreditCardCode(e) {
    let stateCard = Object.assign({}, this.state.creditCard);
    stateCard.code = e.target.value
    this.setState ({
      creditCard: stateCard
    })
  }  
  handleCreditCardMonth(e) {
    let stateCard = Object.assign({}, this.state.creditCard);
    stateCard.month = e.target.value
    this.setState ({
      creditCard: stateCard
    })
  }  
  handleCreditCardYear(e) {
    let stateCard = Object.assign({}, this.state.creditCard);
    stateCard.year = e.target.value
    this.setState ({
      creditCard: stateCard
    })
  }
  
  loginUser() {
    axios
      .post('/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then((response) => {
        // response.data returns userId

        this.setState({
          loggedIn: true,
          userId: response.data
        })
      })
      .catch((err) => {
        console.error('Username or password is incorrect', err);

        Alert.error('Incorrect username or password', {
          position: 'bottom'
        });
      });
  }

  registerUser() {
    axios
      .post('/register', {
        username: this.state.username,
        password: this.state.password,
        creditCard: this.state.creditCard
      })
      .then((response) => {
        // response.data returns userId

        this.setState({
          loggedIn: true,
          userId: response.data
        });
      })
      .catch((err) => {
        console.error('Error registering', err);
      });
  }

  logout() {
    axios.get('/logout').then(() => {
      this.setState({
        username: '',
        userId: '',
        loggedIn: false
      });
    });
  }

  handleSession(response) {
    if (!response) {
      this.setState({
        username: '',
        password: ''
      });
    } else {
      this.setState({
        username: response.data.username,
        userId: response.data.userId,
        loggedIn: response.data.login
      });
    }
  }

  renderIndivCafe(bool) {
    this.setState({
      showIndivCafe: bool
    });
  }

  showStudyCards() {
    this.setState({showStudyCards: true})
  }

   


  showMain() {
    this.setState({showStudyCards: false})
  }

  fetchDeckNames() {
    axios.get('/flashcardDecks', {params : {user_id: this.state.userId}})
         .then((res) => this.setState({flashcardDeckNames: res.data}))
         .catch((err) => console.error('someone went wrong fetching the deck names: ', err))
  }

  render() {
    return (
      <div align="center">
        <Header
          username={this.state.username}
          password={this.state.password}
          creditCard={this.state.creditCard}
          userId={this.state.userId}
          loggedIn={this.state.loggedIn}
          handleUser={this.handleUser}
          handlePassword={this.handlePassword}
          handleCreditCardNumber={this.handleCreditCardNumber}
          handleCreditCardName={this.handleCreditCardName}
          handleCreditCardCode={this.handleCreditCardCode}
          handleCreditCardMonth={this.handleCreditCardMonth}
          handleCreditCardYear={this.handleCreditCardYear}
          loginUser={this.loginUser}
          registerUser={this.registerUser}
          logout={this.logout}
          handleSession={this.handleSession}
          showMain={this.showMain}
          showStudyCards={this.showStudyCards}
        />

        <div className="parallax" />

        {
          this.state.showStudyCards ? 
          <FlashcardMain user_id = {this.state.userId} fetchDeckNames = {this.fetchDeckNames} 
          deckNames = {this.state.flashcardDeckNames} />
          : 
          <div>
            {
              this.state.showFavorites ?
              <Favorites />
              : null
            }

            <div align="center">
              <Search
                handleYelp={this.handleYelp}
                renderIndivCafe={this.renderIndivCafe}
              />
            </div>

            <div>
              <Display
                cafes={this.state.cafes}
                username={this.state.username}
                userId={this.state.userId}
                loggedIn={this.state.loggedIn}
                showIndivCafe={this.state.showIndivCafe}
                renderIndivCafe={this.renderIndivCafe}
                creditCard={this.state.creditCard}
              />
            </div>
          </div>
        }


        <Alert stack={{ limit: 1 }} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
