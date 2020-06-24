const express = require('express');
const morgan = require('morgan');
const dao = require('./dao.js');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const { check, validationResult } = require('express-validator');

const PORT = 3001;
const BASEURI = '/api';

const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

const jwtSecret = "9SMivhSVEMs8KMz3nSvEsbnTBT4YkKaY4pnS957cDG7BID6Z7ZpxUC0jgnEqR0Zm";

app = new express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

const expireTime = 3600 * 24 * 7; //7 days

app.get(BASEURI + '/public', (req, res) => {

    dao.getCarList()
        .then((cars) => res.json(cars))
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
                res.json({ username: username });
            }
        })
        .catch(() => res.status(500).json({ param: 'Server', code: 1, msg: 'wrong username' }));

});

app.post(BASEURI + '/logout', (req, res) => {
    res.clearCookie('token').end();
});


// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

app.get(BASEURI + '/user', (req, res) => {
    const username = req.user.username;
    dao.getUserById(username)
        .then((user) => {
            res.json({ username: user.username });
        }).catch(
            () => {
                res.status(503).json(dbErrorObj);
            }
        );
});

app.get(BASEURI + '/availability', (req, res) => {

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const category = req.query.category;

    dao.getCarAvaiability(startDate, endDate, category)
        .then((availability) => {
            res.json(availability);
        }).catch(
            () => {
                res.status(503).json(dbErrorObj);
            }
        );
});

app.post(BASEURI + '/pay', [
    check('cardNumber').isLength({ min: 16, max: 16 }),
    check('cvv').isLength({ min: 3, max: 3 }),
    check('expDate').matches("(0[1-9]|1[0-2])\/[0-9]{4}"),
    check('fullName').exists()
], (req, res) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        res.status(200).json({ "status": true });
    } else {
        res.status(422).json({ "status": false });
    }
});

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
                .then(() => {
                    res.json({ "status": true });
                }).catch(
                    () => {
                        res.status(503).json(dbErrorObj);
                    }
                );
        }else{
            res.sendStatus(422);
        }
    } else {
        res.sendStatus(422);
    }
});

app.get(BASEURI + '/isfrequent', (req, res) => {

    dao.getFrequentCustomer(req.user.username)
        .then((count) => {
            res.json(count);
        }).catch(
            () => {
                res.status(503).json(dbErrorObj);
            }
        );
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
        .then(() =>  res.json({ "status": true }))
        .catch(() => res.status(503).json(dbErrorObj));
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));