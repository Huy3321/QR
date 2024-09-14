const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const api = require('../api/routes');

module.exports = (app) => {
  // define any middlewares that need to run befoure our routes

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  // define ALL routes here
  app.use(api);

  // Use CORS middleware
  app.use(cors());
};
