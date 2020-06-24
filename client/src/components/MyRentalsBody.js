import React, { useState, useEffect } from 'react';
import API from '../API';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Row from 'react-bootstrap/Row';

function MyRentalsBody() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [futureRentals, setFutureRentals] = useState(true);

    async function getData() {
        setLoading(true);

        const rentals = await API.getRentalList(futureRentals);
        setData(rentals);

        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [futureRentals]);

    const deleteRental = async (id) => {

        const res = await API.deleteReservation(id);
        if (res.status === true){
            getData();
        }
    };

    return <>

        <Row className="title-row">
            <h2>{futureRentals ? 'Future' : 'Current or past'} Rentals</h2>
            <CurrentSwitch value={futureRentals} setFutureRentals={setFutureRentals}></CurrentSwitch>
        </Row>

        {loading ? <Spinner animation="border" variant="primary" /> :
            data.length === 0 ?
                <div className="custom-alert-message">
                    <FontAwesomeIcon icon={faExclamationCircle} size="5x" color="grey" />
                    <p>No {futureRentals ? 'future' : 'current or past'} rentals</p>
                </div> :
                <div className="table-wrapper">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Start date</th>
                                <th>End date</th>
                                <th>Category</th>
                                <th>Price</th>
                                {futureRentals ? <th>Action</th> : ''}
                            </tr>
                        </thead>
                        <tbody>
                            {data != null ? data.map((e, i) => <CarRow key={i} rental={e} futureRentals={futureRentals} deleteRental={deleteRental} />) : ''}
                        </tbody>
                    </Table>
                </div>}
    </>
}

function CarRow(props) {
    const [showDelete, setShowDelete] = useState(false);

    return <>
        <tr>
            <td>{moment(props.rental.startDate).format("DD-MM-YYYY")}</td>
            <td>{moment(props.rental.endDate).format("DD-MM-YYYY")}</td>
            <td>{props.rental.category}</td>
            <td>{props.rental.price} €</td>
            {props.futureRentals ? <td><Button variant="link" size="sm" onClick={() => setShowDelete(true)}> <FontAwesomeIcon icon={faTrashAlt} /></Button></td> : ''}
        </tr>
        <DeleteModal rentalId={props.rental.id} show={showDelete} setShowDelete={setShowDelete} deleteRental={props.deleteRental}></DeleteModal>
    </>
}

function DeleteModal(props) {
    const handleClose = () => props.setShowDelete(false);

    return <Modal show={props.show} onHide={handleClose} size="small">
        <Modal.Header closeButton>
            <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete the selected reservation?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="danger" onClick={() => {props.deleteRental(props.rentalId); props.setShowDelete(false);}}>Delete</Button>
        </Modal.Footer>
    </Modal>
}

function CurrentSwitch(props) {
    return <div className='custom-control custom-switch'>
        <input
            type='checkbox'
            className='custom-control-input'
            id='customSwitches'
            checked={props.value}
            onChange={(e) => props.setFutureRentals(e.target.checked)}
            readOnly
        />
        <label className='custom-control-label' htmlFor='customSwitches'>
            Future rentals
        </label>
    </div>
}

export default MyRentalsBody;