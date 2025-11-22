const API_BASE = "http://localhost:4000";

async function post(path: string, body: any) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }

  return res.json();
}

async function get(path: string) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }
  return res.json();
}

// ====== VALIDATION ENDPOINTS ======

export function requestCertificate(payload: {
  user_id: string;
  institution_id: string;
}) {
  return post("/validation/requestCertificate", payload);
}

export function certificateInfo(payload: { user_id: string }) {
  return post("/validation/certificateInfo", payload);
}

export function affiliate(payload: {
  user_id: string;
  institution_id: string;
}) {
  return post("/validation/affiliate", payload);
}

// ====== TOKEN ENDPOINTS ======

export interface TokenizePayload {
  smart_contract_data: {
    contract_address: string;
    standard_implemented: string;
    initial_token_price: number;
    total_tokens: number;
    emition_date: string;
    active: boolean;
    contract_state: string;
  };
  production_data: {
    location: string;
    farmer_id: number;
    crop_type: string;
    crop_variety: string;
    est_harvest_date: string;
    amount: number;
    measure_unit: string;
    biologic_features: string;
    agro_conditions: string;
    agro_protocols: string;
    active: boolean;
  };
  token_data: {
    type: string;
    token_name: string;
    emition_date: string;
    token_price_USD: number;
    amount_tokens: number;
    owner_id: number;
  };
}

export function tokenizeAsset(payload: TokenizePayload) {
  return post("/token/tokenizeAsset", payload);
}

export function buyTokens(payload: {
  token_name: string;
  token_amount_transferred: number;
  token_unit_price: number;
  platform_comition: number;
  buyer_id: number;
  seller_id: number;
}) {
  return post("/token/buyTokens", payload);
}

export function sellTokens(payload: {
  seller_id: number;
  token_name: string;
  amount: number;
  token_unit_price: number;
}) {
  return post("/token/sellTokens", payload);
}

// ====== MARKET ENDPOINTS ======

export function getMarketTokens() {
  return get("/market");
}

// ====== WALLET ENDPOINTS ======

export function getWalletTokens(payload: { user_id: number }) {
  return post("/wallet/walletTokens", payload);
}

// ====== TRANSACTION ENDPOINTS ======

export function getRecentTransactions(payload: { user_id: number }) {
  return post("/transaction/recent", payload);
}
