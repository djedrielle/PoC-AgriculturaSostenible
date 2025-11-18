export class ValidationCertificate {
    production_id: string;
    emition_date: string;
    exp_date: string;
    certificate_state: string;
    document_hash: string;
    document_url: string;
    institution_id: string;

    constructor(production_id: string, emition_date: string, exp_date: string, certificate_state: string, document_hash: string, document_url: string, institution_id: string) {
        this.production_id = production_id;
        this.emition_date = emition_date;
        this.exp_date = exp_date;
        this.certificate_state = certificate_state;
        this.document_hash = document_hash;
        this.document_url = document_url;
        this.institution_id = institution_id;
    }
}