import { Production } from '../../Business/Models/production';
import db from '../localSupabase';

export interface ProductionRepository {
    createProduction(production: Production): Promise<string>;
    getProductionHistory(user_id: string): Promise<Production[]>;
}

export class ProductionRepositoryPostgres implements ProductionRepository {

  async createProduction(production: Production): Promise<string> {
    try {
        const result = await db.query(
            `INSERT INTO production (location, crop_type, crop_variety, est_harvest_date, measure_unit, amount, active, biologic_features, agro_conditions, agro_protocols,  farmer_id, contract_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
             RETURNING production_id`,
            [
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
            ]
        );

        if (!result?.rows?.length) {
            throw new Error("Failed to create production record");
        }
        console.log("Production record created with ID:", result.rows[0].production_id);
        return result.rows[0].production_id as string;
    } catch (err) {
        throw err;
    }
  }

    async getProductionHistory(user_id: string): Promise<Production[]> {
        try {
            const result = await db.query(
                `SELECT * FROM production WHERE user_id = $1`,
                [user_id]
            );
            return result.rows.map((row: any) => new Production(
                row.location,
                row.user_id,
                row.crop_type,
                row.crop_variety,
                row.est_harvest_date,
                row.amount,
                row.measure_unit,
                row.biologic_features,
                row.agro_conditions,
                row.agro_protocols,
                row.active,
                row.contract_id
            ));
        } catch (err) {
            throw err;
        }
    }
}
