'use strict';

const
    express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    locationData = require('./data/location.json'),
    weatherData = require('./data/weather.json'),
    cors = require('cors');
    app.use(cors());
app.get('/', (req, res) => {
  res.status(200).send('Hello');
});

app.get('/location',(req,res)=>{
  let location = new Location(locationData)
  res.json(location)
})

// app.get('/weather',(req,res)=>{
//   let weather = new Weather(weatherData)
//   res.json(weather)
// })

function Location(information) {
this.search_query = information[0].display_name
this.icon = information[0].icon
this.lat = information[0].lat
this.lon = information[0].lon 
}

// function Weather(information) {
//   this.search_query = information[0].display_name
//   this.icon = information[0].icon
//   this.lat = information[0].lat
//   this.lon = information[0].lon 
//   }

app.use('*', (req, res) => res.send('Sorry, that route does not exist.'));

app.listen(port,() => console.log('server is running'));
