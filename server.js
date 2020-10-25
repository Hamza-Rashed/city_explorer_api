'use strict';

require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.status(200).send('Hello');
});


app.use('*', (req, res) => response.send('Sorry, that route does not exist.'));

app.listen(port,() => console.log('server is running'));
