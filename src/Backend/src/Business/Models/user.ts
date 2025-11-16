export interface UserProps {
    user_id: string;
    username: string;
    user_type: 'farmer' | 'investor';
    email: string;
    wallet_address: string;
    first_name: string;
    last_name: string;
    registration_date: string;
    active: boolean;
    identification_number: string;
}

export interface FarmerProps {
    farmer_id: string;
    user_id: string;
}

export interface InvestorProps{
    investor_id: string;
    user_id: string;
}

export class User {
    user_id: string;
    username: string;
    user_type: 'farmer' | 'investor';
    email: string;
    wallet_address: string;
    first_name: string;
    last_name: string;
    registration_date: string;
    active: boolean;
    identification_number: string;

    constructor(init?: Partial<UserProps>) {
        // Provide minimal defaults to keep instance shape predictable
        this.user_id = '';
        this.username = '';
        this.user_type = 'farmer';
        this.email = '';
        this.wallet_address = '';
        this.first_name = '';
        this.last_name = '';
        this.registration_date = new Date().toISOString();
        this.active = true;
        this.identification_number = '';

        if (init) Object.assign(this, init);
    }
}

export class Farmer {
    farmer_id: string;
    user_id: string;

    constructor(init?: Partial<FarmerProps>) {
        this.farmer_id = '';
        this.user_id = '';

        if (init) Object.assign(this, init);
    }
}

export class Investor {
    investor_id: string;
    user_id: string;

    constructor(init?: Partial<InvestorProps>) {
        this.investor_id = '';
        this.user_id = '';

        if (init) Object.assign(this, init);
    }
}
