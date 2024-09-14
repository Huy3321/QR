'use strict';
import express from 'express';
import 'dotenv/config';
// import sequelize from './config/database.js';
import db from './models'
import loaders from './loaders';

const app = express();
const port = process.env.PORT || 4000;

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await loaders(app);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(
      'Unable to connect to the database or start the server:',
      error
    );
    process.exit(1);
  }
}

startServer();
