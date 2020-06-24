import React from 'react';
import API from './API.js';
import NavBar from './components/NavBar.js';
import CarListBody from './components/CarListBody.js';
import CarRentalConfig from './components/CarRentalConfig.js';
import MyRentalsBody from './components/MyRentalsBody.js';
import LoginForm from './components/LoginForm.js';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loginError: null };
  }

  componentDidMount() {
    //check if the user is authenticated
    API.isAuthenticated().then(
      (user) => {
        this.setState({ user: user.username });
      }
    ).catch((err) => {
      this.setState({ user: null });
    });
  }

  login = (username, password) => {

    API.login(username, password).then((obj) => {
      this.setState({ loginError: null, user: obj.username });
      //this.loadInitialData();
    })
      .catch((err) => {
        this.setState({ loginError: err.code });
      });

  }

  logout = () => {
    API.logout().then(() => {
      setTimeout(() => { this.setState({ user: null }) }, 300);
    });
  }

  render() {
    return <div className="App">
      <Router>
        <NavBar user={this.state.user} logout={this.logout} />
        <Switch>
          <Route path="/login">
            <Container className="login-container">
              <h2>Login</h2>
              <LoginForm onLogin={this.login} loginError={this.state.loginError} logged={this.state.user}></LoginForm>
            </Container>
          </Route>
          <Route path="/myrentals">
            <Container className="custom-container">
              <Row>
                <MyRentalsBody></MyRentalsBody>
              </Row>
            </Container>
          </Route>
          <Route path="/" render={() => {
            if (this.state.user === null)
              return <Container className="custom-container">
                <Row>
                  <CarListBody/>
                </Row>
              </Container>
            return <Container className="config-container">
              <Row>
                <CarRentalConfig/>
              </Row>
            </Container>
          }}>
          </Route>
        </Switch>

      </Router>
    </div>

  }

}

export default App;
