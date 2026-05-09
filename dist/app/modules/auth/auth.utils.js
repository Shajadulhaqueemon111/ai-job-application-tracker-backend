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
exports.checkPassword = exports.validUserForLogin = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_modle_1 = __importDefault(require("../user/user.modle"));
const appError_1 = __importDefault(require("../../error/appError"));
const validUserForLogin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_modle_1.default.findOne({ email }).select('+status +password');
    if (!user) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'user in not found');
    }
    return user;
});
exports.validUserForLogin = validUserForLogin;
const checkPassword = (givenPassword, savePassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatched = yield bcryptjs_1.default.compare(givenPassword, savePassword);
    console.log(isMatched);
    if (!isMatched) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'password does not matched');
    }
    return isMatched;
});
exports.checkPassword = checkPassword;
