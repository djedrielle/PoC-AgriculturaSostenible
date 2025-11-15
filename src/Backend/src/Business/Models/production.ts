class Production {
    production_id: string;
    farmer_id: string;
    crop_type: string;
    crop_variety: string;
    est_harvest_date: string;
    amount: number;
    measure_unit: string;
    biologic_features: any;
    agro_conditions: any;
    agro_protocols: any;
    active: boolean;

    constructor(production_id: string, farmer_id: string, crop_type: string, crop_variety: string, est_harvest_date: string, amount: number, measure_unit: string, active: boolean) {
        this.production_id = production_id;
        this.farmer_id = farmer_id;
        this.crop_type = crop_type;
        this.crop_variety = crop_variety;
        this.est_harvest_date = est_harvest_date;
        this.amount = amount;
        this.measure_unit = measure_unit;
        this.biologic_features = undefined;
        this.agro_conditions = undefined;
        this.agro_protocols = undefined;
        this.active = active;
    }
}