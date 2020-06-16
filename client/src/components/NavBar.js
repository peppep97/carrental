import React from 'react';

import Navbar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faSignInAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function NavBar(props) {

  return <Navbar expand="lg" variant="dark" fixed="top">
    <Link to="/" className="navbar-brand"><FontAwesomeIcon icon={faCar} />Car Rental</Link>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#link">Link</Nav.Link>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav>
        {props.user !== undefined && props.user !== null ?
          <NavDropdown title={<span><FontAwesomeIcon icon={faUser} /> {props.user}</span>} id="collasible-nav-dropdown">
            <NavDropdown.Item href="/#" onClick={() => props.logout()}><FontAwesomeIcon icon={faSignOutAlt} />&nbsp;Logout</NavDropdown.Item>
          </NavDropdown> :
          <Nav.Link href="/login"><FontAwesomeIcon icon={faSignInAlt} />&nbsp;Login</Nav.Link>}
      </Nav>
    </Navbar.Collapse>
  </Navbar>

}

export default NavBar;