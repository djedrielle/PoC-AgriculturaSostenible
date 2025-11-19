import { Router, Request, Response } from 'express';

import ProductionController from '../Controllers/productionController';
import TokenController from '../Controllers/tokenController';

export const router = Router();

router.post('/buyTokens', TokenController.buyTokens.bind(TokenController));
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

router.post('/sellTokens', TokenController.sellTokens.bind(TokenController));
/* Receives in the request 
    body {
        seller_id,
        token_name,
        amount
    }
*/

router.post('/tokenizeAsset', ProductionController.tokenizeProductionAsset.bind(ProductionController));
/* Receives in the request 
    body {
        smart_contract_data = {
        contract_id,
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
            token_id,
            token_name,
            emition_date,
            token_price_USD,
            amount_tokens,
            on_market,
            owner_id
        }
    }
*/

