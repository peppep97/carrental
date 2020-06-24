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
        {props.user !== undefined && props.user !== null ?
          <><Link to="/" className="nav-link">Rental configuration</Link>
            <Link to="/myrentals" className="nav-link">My rentals</Link></> : ''}
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