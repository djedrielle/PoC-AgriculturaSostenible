CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    user_type VARCHAR,
    registration_date TIMESTAMP,
    active BOOLEAN,
    identification_number VARCHAR
);

CREATE TABLE Smart_Contract (
    contract_id SERIAL PRIMARY KEY,
    contract_address VARCHAR,
    token_standard_used VARCHAR,
    initial_token_price_USD NUMERIC,
    total_tokens NUMERIC,
    emition_date TIMESTAMP,
    contract_date VARCHAR
);

CREATE TABLE Production (
    production_id SERIAL PRIMARY KEY,
    location VARCHAR,
    crop_type VARCHAR,
    crop_variety VARCHAR,
    est_harvest_date TIMESTAMP,
    measure_unit VARCHAR,
    amount NUMERIC,
    active BOOLEAN,
    biologic_features VARCHAR,
    agro_conditions VARCHAR,
    agro_protocols VARCHAR,
    farmer_id INTEGER REFERENCES "User"(user_id),
    contract_id INTEGER REFERENCES Smart_Contract(contract_id)
);

CREATE TABLE Token (
    token_id SERIAL PRIMARY KEY,
    token_name VARCHAR unique,
    emition_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    token_price_USD NUMERIC,
    amount_tokens NUMERIC,
    owner_id INTEGER REFERENCES "User"(user_id),
    production_id INTEGER REFERENCES Production(production_id)
);

CREATE TABLE Transaction (
    transaction_id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR,
    token_amount_transfered NUMERIC,
    token_unit_price NUMERIC,
    platform_commission_percentage NUMERIC,
    transaction_date TIMESTAMP,
    token_name VARCHAR REFERENCES Token(token_name),
    buyer_id INTEGER REFERENCES "User"(user_id),
    editor_id INTEGER REFERENCES "User"(user_id)
);

CREATE TABLE Validation_Institution (
    institution_id SERIAL PRIMARY KEY,
    name VARCHAR,
    accredited BOOLEAN,
    email VARCHAR
);

CREATE TABLE Validation_Certificate (
    certificate_id SERIAL PRIMARY KEY,
    emition_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exp_date TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '12 months'),
    certificate_state VARCHAR,
    document_hash VARCHAR,
    document_url VARCHAR,
    institution_id INTEGER REFERENCES Validation_Institution(institution_id),
    user_id INTEGER REFERENCES "User"(user_id)
);

CREATE TABLE Oracle_Data (
    data_id SERIAL PRIMARY KEY,
    data_title VARCHAR,
    data VARCHAR,
    date_sourced TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_source VARCHAR,
    verified BOOLEAN
);

CREATE TABLE Market (
    token_name INTEGER PRIMARY KEY REFERENCES Token(token_id),
    current_token_price_USD NUMERIC,
    amount_tokens_on_market NUMERIC,
    token_owner_id INTEGER REFERENCES "User"(user_id)
);

CREATE TABLE Wallet (
    token_name INTEGER PRIMARY KEY REFERENCES Token(token_id),
    token_price_USD NUMERIC,
    amount_tokens_on_wallet NUMERIC,
    production_id INTEGER REFERENCES Production(production_id),
    wallet_owner_id INTEGER REFERENCES "User"(user_id)
);

CREATE TABLE Smart_Contract_x_Oracle_Data (
    contract_id INTEGER REFERENCES Smart_Contract(contract_id),
    data_id INTEGER REFERENCES Oracle_Data(data_id),
    PRIMARY KEY (contract_id, data_id)
);