import { Router } from 'express';
import userRoutes from './user'
import tableRouter from './table';
import categoryRouter from './category';
import dishRoutes from './dish';
import refreshTokenRoutes from './auth'
import imageRoute from './image'
import orderRoutes from './order'
import employeeRouter from './employee'


// any endpoints for api/{anything} will be here
const v1 = Router();

// test(v1);
userRoutes(v1);
tableRouter(v1);
categoryRouter(v1);
dishRoutes(v1);
refreshTokenRoutes(v1)
imageRoute(v1)
orderRoutes(v1)
employeeRouter(v1)

module.exports = v1;
