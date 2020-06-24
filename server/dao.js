'use strict'

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

const db = new sqlite.Database('db/car_rental.db', (err) => {
    if (err) {
        throw err;
    }
});

exports.getUserById = function (username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE username = ?';
        db.get(sql, [username], (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

exports.getCarList = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM car';
        db.all(sql, (err, cars) => {
            if (err) {
                reject(err);
            } else {
                resolve(cars);
            }
        });
    });
};

exports.login = function (username, password) {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT password, COUNT(*) AS count FROM user WHERE username = ?';
        db.get(sql, [username], (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.count == 0) {
                    reject(err);
                } else {
                    bcrypt.compare(password, res.password, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }

            }
        });
    });
};

exports.getCarAvaiability = function (start, end, category) {
    return new Promise((resolve, reject) => {
        const sql = 'select (select COUNT(*) from car where category = ?) as tot, COUNT(*) as busy from rental where ((? <= startDate and ? >= startDate) or (? >= startDate and ? <= endDate) or (? <= endDate and ? >= endDate)) and category = ?';
        db.get(sql, [category, start, end, start, end, start, end, category], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }

        });
    });
}

exports.addRental = function (startDate, endDate, price, category, username) {
    return new Promise((resolve, reject) => {

        const sql = 'INSERT INTO rental (startDate, endDate, category, price, user) VALUES (?,?,?,?,?)';

        db.run(sql, [startDate, endDate, category, price, username], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });

    });
};

exports.getFrequentCustomer = function (user) {
    return new Promise((resolve, reject) => {
        const sql = `select COUNT(*) as count from rental where endDate < date('now') and user = ?`;
        db.get(sql, [user], (err, res) => {
            console.log(sql);
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }

        });
    });
}

exports.getRentalList = function (future, user) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, startDate, endDate, category, price FROM rental where ${future == true ? "startDate > date('now')" : "startDate <= date('now')"}  and user = ?`;
        db.all(sql, [user], (err, cars) => {
            if (err) {
                reject(err);
            } else {
                resolve(cars);
            }
        });
    });
};

exports.deleteReservation = function (reservationId, username) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM rental WHERE id = ? AND user = ?';

        db.run(sql, [reservationId, username], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};