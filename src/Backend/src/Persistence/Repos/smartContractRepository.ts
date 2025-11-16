import { SmartContract } from '../../Business/Models/smart_contract';

export interface SmartContractRepository {
    createSmartContract(sContract: SmartContract): Promise<string>;
}

export class SmartContractRepositoryPostgres implements SmartContractRepository {
  async createSmartContract(sContract: SmartContract): Promise<string> {
    try {
        const result = await db.query(
            `INSERT INTO smart_contract (contract_address, token_standard_used, initial_token_price_USD, total_tokens, emition_date, contract_state) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING contract_id`,
            [
                sContract.contract_address,
                sContract.standard_implemented,
                sContract.initial_token_price,
                sContract.total_tokens,
                sContract.emition_date,
                sContract.contract_state
            ]
        );

        if (!result?.rows?.length) {
            throw new Error("Failed to create smart contract record");
        }

        return result.rows[0].contract_id as string;
    } catch (err) {
        throw err;
    }
  }

}
