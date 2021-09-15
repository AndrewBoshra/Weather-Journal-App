/* Global Variables */
const APIURL = 'https://api.openweathermap.org/data/2.5/weather?';
const APIkey = 'a0e9791e97ab4ed73b5836bdbddd0376';
const countryCode = 'us';

const generateBtn = document.getElementById('generate');
const zipCodeInput = document.getElementById('zip');
const zipCodeError = document.getElementById('zip-error');
const feelingInput = document.getElementById('feelings');

function getCurrentDate() {
    // Create a new date instance dynamically with JS
    let d = new Date();
    let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();
    return newDate;
}


async function getWeatherData(zipCode) {
    const url = `${APIURL}zip=${zipCode},${countryCode}&units=metric&appid=${APIkey}`;
    try {

        return await fetch(url).then(res => res.json()).then(data => data);
    } catch (e) {
        return { cod: '0', message: 'Network Error' };
    }

}
async function addNewEntry(date, temp, feelings) {
    const lastEntry = await fetch('/projectdata', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, temp, feelings })
    }).then(res => res.json());
    return lastEntry;
}

async function getLastEntry() {
    const lastEntry = await fetch('/projectdata').then(res => res.json());
    return lastEntry;
}




function updateUI(entry) {
    const { date, temp, feelings } = entry;
    document.getElementById('date').textContent = date;
    document.getElementById('temp').textContent = temp;
    document.getElementById('content').textContent = feelings;
}

async function generateEntry() {
    zipCodeError.style.display = 'none';

    const zipCode = zipCodeInput.value;
    const weatherData = await getWeatherData(zipCode);
    if (weatherData.cod === 200)//ok
    {
        const date = getCurrentDate();
        const temp = weatherData.main.temp;
        const feelings = feelingInput.value;

        const lastEntry = await addNewEntry(date, temp, feelings);
        console.log(lastEntry);
        updateUI(lastEntry);

    } else {//error
        zipCodeError.style.display = 'block';
        zipCodeError.textContent = weatherData.message;
        return;
    }
}

generateBtn.addEventListener('click', generateEntry);
document.addEventListener('DOMContentLoaded', async () => {
    updateUI(await getLastEntry());
});