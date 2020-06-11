const express = require('express');
const morgan = require('morgan');
const dao = require('./dao.js');

const PORT = 3001;
const BASEURI = '/api';

const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

app = new express();

app.use(morgan('combined'));
app.use(express.json());

app.get(BASEURI + '/public', (req, res) => {

    dao.getCarList()
        .then((cars) => res.json(cars))
        .catch((err) => res.status(500).json(dbErrorObj));

});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));