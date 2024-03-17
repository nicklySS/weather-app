import './style.css';
import {format, addDays} from 'date-fns';

const searchForm = document.querySelector('.search-form');
const changeUnit = document.querySelector('.change-units');


/* function getData(city) {
    return fetch(`https://api.weatherapi.com/v1/current.json?key=6038d30aee784cb2b9074218240903&q=${city}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error; // Перехват и передача ошибки выше, если нужно
        });
}

async function fetchData() {
    try {
        const weatherData = await getData('Minsk');
        console.log(weatherData);
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}

fetchData(); */

function getData(city) {
    return new Promise((resolve, reject) => {
        const API_KEY = '6038d30aee784cb2b9074218240903';
        const DAYS = 7;
        const UNITS = 'metric';
        const FORMAT = 'json';

        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${DAYS}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject(error);
            });
    });
}

function changePageData(weatherData) {
    const cel = '°C';
    const fah = '°F';
    const units = ['temp_c','temp_f','maxtemp_c','maxtemp_f','mintemp_c','mintemp_f'];
    let unitFlag = 1;


    const cityName = document.querySelector('.city-name');
    const date = document.querySelector('.date');
    const time = document.querySelector('.time');
    const condition = document.querySelector('.condition');
    const temperature = document.querySelector('.temperature > h1');
    const conditionIcon = document.querySelector('.temperature > img');

    const feelsLike = document.querySelector('.feels-like');
    const humidity = document.querySelector('.humidity');
    const windSpeed = document.querySelector('.wind-speed');
    const cloud = document.querySelector('.cloud');

    const dayForecast = document.querySelectorAll('.day-forecast');

    function change(unit, temp, max, min) {
        cityName.textContent = weatherData.location.name;
        const now = new Date();
        date.textContent = format(now, 'eeee, dd MMMM yyyy');
        time.textContent = `Now, ${format(now, 'hh:mm')}`;
        condition.textContent = weatherData.current.condition.text;
        temperature.textContent = `${weatherData.current[temp]} ${unit}`;
        conditionIcon.setAttribute('src', weatherData.current.condition.icon);

        feelsLike.textContent = `${weatherData.current.feelslike_c} ${unit}`;
        humidity.textContent = `${weatherData.current.humidity}%`;
        windSpeed.textContent = `${weatherData.current.wind_kph}km/h`;
        cloud.textContent = `${weatherData.current.cloud}%`;

        dayForecast.forEach((d, i) => {
            d.querySelector('.forecast-day-name').textContent = format(addDays(now, i), 'eeee');
            d.querySelector('.forecast-temperature').textContent = `${weatherData.forecast.forecastday[i].day[max]} ${unit}`;
            d.querySelector('.forecast-min-temperature').textContent = `${weatherData.forecast.forecastday[i].day[min]} ${unit}`;
            d.querySelector('.forecast-icon').setAttribute('src', weatherData.forecast.forecastday[i].day.condition.icon);
        })
    }

    unitFlag===1 ? change(cel, units[0], units[2], units[4]) : change(fah, units[1], units[3], units[5]);

    changeUnit.addEventListener('click', (b) => {
        if (unitFlag === 0) {
            change(fah, units[1], units[3], units[5]);
            b.currentTarget.textContent = "Fahrenheit";
            unitFlag = 1;
        }
        else {
            change(cel, units[0], units[2], units[4]);
            b.currentTarget.textContent = "Celsius";
            unitFlag = 0;
        }
    });
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.getElementById('searchLocation').value;
    getData(city)
        .then((weatherData) => {
            console.log(weatherData);
            changePageData(weatherData);
        })
        .catch((error) => {
            console.error('Something went wrong:', error);
        });
});

getData('Minsk')
    .then((weatherData) => {
        console.log(weatherData);
        changePageData(weatherData);
    })
    .catch((error) => {
        console.error('Something went wrong:', error);
    });
