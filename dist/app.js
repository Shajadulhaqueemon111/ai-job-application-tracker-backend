"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./app/route"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const not_found_1 = __importDefault(require("./app/middleware/not-found"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'https://quick-hire-job-board-application.vercel.app',
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use('/api/v1', route_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(globalErrorHandler_1.default);
app.use(not_found_1.default);
exports.default = app;
