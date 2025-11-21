"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const validationController_1 = __importDefault(require("../Controllers/validationController"));
exports.router = (0, express_1.Router)();
exports.router.post('/certificateInfo', validationController_1.default.getCertificateInfo.bind(validationController_1.default));
// Receive body: { user_id: string }
exports.router.post('/affiliate', validationController_1.default.affiliateToInstitution.bind(validationController_1.default));
// Receive body: { user_id: string, institution_id: string }
exports.router.post('/requestCertificate', validationController_1.default.requestValidationCertificate.bind(validationController_1.default));
// Receive body: { user_id: string, institution_id: string }
