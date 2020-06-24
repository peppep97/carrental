import React, { useState, useEffect } from 'react';
import API from '../API';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Typeahead } from 'react-bootstrap-typeahead';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faCar, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

function CarListBody() {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    const categories = [{ category: "A" }, { category: "B" }, { category: "C" }, { category: "D" }, { category: "E" }]

    useEffect(() => {
        setLoading(true);
        API.getCarList()
            .then((cars) => {
                setData(cars);
                const carBrands = [...new Set(cars.map(c => c.brand))].sort();
                setBrands(carBrands);
            });
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);

        if (selectedCategories.length === 0 && selectedBrands.length === 0) {
            setSelectedData(data); //set original values when filters have been cleared
        } else {
            let filteredData = [];
            if (selectedBrands.length === 0) { //filter only on category if no brands are selected
                filteredData = data.filter((c) => selectedCategories.find((obj => obj.category === c.category)));
            } else if (selectedCategories.length === 0) { //filter only on brands if no categories are selected
                filteredData = data.filter((c) => selectedBrands.find((obj => obj === c.brand)));
            } else { //filter both on categories and brands if they are both selected
                filteredData = data.filter((c) => selectedCategories.find((obj => obj.category === c.category)) && selectedBrands.find((obj => obj === c.brand)));
            }
            setSelectedData(filteredData);
        }

        setLoading(false);
    }, [data, selectedCategories, selectedBrands]);

    if (loading)
        return <Spinner animation="border" variant="primary" />

    return <><h2>Car List</h2>
        <Form className="full-width">
            <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend"><FontAwesomeIcon icon={faList} /></InputGroup.Text>
                        </InputGroup.Prepend>
                        <Typeahead
                            id="category"
                            labelKey="category"
                            placeholder="Category"
                            multiple={true}
                            selected={selectedCategories}
                            options={categories}
                            onChange={(selected) => setSelectedCategories(selected)}
                        />
                    </InputGroup>

                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend"><FontAwesomeIcon icon={faCar} /></InputGroup.Text>
                        </InputGroup.Prepend>
                        <Typeahead
                            id="brand"
                            labelKey="brand"
                            placeholder="Brand"
                            multiple={true}
                            selected={selectedBrands}
                            options={brands}
                            onChange={(selected) => setSelectedBrands(selected)}
                        />
                    </InputGroup>
                </Form.Group>
            </Form.Row>
        </Form>

        {selectedData.length === 0 ? 
        <div className="custom-alert-message">
            <FontAwesomeIcon icon={faExclamationCircle} size="5x" color="grey"/>
            <p>No cars match defined filters</p>
        </div> : 
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
                    {selectedData != null ? selectedData.map((e) => <CarRow key={e.id} car={e} />) : ''}
                </tbody>
            </Table>
        </div>}
    </>
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