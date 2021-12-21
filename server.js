const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const port = 8080;

//Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//View engine and static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Start server
app.listen(port, (req, res) => {
  console.log('Express server is listening on port 8080');
});
