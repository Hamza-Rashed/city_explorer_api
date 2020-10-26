'use strict';

const
    express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    cors = require('cors'),
    superagent = require('superagent');
app.use(cors());


require('dotenv').config();
const API_KEY_location = process.env.API_KEY_location;
const API_KEY_weather = process.env.API_KEY_weather;
const API_KEY_traile = process.env.traile;
app.get('/', (req, res) => {
    res.status(200).send('Hello');
});

app.get('/location', getLocation)

app.get('/weather', getWeather)

app.get('/trails', getTrails)

function getLocation(req, res) {
    let city = req.query.city
    const locationURL = `https://eu1.locationiq.com/v1/search.php?key=${API_KEY_location}&q=${city}&format=json`;
    superagent.get(locationURL).then(data => {
        let locationObj = new Location(city, data.body);
        res.json(locationObj)
    }).catch(() => {
        res.status(500).send('there is an error in location');
      })
}

function getWeather(req, res) {
    let city = req.query.search_query;
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const weatherURL = `https://api.weatherbit.io/v2.0/current?city=${city}&lat=${latitude}&lon=${longitude}&key=${API_KEY_weather}`;

    let weatherArr = [];
    superagent.get(weatherURL).then(weatherData => {
        weatherData.body.data.map((data) => {
        weatherArr.push(new Weather(data))
        });
        res.json(weatherArr);
    }).catch(() => {
        res.status(500).send('there is an error in weather');
      })

}

function getTrails(req, res) {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    console.log(longitude, latitude)
    const trailsURL = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&key=${API_KEY_traile}`;
    let trailsArr = [];
    superagent.get(trailsURL).then(trailsData => {
        trailsData.body.trails.map((data) => {
            trailsArr.push(new Trail(data));
        });
        res.json(trailsArr);
    }).catch(() => {
        res.status(500).send('there is an error in trails');
      })
}

function Location(city, locationData) {
    this.search_query = city;
    this.formated_query = locationData[0].display_name;
    this.latitude = locationData[0].lat;
    this.longitude = locationData[0].lon;
}

function Weather(data) {
    this.forecast = data.weather.description
    this.time = data.datetime
}

function Trail(data) {
    this.name = data.name;
    this.location = data.location;
    this.length = data.length;
    this.stars = data.stars;
    this.star_votes = data.starVotes;
    this.summary = data.summary;
    this.trail_url = data.url;
    this.conditions = data.conditionStatus;
    this.condition_date = data.conditionDate.split(' ')[0]; //split for i can to take the date without time
    this.condition_time = data.conditionDate.split(' ')[1];//split for i can take the time without date

}

app.use('*', (req, res) => res.send('Sorry, that route does not exist.'));

app.listen(port, () => console.log('server is running'));
