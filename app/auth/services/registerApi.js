// services/registerApi.js

export async function sendOtpApi(phone) {
  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  return res.json();
}

export async function registerApi(data) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function savePhoneUserApi(data) {
  const res = await fetch("/api/save-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
