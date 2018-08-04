import React from 'react';
import {
  Navbar,
  NavItem,
  Nav,
  NavDropdown,
  MenuItem,
  Button,
  FormGroup,
  FormControl,
  Modal
} from 'react-bootstrap';
import axios from 'axios';

import Favorites from './Favorites.jsx';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLogin: false,
      showSignup: false,
      showFavorites: false,
      favorites: []
    };

    this.showLogin = this.showLogin.bind(this);
    this.closeLogin = this.closeLogin.bind(this);

    this.showSignup = this.showSignup.bind(this);
    this.closeSignup = this.closeSignup.bind(this);

    this.showFavorites = this.showFavorites.bind(this);
    this.closeFavorites = this.closeFavorites.bind(this);
    this.getUserFavorites = this.getUserFavorites.bind(this);
  }

  closeLogin() {
    this.props.handleSession();

    this.setState({
      showLogin: false
    });
  }

  showLogin() {
    this.setState({
      showLogin: true
    });
  }

  closeSignup() {
    this.props.handleSession();

    this.setState({
      showSignup: false
    });
  }

  showSignup() {
    this.setState({
      showSignup: true
    });
  }

  showFavorites() {
    this.getUserFavorites();
    this.setState({
      showFavorites: true
    });
  }

  closeFavorites() {
    this.setState({
      showFavorites: false
    });
  }

  componentWillMount() {
    axios.get('/session').then((response) => {
      if (response.data.username) {
        // check to see if response.data exists
        // sets state of parent component

        this.props.handleSession(response);
      }
    });
    
    this.getUserFavorites();
  }

  getUserFavorites() {
    console.log(this.props.userId);
    axios
    .get('/favorites', {
      params: {
        user_id: this.props.userId
      }
    })
    .then((response) => {
      console.log(response.data);
      this.setState({
        favorites: response.data
      });
    })
    .catch((err) => {
      console.error('Error getting favorites', err);
    });
  }

  render() {
    const enabled =
      this.props.username.length > 0 && this.props.password.length > 0;

    if (this.props.loggedIn) {
      return (
        <div>
          <Navbar inverse fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">STUD(y)</a>
              </Navbar.Brand>
            </Navbar.Header>

            <Nav pullRight>
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <MenuItem>Signed in as {this.props.username}</MenuItem>
                <MenuItem onClick={this.props.showMain}>Main</MenuItem>
                <MenuItem onClick={this.showFavorites}>Favorites</MenuItem>
                <MenuItem onClick={this.props.showStudyCards}>Flashcards</MenuItem>
                <MenuItem divider />
                <MenuItem
                  onClick={() => {
                    return this.props.logout();
                  }}
                >
                  Logout
                </MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar>

          <Favorites
            favorites={this.state.favorites}
            userId={this.props.userId}
            getUserFaves={this.getUserFaves}
            showFavorites={this.state.showFavorites}
            closeFavorites={this.closeFavorites}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Navbar inverse fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="">STUD(y)</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>

            <Navbar.Collapse>
              <Nav pullRight>
                <NavItem show="false" onClick={this.showLogin}>
                  Login
                </NavItem>
                <NavItem onClick={this.showSignup}> Register </NavItem>
              </Nav>

              <Modal show={this.state.showLogin} onHide={this.closeLogin}>
                <Modal.Body>
                  <FormGroup>
                    <FormControl
                      type="text"
                      placeholder="username"
                      value={this.props.username}
                      onChange={(e) => {
                        this.props.handleUser(e);
                      }}
                    />
                    <FormControl
                      type="password"
                      placeholder="password"
                      value={this.props.password}
                      onChange={(e) => {
                        this.props.handlePassword(e);
                      }}
                    />

                  </FormGroup>

                  <Button
                    disabled={!enabled}
                    type="submit"
                    onClick={this.props.loginUser}
                  >
                    Log In
                  </Button>
                </Modal.Body>
              </Modal>

              <Modal show={this.state.showSignup} onHide={this.closeSignup}>
                <Modal.Body>
                  <FormGroup>
                    <FormControl
                      type="text"
                      placeholder="username"
                      value={this.props.username}
                      onChange={(e) => {
                        this.props.handleUser(e);
                      }}
                    />
                    <FormControl
                      type="password"
                      placeholder="password"
                      value={this.props.password}
                      onChange={(e) => {
                        this.props.handlePassword(e);
                      }}
                    />
                    <FormControl
                      type="text"
                      placeholder="Card Number"
                      value={this.props.creditCard.number}
                      onChange={(e) => {
                        this.props.handleCreditCardNumber(e);
                      }}
                    />
                    <FormControl
                      type="text"
                      placeholder="Card Security Code"
                      value={this.props.creditCard.code}
                      onChange={(e) => {
                        this.props.handleCreditCardCode(e);
                      }}
                    />
                    <FormControl
                      type="text"
                      placeholder="Card Owner Full Name"
                      value={this.props.creditCard.name}
                      onChange={(e) => {
                        this.props.handleCreditCardName(e);
                      }}
                    />
                    <FormControl
                      type="text"
                      placeholder="Card Expiration Month"
                      value={this.props.creditCard.month}
                      onChange={(e) => {
                        this.props.handleCreditCardMonth(e);
                      }}
                    />
                    <FormControl
                      type="text"
                      placeholder="Card Expiration Year"
                      value={this.props.creditCard.year}
                      onChange={(e) => {
                        this.props.handleCreditCardYear(e);
                      }}
                    />
                  </FormGroup>

                  <Button
                    disabled={!enabled}
                    type="submit"
                    value="Submit"
                    onClick={this.props.registerUser}
                  >
                    Register
                  </Button>
                </Modal.Body>
              </Modal>
            </Navbar.Collapse>
          </Navbar>
        </div>
      );
    }
  }
}

export default Header;
