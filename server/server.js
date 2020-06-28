const express = require('express');
const morgan = require('morgan');
const dao = require('./dao.js');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const { check, validationResult } = require('express-validator');

const PORT = 3001;
const BASEURI = '/api';

const dbErrorObj = { 'param': 'Server', 'msg': 'Database error' };

const jwtSecret = "9SMivhSVEMs8KMz3nSvEsbnTBT4YkKaY4pnS957cDG7BID6Z7ZpxUC0jgnEqR0Zm";

app = new express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

const expireTime = 3600 * 24 * 7; //7 days

app.get(BASEURI + '/public', (req, res) => {

    dao.getCarList()
        .then((cars) => res.status(200).json(cars))
        .catch(() => res.status(503).json(dbErrorObj));

});

app.post(BASEURI + '/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    dao.login(username, password)
        .then((result) => {
            if (result == false) {
                res.status(500).json({ param: 'Server', code: 2, msg: 'wrong password' });
            } else {
                const token = jsonwebtoken.sign({ username: username }, jwtSecret, { expiresIn: expireTime });
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                res.status(200).json({ username: username });
            }
        })
        .catch((err) => {
            if (err == null)
                res.status(500).json({ param: 'Server', code: 1, msg: 'wrong username' });
            else
                res.status(503).json(dbErrorObj);
        });

});

app.post(BASEURI + '/logout', (req, res) => {
    res.clearCookie('token').end();
});


//all next APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);


//get a user info (used by client to reauthenticate itself - getting its user info)
app.get(BASEURI + '/user', (req, res) => {
    const username = req.user.username;
    dao.getUserById(username)
        .then((user) => res.status(200).json({ username: user.username }))
        .catch(() => res.status(503).json(dbErrorObj));
});

//get number of available car of a given category for a given period
app.get(BASEURI + '/availability', (req, res) => {

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const category = req.query.category;

    dao.getCarAvaiability(startDate, endDate, category)
        .then((availability) => res.status(200).json(availability))
        .catch(() => res.status(503).json(dbErrorObj));
});

//stub payment api
app.post(BASEURI + '/pay', [
    check('cardNumber').isLength({ min: 16, max: 16 }),
    check('cvv').isLength({ min: 3, max: 3 }),
    check('expDate').matches("(0[1-9]|1[0-2])\/[1-9][0-9]{3}"),
    check('fullName').exists()
], (req, res) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        res.status(200).json({ "status": true });
    } else {
        res.status(422).json({ "status": false });
    }
});

//add a rental
app.post(BASEURI + '/addrental', [
    check('startDate').exists(),
    check('endDate').exists(),
    check('price').isNumeric(),
    check('category').exists()
], (req, res) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const price = req.body.price;
        const category = req.body.category;

        if (new Date(endDate) >= new Date(startDate)) {
            dao.addRental(startDate, endDate, price, category, req.user.username)
                .then(() => res.status(200).json({ "status": true }))
                .catch(() => res.status(503).json(dbErrorObj));
        } else {
            res.sendStatus(422);
        }
    } else {
        res.sendStatus(422);
    }
});

//check if user is a frequent user
app.get(BASEURI + '/isfrequent', (req, res) => {

    dao.getFrequentCustomer(req.user.username)
        .then((count) => res.json(count))
        .catch(() => res.status(503).json(dbErrorObj));
});

app.get(BASEURI + '/getrentals', (req, res) => {

    const future = req.query.future == "true"; //'covert' to boolean

    dao.getRentalList(future, req.user.username)
        .then((rentals) => res.json(rentals))
        .catch(() => res.status(503).json(dbErrorObj));

});

//delete a reservation
app.delete(BASEURI + '/delete/:reservationId', (req, res) => {

    const reservationId = req.params.reservationId;

    dao.deleteReservation(reservationId, req.user.username)
        .then(() => res.json({ "status": true }))
        .catch(() => res.status(503).json(dbErrorObj));
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));