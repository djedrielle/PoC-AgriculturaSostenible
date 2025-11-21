"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const walletContoller_1 = __importDefault(require("../Controllers/walletContoller"));
exports.router = (0, express_1.Router)();
exports.router.post('/walletTokens', walletContoller_1.default.getTokensOnWallet.bind(walletContoller_1.default));
// Receives body { user_id: string }
