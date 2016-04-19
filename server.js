"use strict";

var express = require('express');
var mutate = require('./schemaMutate');
var query = require('./schemaQuery');
var graphql = require('graphql');
var bodyParser = require('body-parser');

let app  = express();

// parse POST body as text
// set upload limit to 50mb
app.use(bodyParser.text({ type: 'application/graphql', limit: '50mb' }));

app.post('/graphql', (req, res) => {
  // execute GraphQL mutation!
  graphql.graphql(mutate, req.body)
    .then((result) => {
      //console.log(result);
      res.send(result);
    }, (err) => {
      res.status(400).send('Bad request');
    });
});

app.get('/graphql', (req, res) => {
  // execute GraphQL query!
  graphql.graphql(query, req.query.query)
    .then((result) => {
      res.send(result);
    });
});

let server = app.listen(
  3000,
  () => console.log(`GraphQL running on port ${server.address().port}`)
);