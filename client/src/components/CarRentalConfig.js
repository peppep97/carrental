import React, { useState, useEffect, useRef } from 'react';
import API from '../API';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from "react-datepicker";
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faShoppingCart, faInfoCircle, faExclamationCircle, faCreditCard, faKey, faUser } from '@fortawesome/free-solid-svg-icons'

import "react-datepicker/dist/react-datepicker.css";
import { Redirect } from 'react-router-dom';

function CarRentalConfig() {
    const categories = [{ category: "A", price: 80 }, { category: "B", price: 70 }, { category: "C", price: 60 }, { category: "D", price: 50 }, { category: "E", price: 40 }]

    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [category, setCategory] = useState();
    const [age, setAge] = useState();
    const [extraDrivers, setExtraDrivers] = useState();
    const [kmPerDay, setKmPerDay] = useState();
    const [extraInsurance, setExtraInsurance] = useState(false);
    const [ageInvalid, setAgeInvalid] = useState(false);
    const [availableCar, setAvailableCar] = useState(-1);
    const [price, setPrice] = useState(-1);
    const [basePrice, setBasePrice] = useState(0);

    //set reference to the form
    const configForm = useRef(null);

    useEffect(() => {
        async function validateForm() {
            if (configForm.current.checkValidity()) {
                setAgeInvalid(false);
                setLoading(true);

                const startDateFormat = moment(startDate).format('YYYY-MM-DD');
                const endDateFormat = moment(endDate).format('YYYY-MM-DD');

                const res = await API.getCarAvaiability(startDateFormat, endDateFormat, category);

                const tot = res.tot;
                const busy = res.busy;

                const resFrequent = await API.getFrequentCustomer();
                const finishedRental = resFrequent.count;

                if (tot - busy > 0) { //check if there are available cars of that category on specified period
                    //compute price

                    let price = basePrice;
                    price = price * kmPerDay * extraDrivers;

                    if (age < 25)
                        price *= 1.05;
                    else if (age > 65)
                        price *= 1.10;

                    if (extraInsurance === true)
                        price *= 1.20;

                    if ((tot - busy) / tot < 0.10)
                        price *= 1.10;

                    if (finishedRental >= 3) //if user is frequent customer
                        price *= 0.90;

                    price = price.toFixed(2);

                    setPrice(price);
                }
                setAvailableCar(tot - busy);

                setLoading(false);

            } else {
                (age !== undefined && age < 18) ? setAgeInvalid(true) : setAgeInvalid(false);
            }
        }
        validateForm();

    }, [startDate, endDate, category, age, extraDrivers, kmPerDay, extraInsurance, basePrice]);

    return <><h2>Car Rental</h2>
        <Card
            bg={"light"}
            id="configCard">
            <Card.Body>
                <Card.Title>Rental configurator</Card.Title>
                <Form className="full-width" noValidate ref={configForm}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Start day</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                </InputGroup.Prepend>
                                <DatePicker className="form-control"
                                    placeholderText="Select start date"
                                    selected={startDate}
                                    onChange={date => { setStartDate(date); if (endDate === undefined || endDate.getTime() < date.getTime()) setEndDate(date); }}
                                    dateFormat="dd/MM/yyyy"
                                    showPopperArrow={false}
                                    minDate={new Date()}
                                    required
                                    noValidate
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>End day</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                </InputGroup.Prepend>
                                <DatePicker className="form-control"
                                    placeholderText="Select end date"
                                    selected={endDate}
                                    onChange={date => { setEndDate(date); if (startDate === undefined) setStartDate(date) }}
                                    dateFormat="dd/MM/yyyy"
                                    showPopperArrow={false}
                                    minDate={startDate}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Car Category</Form.Label>
                            <Form.Control as="select" custom required defaultValue="" onChange={e => { setBasePrice(e.target.value); setCategory(e.target.selectedOptions[0].text); }}>
                                <option value="" hidden >Select category</option>
                                {categories.map((c, i) => <option key={i} value={c.price}>{c.category}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Driver's age</Form.Label>
                            <Form.Control type="number" placeholder="Enter age" isInvalid={ageInvalid} required min={18} onChange={e => setAge(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                At least 18 years old
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Number of extra divers</Form.Label>
                            <Form.Control as="select" custom required defaultValue="" onChange={e => setExtraDrivers(e.target.value)}>
                                <option value="" hidden>Select extra drivers</option>
                                <option value={1}>0</option>
                                <option value={1.15}>1</option>
                                <option value={1.15}>2</option>
                                <option value={1.15}>3</option>
                                <option value={1.15}>4</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Estimated km per day</Form.Label>
                            <Form.Control as="select" custom required onChange={e => setKmPerDay(e.target.value)} defaultValue="">
                                <option value="" hidden>Select km per day</option>
                                <option value={0.95}>Less than 50 km/day</option>
                                <option value={1}>Less than 150 km/day</option>
                                <option value={1.05}>Unlimited km/day</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <div className="custom-control custom-checkbox">
                                <Form.Control type="checkbox" className="custom-control-input" id="defaultUnchecked" onChange={e => setExtraInsurance(e.target.checked)} />
                                <Form.Label className="custom-control-label" htmlFor="defaultUnchecked">Extra insurace</Form.Label>
                            </div>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Card.Body>
        </Card>

        {loading === true ? <Spinner animation="border" variant="primary" /> :
            availableCar > 0 ?
                <div className="reservation-table">
                    <TableResult availableCar={availableCar} price={price} startDate={startDate} endDate={endDate} category={category} />
                </div> :
                availableCar === 0 ?
                    <div className="custom-alert-message">
                        <FontAwesomeIcon icon={faExclamationCircle} size="5x" color="grey" />
                        <p>No cars of category {category} available for the specified period</p>
                    </div> :
                    <div className="custom-alert-message">
                        <FontAwesomeIcon icon={faInfoCircle} size="5x" color="grey" />
                        <p>Fill all form inputs to rent a car</p>
                    </div>}


    </>
}

function TableResult(props) {
    const [show, setShow] = useState(false);

    return <>
        <Table bordered striped>
            <thead>
                <tr>
                    <th>N. available cars</th>
                    <th>Price</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{props.availableCar}</td>
                    <td>{props.price} €/day</td>
                    <td><Button variant="primary" onClick={() => setShow(true)} ><FontAwesomeIcon icon={faShoppingCart} />&nbsp;Rent a car</Button></td>
                </tr>
            </tbody>
        </Table>
        <PaymentModal show={show} setShow={setShow} price={props.price} startDate={props.startDate} endDate={props.endDate} category={props.category}></PaymentModal>
    </>
}

function PaymentModal(props) {

    const [validated, setValidated] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [expDate, setExpDate] = useState("");
    const [fullName, setFullName] = useState("");
    const [rentalAdded, setRentalAdded] = useState(false);

    const paymentForm = useRef(null);

    const validateForm = (event) => {
        event.preventDefault();
        setValidated(false);
        if (paymentForm.current.checkValidity()) {
            const payload = { "cardNumber": cardNumber, "cvv": cvv, "expDate": expDate, "fullName": fullName };

            API.pay(payload)
                .then(res => {
                    if (res.status === true) {
                        const startDateFormat = moment(props.startDate).format('YYYY-MM-DD');
                        const endDateFormat = moment(props.endDate).format('YYYY-MM-DD');

                        const rental = { "startDate": startDateFormat, "endDate": endDateFormat, "price": props.price, "category": props.category };

                        API.addRental(rental)
                            .then(res => {
                                if (res.status === true) {
                                    props.setShow(false);
                                    setRentalAdded(true);
                                }
                            });
                    }
                });

        } else {
            event.stopPropagation();
            setValidated(true);
        }
    }

    //redirect to My Rentals page when a reservation has been insterted
    if (rentalAdded) {
        const showFuture = moment(props.startDate).isAfter(moment().toDate());
        return <Redirect to={{ pathname: "/myrentals", state: { showFuture: showFuture } }}></Redirect>
    }
    return <>
        <Modal show={props.show} onHide={() => props.setShow(false)} backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title>Payment Details</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={validateForm} ref={paymentForm}>
                <Modal.Body>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Credit card number</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text><FontAwesomeIcon icon={faCreditCard} /></InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="text" placeholder="Enter credit card number" required minLength="16" maxLength="16" pattern="[0-9]{16}"
                                    onChange={e => setCardNumber(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Provide a valid credit card number (16 numbers)
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>CVV</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="password" placeholder="Enter CVV" required minLength="3" maxLength="3" pattern="[0-9]{3}"
                                    onChange={e => setCvv(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Provide a valid CVV (3 numbers)
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Expiration date</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="text" placeholder="MM/YYYY" required minLength="7" maxLength="7" pattern="(0[1-9]|1[0-2])\/[1-9][0-9]{3}"
                                    onChange={e => setExpDate(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Provide a valid expiration date (format MM/YYYY)
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Full name</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="text" placeholder="Enter full name" required onChange={e => setFullName(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Provide a full name
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>

                </Modal.Body>

                <Modal.Footer className="custom-footer">
                    <p>Total: {props.price} €/day</p>
                    <Button variant="primary" type="submit">
                        Confirm payment
            </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
}

export default CarRentalConfig;