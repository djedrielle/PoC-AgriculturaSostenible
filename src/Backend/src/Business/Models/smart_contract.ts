export class SmartContract {
    contract_id: string;
    contract_address: string;
    standard_implemented: string;
    initial_token_price: number;
    total_tokens: number;
    emition_date: string;
    active: boolean;
    contract_state: string;
    
    constructor(contract_id: string, contract_address: string, standard_implemented: string, initial_token_price: number, total_tokens: number, emition_date: string, active: boolean, contract_state: string) {
        this.contract_id = contract_id;
        this.contract_address = contract_address;
        this.standard_implemented = standard_implemented;
        this.initial_token_price = initial_token_price;
        this.total_tokens = total_tokens;
        this.emition_date = emition_date;
        this.active = active;
        this.contract_state = contract_state;
    }
}