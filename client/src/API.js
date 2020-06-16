
const APIURL = 'http://localhost:3000/api';

async function isAuthenticated(){

    let url = APIURL + '/user';

    const response = await fetch(url);
    const user = await response.json();
    if(response.ok){
        console.log(user);
        return user;
    } else {
        throw response;
    }
}

async function getCarList(){

    const url = APIURL + '/public';

    const response = await fetch(url);
    const cars = await response.json();

    if (response.ok){
        return cars;
    } else {
        throw response; 
    }
}

async function login(username, password){

    return new Promise((resolve, reject) => {
        fetch(APIURL + '/login', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        }).then((response) => {
            if (response.ok){
                response.json()
                .then((obj) => { resolve(obj); }) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }else{
                response.json()
                .then((obj) => {reject(obj);})
                .catch((err) => {reject({errors : [{param: "Application", msg: "Cannot parse server response"}]})});
            }
        }).catch((err) => {reject({errors : [{param: "Server", msg: "Cannot communicate"}]})});
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

export default {isAuthenticated, getCarList, login, logout};