// Not used yet

class ValidationInstitution {
    instituiton_id: string;
    institution_name: string;
    accredited: boolean;
    contact_email: string;

    constructor(instituiton_id: string, institution_name: string, accredited: boolean, contact_email: string) {
        this.instituiton_id = instituiton_id;
        this.institution_name = institution_name;
        this.accredited = accredited;
        this.contact_email = contact_email;
    }
}
