"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const userController_1 = __importDefault(require("../Controllers/userController"));
exports.router = (0, express_1.Router)();
exports.router.post('/create', userController_1.default.createUser.bind(userController_1.default));
/* Data received
    body = {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        user_type: 'farmer' | 'investor';
        wallet_address?: string;
        identification_number?: string;
        active?: boolean;
        farmerData?: { location: string;  }  // Si user_type es 'farmer'
        investorData?: {  }                     // Si user_type es 'investor'
    }
*/ 
