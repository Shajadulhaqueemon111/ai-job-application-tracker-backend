"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'block'],
        default: 'active',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.UserSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});
exports.UserSchema.post('save', function (doc, next) {
    doc.set('password', undefined);
    next();
});
exports.UserSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
const UserModel = (0, mongoose_1.model)('User', exports.UserSchema);
exports.default = UserModel;
