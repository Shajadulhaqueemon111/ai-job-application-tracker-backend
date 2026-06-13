"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const application_route_1 = require("../modules/application/application.route");
const admin_route_1 = require("../modules/admin/admin.route");
const route_1 = require("../modules/create-job/route");
const hr_route_1 = require("../modules/hr/hr-route");
const notification_route_1 = require("../modules/notification/notification.route");
const router_1 = require("../modules/chat-message/router");
const ats_route_1 = require("../modules/ats-cheker/ats.route");
const router = (0, express_1.Router)();
const moduleRouter = [
    {
        path: '/user',
        route: user_route_1.userRouter,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoute,
    },
    {
        path: '/admin',
        route: admin_route_1.adminRoute,
    },
    {
        path: '/hr',
        route: hr_route_1.HRRoutes,
    },
    {
        path: '/jobs',
        route: route_1.JobRoutes,
    },
    {
        path: '/applications',
        route: application_route_1.ApplicationRoute,
    },
    {
        path: '/notifications',
        route: notification_route_1.NotificationRoutes,
    },
    {
        path: '/messages',
        route: router_1.MessageRoutes,
    },
    {
        path: '/ai-checker',
        route: ats_route_1.AtsRoutes,
    },
];
moduleRouter.forEach((route) => router.use(route.path, route.route));
exports.default = router;
