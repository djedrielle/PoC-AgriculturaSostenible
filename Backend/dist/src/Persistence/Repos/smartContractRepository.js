"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContractRepositoryPostgres = void 0;
const localSupabase_1 = __importDefault(require("../localSupabase"));
class SmartContractRepositoryPostgres {
    async createSmartContract(sContract) {
        try {
            console.log(sContract);
            const result = await localSupabase_1.default.query(`INSERT INTO smart_contract (contract_address, token_standard_used, initial_token_price_USD, total_tokens, emition_date, contract_state) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING contract_id`, [
                sContract.contract_address,
                sContract.standard_implemented,
                sContract.initial_token_price,
                sContract.total_tokens,
                sContract.emition_date,
                sContract.contract_state
            ]);
            if (!result?.rows?.length) {
                throw new Error("Failed to create smart contract record");
            }
            console.log("Smart contract created with ID:", result.rows[0].contract_id);
            return result.rows[0].contract_id;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.SmartContractRepositoryPostgres = SmartContractRepositoryPostgres;
