import React, { useState, useEffect } from 'react';

import Table from 'react-bootstrap/Table';

function CarListBody() {
    const [data, setData] = useState({ list: [] });

    useEffect(() => {
        console.log("ciao");
    });

    return <Table striped bordered hover>
        <thead>
            <tr>
                <th>#</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Category</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
            </tr>
            <tr>
                <td>3</td>
                <td colSpan="2">Larry the Bird</td>
                <td>@twitter</td>
            </tr>
        </tbody>
    </Table>

}

export default CarListBody;