import { Router } from 'express';
import { userRouter } from '../modules/user/user.route';
import { authRoute } from '../modules/auth/auth.route';

import { ApplicationRoute } from '../modules/application/application.route';
import { adminRoute } from '../modules/admin/admin.route';
import { JobRoutes } from '../modules/create-job/route';
import { HRRoutes } from '../modules/hr/hr-route';
import { NotificationRoutes } from '../modules/notification/notification.route';

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
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/hr',
    route: HRRoutes,
  },
  {
    path: '/jobs',
    route: JobRoutes,
  },
  {
    path: '/applications',
    route: ApplicationRoute,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
