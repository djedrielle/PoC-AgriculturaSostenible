export class Production {
    production_id: string;
    location: string;
    farmer_id: string;
    crop_type: string;
    crop_variety: string;
    est_harvest_date: string;
    amount: number;
    measure_unit: string;
    biologic_features: string;
    agro_conditions: string;
    agro_protocols: string;
    active: boolean;
    contract_id?: string;

    constructor(location: string, farmer_id: string, crop_type: string, crop_variety: string, est_harvest_date: string, amount: number, measure_unit: string, biologic_features: string, agro_conditions: string, agro_protocols: string, active: boolean, contract_id?: string) {
        this.production_id = '';
        this.location = location;
        this.farmer_id = farmer_id;
        this.crop_type = crop_type;
        this.crop_variety = crop_variety;
        this.est_harvest_date = est_harvest_date;
        this.amount = amount;
        this.measure_unit = measure_unit;
        this.biologic_features = biologic_features;
        this.agro_conditions = agro_conditions;
        this.agro_protocols = agro_protocols;
        this.active = active;
        this.contract_id = contract_id;
    }
}