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
    DATABASE_URL = process.env.DATABASE_URL;

let client =new pg.Client(DATABASE_URL);
app.use(cors());
app.get('/', (req,res)=>{
  res.send('hello')
})

app.get('/location', getLocation)

app.get('/weather', getWeather)

app.get('/trails', getTrails)


function getLocation(req, res) {
  let city = req.query.city;
  let LocationArr;
  let aqlLocation = `select * from location where search_query = '${city}';`;
  client.query(aqlLocation).then(data => {
      if (data.rows.length > 0) {
          LocationArr = new Location(city, data.rows[0]);
          res.status(200).send(LocationArr);
      } else {
          let locationURL = `https://eu1.locationiq.com/v1/search.php?key=${API_KEY_location}&q=${city}&format=json`;
          superagent.get(locationURL).then(data => {
               LocationArr = new Location(city, data.body[0]);
              let sqlLocationPost = 'insert into location (search_query, display_name, lat, lon) values ($1, $2, $3, $4);'
              let safeValues = [
                LocationArr.search_query,
                LocationArr.formatted_query,
                LocationArr.latitude,
                LocationArr.longitude
              ]
              client.query(sqlLocationPost, safeValues)
                  res.json(LocationArr);
          })
          .catch(()=>{
            res.status(500).send('there are some error')
          })
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
  .catch(()=>{
    res.status(500).send('there are some error')
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

  })
  .catch(()=>{
    res.status(500).send('there are some error')
  })
}

function Location(city, locationData) {
    this.search_query = city;
    this.formated_query = locationData.display_name;
    this.latitude = locationData.lat;
    this.longitude = locationData.lon;
    
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

}).catch(()=> console.log('there is no connection with database'))

