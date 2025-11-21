export class SmartContract {
    contract_address: string;
    standard_implemented: string;
    initial_token_price: number;
    total_tokens: number;
    active: boolean;
    contract_state: string;
    emition_date?: string;
    contract_id?: string;
    
    constructor(contract_address: string,standard_implemented: string,initial_token_price: number, total_tokens: number,
    active: boolean, contract_state: string,emition_date?: string, contract_id?: string) {
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