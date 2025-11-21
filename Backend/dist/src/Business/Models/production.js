"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Production = void 0;
class Production {
    constructor(location, farmer_id, crop_type, crop_variety, est_harvest_date, amount, measure_unit, biologic_features, agro_conditions, agro_protocols, active, contract_id, production_id) {
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
        this.contract_id = contract_id || undefined;
        this.production_id = production_id || undefined;
    }
}
exports.Production = Production;
