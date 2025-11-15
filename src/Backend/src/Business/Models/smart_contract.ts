class SmartContract {
    contract_id: string;
    contract_address: string;
    standard_implemented: string;
    initial_token_price: number;
    total_tokens: number;
    emition_date: string;
    active: boolean;
    
    constructor(contract_id: string, contract_address: string, standard_implemented: string, initial_token_price: number, total_tokens: number, emition_date: string, active: boolean) {
        this.contract_id = contract_id;
        this.contract_address = contract_address;
        this.standard_implemented = standard_implemented;
        this.initial_token_price = initial_token_price;
        this.total_tokens = total_tokens;
        this.emition_date = emition_date;
        this.active = active;
    }
}