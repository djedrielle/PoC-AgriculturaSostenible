export interface UserProps {
    user_id: string;
    username: string;
    user_type: 'farmer' | 'investor';
    email: string;
    wallet_address: string;
    full_name: string;
    registration_date: string;
    active: boolean;
}

export interface FarmerProps extends UserProps {
    farmer_id: string;
    location?: string;
    identification_type?: string;
    identification_number?: string;
    production_history?: any[];
}

export interface InvestorProps extends UserProps {
    investor_id: string;
    capital_on_platform?: number;
}

export class User {
    user_id: string;
    username: string;
    user_type: 'farmer' | 'investor';
    email: string;
    wallet_address: string;
    full_name: string;
    registration_date: string;
    active: boolean;

    constructor(init?: Partial<UserProps>) {
        // Provide minimal defaults to keep instance shape predictable
        this.user_id = '';
        this.username = '';
        this.user_type = 'farmer';
        this.email = '';
        this.wallet_address = '';
        this.full_name = '';
        this.registration_date = new Date().toISOString();
        this.active = true;

        if (init) Object.assign(this, init);
    }
}

export class Farmer extends User {
    farmer_id: string;
    location?: string;
    identification_type?: string;
    identification_number?: string;
    production_history?: any[];

    constructor(init?: Partial<FarmerProps>) {
        super(init);
        this.farmer_id = '';
        if (init) Object.assign(this, init);
        this.user_type = 'farmer';
    }
}

export class Investor extends User {
    investor_id: string;
    capital_on_platform?: number;

    constructor(init?: Partial<InvestorProps>) {
        super(init);
        this.investor_id = '';
        if (init) Object.assign(this, init);
        this.user_type = 'investor';
    }
}

/* Factory to instantiate the right subtype from raw data */
export function createUser(data: any): Farmer | Investor {
    if (data?.user_type === 'farmer') return new Farmer(data);
    return new Investor(data);
}

/* Type guards */
export function isFarmer(u: User): u is Farmer {
    return u.user_type === 'farmer';
}
export function isInvestor(u: User): u is Investor {
    return u.user_type === 'investor';
}
