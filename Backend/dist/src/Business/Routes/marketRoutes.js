"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const marketController_1 = __importDefault(require("../Controllers/marketController"));
exports.router = (0, express_1.Router)();
exports.router.get('/', marketController_1.default.getAllTokensOnMarket.bind(marketController_1.default));
// Receives no body parameters
