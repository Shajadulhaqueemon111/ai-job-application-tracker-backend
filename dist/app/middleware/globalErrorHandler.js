"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleCastError_1 = __importDefault(require("../error/handleCastError"));
const config_1 = __importDefault(require("../config"));
const handleZodError_1 = __importDefault(require("../error/handleZodError"));
const handleMongooseError_1 = __importDefault(require("../error/handleMongooseError"));
const appError_1 = __importDefault(require("../error/appError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || 500;
    let message = (err === null || err === void 0 ? void 0 : err.message) || 'Something went wrong!';
    //errrorSources handeling functino
    let errrorSources = [
        {
            path: '',
            message: 'something went wrong',
        },
    ];
    //zod error identify instanceof checking
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errrorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) == 'ValidationError') {
        const simplifiedError = (0, handleMongooseError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errrorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errrorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if (err instanceof appError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errrorSources = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errrorSources = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errrorSources,
        err: config_1.default.NODE_ENV == 'development' ? err === null || err === void 0 ? void 0 : err.stack : null, //development environment ar somay satck use kora jabe karon exact error bojar jonn but production ar somay stack tula dita hoba securityr jonnu
    });
};
exports.default = globalErrorHandler;
//
