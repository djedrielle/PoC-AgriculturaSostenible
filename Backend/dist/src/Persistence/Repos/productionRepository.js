"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRepositoryPostgres = void 0;
const production_1 = require("../../Business/Models/production");
const localSupabase_1 = __importDefault(require("../localSupabase"));
class ProductionRepositoryPostgres {
    async createProduction(production) {
        try {
            const result = await localSupabase_1.default.query(`INSERT INTO production (location, crop_type, crop_variety, est_harvest_date, measure_unit, amount, active, biologic_features, agro_conditions, agro_protocols,  farmer_id, contract_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
             RETURNING production_id`, [
                production.location,
                production.crop_type,
                production.crop_variety,
                production.est_harvest_date,
                production.measure_unit,
                production.amount,
                production.active,
                production.biologic_features,
                production.agro_conditions,
                production.agro_protocols,
                production.farmer_id,
                production.contract_id
            ]);
            if (!result?.rows?.length) {
                throw new Error("Failed to create production record");
            }
            console.log("Production record created with ID:", result.rows[0].production_id);
            return result.rows[0].production_id;
        }
        catch (err) {
            throw err;
        }
    }
    async getProductionHistory(user_id) {
        try {
            const result = await localSupabase_1.default.query(`SELECT * FROM production WHERE user_id = $1`, [user_id]);
            return result.rows.map((row) => new production_1.Production(row.location, row.user_id, row.crop_type, row.crop_variety, row.est_harvest_date, row.amount, row.measure_unit, row.biologic_features, row.agro_conditions, row.agro_protocols, row.active, row.contract_id));
        }
        catch (err) {
            throw err;
        }
    }
}
exports.ProductionRepositoryPostgres = ProductionRepositoryPostgres;
