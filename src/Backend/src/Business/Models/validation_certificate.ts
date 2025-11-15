class ValidationCertificate {
    certificate_id: string;
    emition_date: string;
    exp_date: string;
    certificate_state: string;
    quality_parameters: any;
    traceability_parameters: any;
    document_hash: string;
    document_url: string;

    constructor(certificate_id: string, emition_date: string, exp_date: string, certificate_state: string, quality_parameters: any, traceability_parameters: any, document_hash: string, document_url: string) {
        this.certificate_id = certificate_id;
        this.emition_date = emition_date;
        this.exp_date = exp_date;
        this.certificate_state = certificate_state;
        this.quality_parameters = quality_parameters;
        this.traceability_parameters = traceability_parameters;
        this.document_hash = document_hash;
        this.document_url = document_url;
    }
}