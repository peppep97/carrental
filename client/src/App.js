import React from 'react';
import logo from './logo.svg';
import './App.css';

import NavBar from './components/NavBar.js'
import CarListBody from './components/CarListBody.js'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class App extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    return <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/">
            <Container className="custom-container">
              <Row>
                <CarListBody></CarListBody>
              </Row>
            </Container>

          </Route>
        </Switch>

      </Router>
    </div>

  }

}

export default App;
