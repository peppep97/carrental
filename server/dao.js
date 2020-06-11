'use strict'

const sqlite = require('sqlite3');

const db = new sqlite.Database('db/car_rental.db', (err) => {
    if (err) {
        throw err;
    }
});

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