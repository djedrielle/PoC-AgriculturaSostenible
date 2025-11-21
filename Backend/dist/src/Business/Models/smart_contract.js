"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContract = void 0;
class SmartContract {
    constructor(contract_address, standard_implemented, initial_token_price, total_tokens, active, contract_state, emition_date, contract_id) {
        this.contract_address = contract_address;
        this.standard_implemented = standard_implemented;
        this.initial_token_price = initial_token_price;
        this.total_tokens = total_tokens;
        this.active = active;
        this.contract_state = contract_state;
        this.contract_id = contract_id || undefined;
        this.emition_date = emition_date || undefined;
    }
}
exports.SmartContract = SmartContract;
