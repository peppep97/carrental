const express = require('express');
const morgan = require('morgan');
const dao = require('./dao.js');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

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
        .catch((err) => res.status(500).json(dbErrorObj));

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
        .catch((err) => res.status(500).json({ param: 'Server', code: 1, msg: 'wrong username' }));

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
            (err) => {
                res.status(401).json(authErrorObj);
            }
        );
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));