
const APIURL = 'http://localhost:3000/api';

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

export default {getCarList};