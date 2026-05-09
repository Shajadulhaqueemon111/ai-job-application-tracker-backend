"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const admin_zodvalidation_1 = require("./admin.zodvalidation");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const authValidation_1 = __importDefault(require("../../middleware/authValidation"));
const user_constant_1 = require("../user/user.constant");
const route = express_1.default.Router();
route.get('/', admin_controller_1.getAllAdmin);
route.get('/:id', admin_controller_1.getSingleAdmin);
route.patch('/', (0, authValidation_1.default)(user_constant_1.USER_ROLE.admin), (0, validationRequest_1.default)(admin_zodvalidation_1.adminZodValidationSchema.updateAdminValidationSchema), admin_controller_1.updateAdmin);
route.post('/', admin_controller_1.deleteAdmin);
