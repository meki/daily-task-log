"use strict";
// Express framework
const express = require('express');
const app = express();
app.set('port', process.env.PORT || 80);

const rootDir = __dirname + "/..";

const server = app.listen(app.get('port'));
console.log("server listening on port " + app.get('port'));

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var isClientConnected = false;
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) { throw err; }

  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  isClientConnected = true;
  client.end();
});

app.get('/', function (req, res) {
  if(isClientConnected) {
      res.send('Hello World!');
  }
  else {
    res.send('Sorry :<! DB connection failed.');
  }
});