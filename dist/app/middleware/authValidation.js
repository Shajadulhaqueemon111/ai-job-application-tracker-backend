"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../error/appError"));
const config_1 = __importDefault(require("../config"));
const auth_utils_1 = require("../modules/auth/auth.utils");
const authValidateRequest = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        console.log(token);
        if (!token) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'You Are Not Autorized !');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        console.log('hi', decoded);
        const { role, email } = decoded;
        if (!email || !role) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Token Payload!');
        }
        const user = yield (0, auth_utils_1.validUserForLogin)(email);
        console.log(user);
        if (!user) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found!');
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'You Are Not Autorized !');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = authValidateRequest;
