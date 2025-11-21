"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationCertificate = void 0;
class ValidationCertificate {
    constructor(production_id, emition_date, exp_date, certificate_state, document_hash, document_url, institution_id) {
        this.production_id = production_id;
        this.emition_date = emition_date;
        this.exp_date = exp_date;
        this.certificate_state = certificate_state;
        this.document_hash = document_hash;
        this.document_url = document_url;
        this.institution_id = institution_id;
    }
}
exports.ValidationCertificate = ValidationCertificate;
