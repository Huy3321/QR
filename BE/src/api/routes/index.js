import { Router } from 'express';
import apiv1 from './v1';

// this serves as the root path definition, define root paths here
const app = Router();
app.use('/v1', apiv1);
module.exports = app;
