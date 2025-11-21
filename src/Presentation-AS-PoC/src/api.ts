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

// ====== TOKEN ENDPOINTS (los dejamos para después si quieres) ======

export function tokenizeAssetPending(payload: {
  lotId: string;
  quantity: number;
  unit: string;
}) {
  return post("/token/tokenizeAssetPending", payload);
}

export function buyTokens(payload: { tokenId: string; amount: number }) {
  return post("/token/buyTokens", payload);
}

export function sellTokens(payload: { tokenId: string; amount: number }) {
  return post("/token/sellTokens", payload);
}
