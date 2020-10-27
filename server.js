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

app.get('/add-location', addLocation)

app.get('/add-weather',addWeather)

app.get('/add-trails',addTrails)


function addLocation(req, res) {
  let city = req.query.city
  const locationURL = `https://eu1.locationiq.com/v1/search.php?key=${API_KEY_location}&q=${city}&format=json`;
  let all_location =[];
  superagent.get(locationURL).then(data => {
    all_location.push(new Location(city, data.body));
    let sqlLocation = 'insert into location (search_query,display_name,lat,lon)values($1,$2,$3,$4);';
    let safeValues = [all_location[0].search_query,
    all_location[0].formatted_query,
    all_location[0].latitude,
    all_location[0].longitude]
    client.query(sqlLocation,safeValues).then(data=>{
      res.status(200).json(data)
    })
  })
}

function getLocation(req,res) {
  let city = req.query.city;
  let sqlGetLocation = `SELECT * FROM location WHERE search_query = '${city}';`;
  client.query(sqlGetLocation).then(data => {
    // console.log(all_location)
          const infoLocation = new Location(city, data.rows);
          res.status(200).json(infoLocation);
  })
}

function addWeather(req, res) {
    let city = req.query.search_query;
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&lat=${latitude}&lon=${longitude}&key=${API_KEY_weather}`;
    let all_weather = [];
    superagent.get(weatherURL).then(weatherData => {
        weatherData.body.data.map((data) => {
          all_weather.push(new Weather(data));
          let sqlWeather = 'insert into weather (search_query,forecast,time)values($1,$2,$3);';
          let safeValues = [all_weather[0].search_query,
          all_weather[0].forecast,
          all_weather[0].time
                       ]
          client.query(sqlWeather,safeValues).then(data=>{
            res.status(200).json(data)
          })
          
        });
    })
}

function getWeather(req,res) {
  let city = req.query.city;
  let sqlGetWeather = `SELECT * FROM weather WHERE search_query = '${city}';`;
  client.query(sqlGetWeather).then(data => {
          const infoWeather = new Weather(data.rows);
          res.status(200).json(infoWeather);
  })
}

function addTrails(req, res) {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    console.log(longitude, latitude)
    const trailsURL = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&key=${API_KEY_trails}`;
    let all_trails = [];
    superagent.get(trailsURL).then(trailsData => {
        trailsData.body.trails.map((data) => {
          all_trails.push(new Trail(data))

            let sqlTrails = 'insert into trails (search_query,name,location,length,stars,star_votes,summary,trail_url,conditions,condition_date,condition_time)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);';
            let safeValues = [
            all_trails[0].search_query,
            all_trails[0].name,
            all_trails[0].location,
            all_trails[0].length,
            all_trails[0].stars,
            all_trails[0].star_votes,
            all_trails[0].summary,
            all_trails[0].trail_url,
            all_trails[0].conditions,
            all_trails[0].condition_date,
            all_trails[0].condition_time
                         ]
            client.query(sqlTrails,safeValues).then(data=>{
              res.status(200).json(data)
            })
        });
    })
}


function getTrails(req,res) {
  let city = req.query.city;
  let sqlGetTrails = `SELECT * FROM trails WHERE search_query = '${city}';`;
  client.query(sqlGetTrails).then(data => {
          const infoTrails = new Trail(data.rows);
          res.status(200).json(infoTrails);
  })


function Location(city, locationData) {
    this.search_query = city;
    this.formated_query = locationData[0].display_name;
    this.latitude = locationData[0].lat;
    this.longitude = locationData[0].lon;
    // all_location.push(this)
}

function Weather(data) {
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

