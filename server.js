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
  let city = req.query.city
  let locationObj;
  locationData.forEach(locationData=>{
    locationObj = new Location(city, locationData);
});
  res.json(locationObj)
  hundelError(res,locationObj)
})

app.get('/weather',(req,res)=>{
  let weatherObj = [];
  weatherData.data.forEach(element=>{
    let des = element.weather.description
    let dataTime = element.datetime
    weatherObj.push(new Weather(des , dataTime))
  })
  res.json(weatherObj)
  console.log(weatherObj)
  hundelError(res,weatherObj)
})

function Location(city, locationData){
  this.search_query=city;
  this.formatted_query=locationData.display_name;
  this.latitude = locationData.lat;
  this.longitude = locationData.lon;
}

function Weather(description,datetime) {
  this.forecast = description
  this.time = datetime
  }

  function hundelError(res,data) {
    if(res.status == 200) {
      res.status(200).send(data)
    }else{
      app.use('*', (req, res) => res.send('Sorry, that route does not exist.'));
    }
  }


app.listen(port,() => console.log('server is running'));
