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
                if (res.count == 0){
                    reject(err);
                }else{
                    bcrypt.compare(password, res.password, function(err, result) {
                        if (err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                    });
                }
               
            }
        });
    });
};