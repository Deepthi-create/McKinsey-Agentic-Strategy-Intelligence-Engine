const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendPasswordResetCode({ to, name, code }) {
  if (!process.env.RESEND_API_KEY) {
    throw Object.assign(new Error("Email service is not configured. Set RESEND_API_KEY in the backend environment."), {
      status: 503
    });
  }

  const from = process.env.RESET_EMAIL_FROM || "AI Market Strategy Engine <onboarding@resend.dev>";
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Your password reset code",
      text: buildResetText({ name, code }),
      html: buildResetHTML({ name, code })
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw Object.assign(new Error(`Unable to send reset email. ${errorText}`), { status: 502 });
  }
}

function buildResetText({ name, code }) {
  return [
    `Hi ${name || "there"},`,
    "",
    `Your AI Market Research & Strategy Engine password reset code is: ${code}`,
    "",
    "This code expires in 15 minutes. If you did not request it, you can ignore this email."
  ].join("\n");
}

function buildResetHTML({ name, code }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <p>Hi ${escapeHTML(name || "there")},</p>
      <p>Your AI Market Research &amp; Strategy Engine password reset code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#2563eb">${code}</p>
      <p>This code expires in 15 minutes. If you did not request it, you can ignore this email.</p>
    </div>
  `;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
