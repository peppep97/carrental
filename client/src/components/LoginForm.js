import React, { useState, useCallback } from 'react';
import API from '../API';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons'

class LoginForm extends React.Component {

    constructor(props) {

        super(props);

        this.state = { validated: false };
    }

    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    validateForm = (event) => {
        event.preventDefault();
        this.setState({ validated: false });
        if (this.form.checkValidity()) {
            this.props.onLogin(this.state.username, this.state.password);
        } else {
            event.stopPropagation();
            this.setState({ validated: true });
        }
    }

    render() {

        return <Card
            bg={"light"}
            style={{ width: '20rem' }}>
            <Card.Body>
                <Form noValidate validated={this.state.validated} onSubmit={this.validateForm} ref={form => this.form = form}>
                    <Form.Group controlId="validationCustomUsername">
                        <Form.Label>Username</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                name="username"
                                type="text"
                                placeholder="Username"
                                aria-describedby="inputGroupPrepend"
                                required
                                isInvalid={this.props.loginError === 1 ? true : false}
                                onChange={(e) => this.updateField(e.target.name, e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.props.loginError === 1 ? 'Username not exists' : 'Please provide a username'}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>

                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputPassword"><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                name="password"
                                type="password"
                                placeholder="Password"
                                aria-describedby="inputPassword"
                                required
                                isInvalid={this.props.loginError === 2 ? true : false}
                                onChange={(e) => this.updateField(e.target.name, e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.props.loginError === 2 ? 'Password is wrong.' : 'Please provide a password'}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    }
}

export { LoginForm };