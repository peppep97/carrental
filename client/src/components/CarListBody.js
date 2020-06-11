import React, { useState, useEffect } from 'react';
import API from '../API';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

function CarListBody() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        API.getCarList()
        .then((cars) => {
            setData(cars);
        });
        setLoading(false);
    }, []);



    if (loading)
        return <Spinner animation="border" variant="primary" />

    return <><h2>Car List</h2>
    <div className="table-wrapper">
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                {data != null ? data.map((e) => <CarRow key={e.id} car={e} />) : ''}
            </tbody>
        </Table></div></>
}

function CarRow(props) {
    return <tr>
        <td>{props.car.id}</td>
        <td>{props.car.brand}</td>
        <td>{props.car.model}</td>
        <td>{props.car.category}</td>
    </tr>
}

export default CarListBody;