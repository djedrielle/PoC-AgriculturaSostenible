"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const productionController_1 = __importDefault(require("../Controllers/productionController"));
const tokenController_1 = __importDefault(require("../Controllers/tokenController"));
exports.router = (0, express_1.Router)();
exports.router.post('/buyTokens', tokenController_1.default.buyTokens.bind(tokenController_1.default));
/* Receives in the request
    body {
        token_name,
        token_amount_transferred,
        token_unit_price,
        platform_comition,
        buyer_id,
        seller_id
    }
*/
exports.router.post('/sellTokens', tokenController_1.default.sellTokens.bind(tokenController_1.default));
/* Receives in the request
    body {
        seller_id,
        token_name,
        amount,
        token_unit_price
    }
*/
exports.router.post('/tokenizeAsset', productionController_1.default.tokenizeProductionAsset.bind(productionController_1.default));
/* Receives in the request
    body {
        smart_contract_data = {
        contract_address,
        standard_implemented,
        initial_token_price,
        total_tokens,
        emition_date,
        active,
        contract_state
        },
        production_data = {
            location,
            farmer_id,
            crop_type,
            crop_variety,
            est_harvest_date,
            amount,
            measure_unit,
            biologic_features,
            agro_conditions,
            agro_protocols,
            active
        },
        token_data = {
            type,
            token_name,
            emition_date,
            token_price_USD,
            amount_tokens,
            owner_id
        }
    }
*/
