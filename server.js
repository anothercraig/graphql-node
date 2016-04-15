"use strict";

var express = require('express');
var schema = require('./schema');
var graphql = require('graphql');
var bodyParser = require('body-parser');

let app  = express();

// parse POST body as text
app.use(bodyParser.text({ type: 'application/graphql', limit: '50mb' }));

app.post('/graphql', (req, res) => {
  // execute GraphQL!
  graphql.graphql(schema, req.body)
    .then((result) => {
      console.log(result);
      res.send(result);
    });
});

let server = app.listen(
  3000,
  () => console.log(`GraphQL running on port ${server.address().port}`)
);