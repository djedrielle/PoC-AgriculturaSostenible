"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const analyticsController_1 = __importDefault(require("../Controllers/analyticsController"));
const productionController_1 = __importDefault(require("../Controllers/productionController"));
exports.router = (0, express_1.Router)();
exports.router.get('/tokenAnalytics', analyticsController_1.default.getTokenAnalytics.bind(analyticsController_1.default));
// Receive body = { token_id: string, lastTokenPrice: number }
exports.router.get('/getProductionHistory', productionController_1.default.getProductionHistory.bind(productionController_1.default));
// Receive body = { user_id: string } Deberia de cambiarse a POST
