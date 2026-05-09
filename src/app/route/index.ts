import { Router } from 'express';
import { userRouter } from '../modules/user/user.route';
import { authRoute } from '../modules/auth/auth.route';

import { JobRoute } from '../modules/create-job/route';
import { ApplicationRoute } from '../modules/application/application.route';

const router = Router();
const moduleRouter = [
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/auth',
    route: authRoute,
  },

  {
    path: '/jobs',
    route: JobRoute,
  },
  {
    path: '/applications',
    route: ApplicationRoute,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
