'use strict';

const
    express = require('express'),
    app = express(),
    cors = require('cors'),
    superagent = require('superagent'),
    pg = require('pg');

  
require('dotenv').config();
const
    port = process.env.PORT || 3000,
    API_KEY_location = process.env.API_KEY_location,
    API_KEY_weather = process.env.API_KEY_weather,
    API_KEY_trails = process.env.API_KEY_trails,
    DATABASE = process.env.DATABASE;

let client =new pg.Client(DATABASE);
app.use(cors());
app.get('/', (req,res)=>{
  res.send('hello')
})

app.get('/location', getLocation)

app.get('/weather', getWeather)

app.get('/trails', getTrails)

// app.get('/add-location', addLocation)

// app.get('/add-weather',addWeather)

// app.get('/add-trails',addTrails)


function getLocation(req, res) {
  let city = req.query.city;
  let aqlLocation = `select * from location where search_query = '${city}';`;
  client.query(aqlLocation).then(result => {
      if (result.rows.length > 0) {
          const dbLocation = new Location(city, result.rows);
          res.status(200).send(dbLocation);
      } else {
          let locationURL = `https://eu1.locationiq.com/v1/search.php?key=${API_KEY_location}&q=${city}&format=json`;
          superagent.get(locationURL).then(data => {
             let LocationArr = [];
               LocationArr.push(new Location(city, data.body));
              let sqlLocationPost = 'insert into location (search_query, formatted_query, latitude, longitude) values ($1, $2, $3, $4);'
              let safeValues = [
                LocationArr[0].search_query,
                LocationArr[0].formatted_query,
                LocationArr[0].latitude,
                LocationArr[0].longitude
              ]
              client.query(sqlLocationPost, safeValues).then((data) => {
                  res.status(200).json(data.rows);
              });
          });
      }
  });
}

function getWeather(req, res) {
  let city = req.query.search_query;
  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&lat=${latitude}&lon=${longitude}&key=${API_KEY_weather}`;
  let weatherArr = [];
  superagent.get(weatherURL).then(weatherData => {
      weatherData.body.data.map((data) => {
          weatherArr.push(new Weather(data))
      });
      res.json(weatherArr);
  })
}


function getTrails(req, res) {
  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  console.log(longitude, latitude)
  const trailsURL = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&key=${API_KEY_trails}`;
  let trailsArr = [];
  superagent.get(trailsURL).then(trailsData => {
      trailsData.body.trails.map((data) => {
          trailsArr.push(new Trail(data));
      });
      res.json(trailsArr);
  }

function Location(city, locationData) {
    this.search_query = city;
    this.formated_query = locationData[0].display_name;
    this.latitude = locationData[0].lat;
    this.longitude = locationData[0].lon;
    // all_location.push(this)
}

function Weather(city,data) {
  this.search_query = city;
  this.forecast = data.weather.description
  this.time = data.datetime
    // all_weather.push(this)
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
    this.condition_date = data.conditionDate.split(' ')[0]; //split date without time
    this.condition_time = data.conditionDate.split(' ')[1]; //split time without date
    // all_trails.push(this)
}

app.use('*', (req, res) => res.send('Sorry, that route does not exist.'));


client.connect().then(() => {
  app.listen(port, (err) => {
      if (err) {
          throw err;
      }
      console.log('server is runnuing');
  });
});

