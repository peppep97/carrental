
const APIURL = 'http://localhost:3000/api';

async function isAuthenticated() {

    let url = APIURL + '/user';

    const response = await fetch(url);
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw response;
    }
}

async function getCarList() {

    const url = APIURL + '/public';

    const response = await fetch(url);
    const cars = await response.json();

    if (response.ok) {
        return cars;
    } else {
        throw response;
    }
}

async function login(username, password) {

    return new Promise((resolve, reject) => {
        fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            } else {
                response.json()
                    .then((obj) => { reject(obj); }) //to send username/password errors
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

async function logout() {
    return new Promise((resolve, reject) => {
        fetch(APIURL + '/logout', {
            method: 'POST'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                reject(null);
            }
        }).catch((err) => reject(err));
    });
}

async function getCarAvaiability(startDate, endDate, category) {

    const url = APIURL + `/availability?startDate=${startDate}&endDate=${endDate}&category=${category}`;

    const response = await fetch(url);
    const res = await response.json();

    if (response.ok) {
        return res;
    } else {
        throw response;
    }
}

async function pay(payload) {

    const url = APIURL + '/pay';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const res = await response.json();

    if (response.ok) {
        return res;
    } else {
        throw response;
    }
}

async function addRental(rental) {

    const url = APIURL + '/addrental';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(rental)
    });

    const res = await response.json();

    if (response.ok) {
        return res;
    } else {
        throw response;
    }
}

async function getFrequentCustomer() {

    const url = APIURL + '/isfrequent';

    const response = await fetch(url);
    const res = await response.json();

    if (response.ok) {
        return res;
    } else {
        throw response;
    }
}

async function getRentalList(futureRentals) {

    const url = APIURL + `/getrentals?future=${futureRentals}`;

    const response = await fetch(url);
    const cars = await response.json();

    if (response.ok) {
        return cars;
    } else {
        throw response;
    }
}


async function deleteReservation(reservationId) {

    const response = await fetch(APIURL + `/delete/${reservationId}`, {
        method: 'DELETE'
    });

    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw response;
    }
}

export default { isAuthenticated, getCarList, login, logout, getCarAvaiability, pay, addRental, getFrequentCustomer, getRentalList, deleteReservation };