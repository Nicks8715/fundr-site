const RESEND_API_KEY = process.env.RESEND_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    firstName, lastName, email, phone,
    assetType, valueLabel, loanTerm, assetCondition,
    bizName, tradingLabel, creditLabel, homeowner,
    rate, monthlyLow, monthlyHigh
  } = req.body;

  const fullName = `${firstName} ${lastName}`.trim();
  const homeownerLabel = homeowner === 'yes' ? 'Yes — homeowner' : 'No — renting/boarding';

  // ── CUSTOMER EMAIL ──────────────────────────────────────────────
  const rateDisplay = rate.callUs
    ? `<p style="font-size:28px;font-weight:700;color:#f06c00;margin:0">Call us for a quote</p><p style="color:#888;font-size:14px;margin:8px 0 0">Your profile is best discussed directly — Nick will call you shortly.</p>`
    : `<p style="font-size:28px;font-weight:700;color:#f06c00;margin:0">${rate.low}% – ${rate.high}% p.a.</p><p style="color:#888;font-size:14px;margin:8px 0 0">Indicative rate range based on your profile</p>`;

  const monthlyDisplay = (!rate.callUs && monthlyLow && monthlyHigh)
    ? `<tr><td style="padding:12px 0;border-bottom:1px solid #f0ece3;color:#5a5348;font-size:14px">Est. monthly repayment</td><td style="padding:12px 0;border-bottom:1px solid #f0ece3;text-align:right;font-weight:600;font-size:14px">${monthlyLow} – ${monthlyHigh}</td></tr>`
    : '';

  const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ece3;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece3;padding:40px 20px">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

      <!-- HEADER -->
      <tr><td style="background:#0e0d0b;border-radius:12px 12px 0 0;padding:28px 36px">
        <p style="font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;color:#fff;margin:0;letter-spacing:-0.03em">fundr<span style="color:#f06c00">.</span></p>
        <p style="color:rgba(255,255,255,0.45);font-size:12px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase">Your indicative finance quote</p>
      </td></tr>

      <!-- RATE BOX -->
      <tr><td style="background:#fff;padding:32px 36px 24px;border-left:1px solid #e8e2d8;border-right:1px solid #e8e2d8">
        <p style="font-size:13px;color:#5a5348;margin:0 0 6px">Hi ${firstName},</p>
        <p style="font-size:15px;color:#16140f;line-height:1.6;margin:0 0 24px">Thanks for getting in touch. Based on the profile you provided, here's your indicative quote:</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f0;border-radius:8px;padding:20px 24px;margin-bottom:24px">
          <tr><td style="text-align:center;padding-bottom:4px">
            ${rateDisplay}
          </td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:12px 0;border-bottom:1px solid #f0ece3;color:#5a5348;font-size:14px">Finance type</td><td style="padding:12px 0;border-bottom:1px solid #f0ece3;text-align:right;font-weight:600;font-size:14px">${assetType}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #f0ece3;color:#5a5348;font-size:14px">Asset value</td><td style="padding:12px 0;border-bottom:1px solid #f0ece3;text-align:right;font-weight:600;font-size:14px">${valueLabel}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #f0ece3;color:#5a5348;font-size:14px">Loan term</td><td style="padding:12px 0;border-bottom:1px solid #f0ece3;text-align:right;font-weight:600;font-size:14px">${loanTerm} months</td></tr>
          ${monthlyDisplay}
        </table>
      </td></tr>

      <!-- NEXT STEPS -->
      <tr><td style="background:#fff;padding:0 36px 28px;border-left:1px solid #e8e2d8;border-right:1px solid #e8e2d8">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f0;border-radius:8px;padding:20px 24px">
          <tr><td>
            <p style="font-size:13px;font-weight:600;color:#16140f;margin:0 0 8px">What happens next?</p>
            <p style="font-size:13px;color:#5a5348;line-height:1.7;margin:0">Nick will call you on <strong style="color:#16140f">${phone}</strong> within 1 business hour to confirm your rate and walk you through the best options across our 20+ lender panel.</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td style="background:#fff;padding:0 36px 32px;border-left:1px solid #e8e2d8;border-right:1px solid #e8e2d8;text-align:center">
        <a href="tel:0211023416" style="display:inline-block;background:#f06c00;color:#fff;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:14px 32px;border-radius:8px;text-decoration:none">Call Nick Now — 021 102 3416</a>
        <p style="font-size:11px;color:#a09890;margin:16px 0 0;line-height:1.6">This is an indicative quote only based on the information provided. Final rates are subject to full credit assessment and lender approval. Terms, conditions and lending criteria apply.</p>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#0e0d0b;border-radius:0 0 12px 12px;padding:20px 36px">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;line-height:1.6">fundr — NZ Asset Finance Broker | nick@fundr.co.nz | 021 102 3416 | fundr.co.nz<br>FSP registered. No broker fee charged to you.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  // ── NICK NOTIFICATION EMAIL ──────────────────────────────────────
  const nickHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0ece3;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece3;padding:40px 20px">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

      <tr><td style="background:#0e0d0b;border-radius:12px 12px 0 0;padding:24px 32px">
        <p style="font-family:'Arial Black',Arial,sans-serif;font-size:20px;font-weight:900;color:#fff;margin:0;letter-spacing:-0.03em">fundr<span style="color:#f06c00">.</span> <span style="font-size:13px;font-weight:400;color:rgba(255,255,255,0.5);letter-spacing:0">New quote request</span></p>
      </td></tr>

      <tr><td style="background:#fff;padding:28px 32px;border-left:1px solid #e8e2d8;border-right:1px solid #e8e2d8">
        <p style="font-size:18px;font-weight:700;color:#16140f;margin:0 0 4px">${fullName}</p>
        <p style="font-size:14px;color:#f06c00;margin:0 0 20px;font-weight:600">${bizName}</p>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr style="background:#f9f6f0"><td style="padding:10px 14px;font-size:13px;color:#5a5348;width:45%">Phone</td><td style="padding:10px 14px;font-size:13px;font-weight:600"><a href="tel:${phone}" style="color:#f06c00">${phone}</a></td></tr>
          <tr><td style="padding:10px 14px;font-size:13px;color:#5a5348">Email</td><td style="padding:10px 14px;font-size:13px;font-weight:600"><a href="mailto:${email}" style="color:#f06c00">${email}</a></td></tr>
          <tr style="background:#f9f6f0"><td style="padding:10px 14px;font-size:13px;color:#5a5348">Finance type</td><td style="padding:10px 14px;font-size:13px;font-weight:600">${assetType}</td></tr>
          <tr><td style="padding:10px 14px;font-size:13px;color:#5a5348">Asset value</td><td style="padding:10px 14px;font-size:13px;font-weight:600">${valueLabel}</td></tr>
          <tr style="background:#f9f6f0"><td style="padding:10px 14px;font-size:13px;color:#5a5348">Loan term</td><td style="padding:10px 14px;font-size:13px;font-weight:600">${loanTerm} months</td></tr>
          <tr><td style="padding:10px 14px;font-size:13px;color:#5a5348">Asset condition</td><td style="padding:10px 14px;font-size:13px;font-weight:600">${assetCondition || 'Not specified'}</td></tr>
          <tr style="background:#f9f6f0"><td style="padding:10px 14px;font-size:13px;color:#5a5348">Trading history</td><td style="padding:10px 14px;font-size:13px;font-weight:600">${tradingLabel}</td></tr>
          <tr><td style="padding:10px 14px;font-size:13px;color:#5a5348">Credit profile</td><td style="padding:10px 14px;font-size:13px;font-weight:600">${creditLabel}</td></tr>
          <tr style="background:#f9f6f0"><td style="padding:10px 14px;font-size:13px;color:#5a5348">Homeowner</td><td style="padding:10px 14px;font-size:13px;font-weight:600">${homeownerLabel}</td></tr>
          <tr><td style="padding:10px 14px;font-size:13px;color:#5a5348">Quoted rate</td><td style="padding:10px 14px;font-size:13px;font-weight:700;color:#f06c00">${rate.callUs ? 'Call us — too variable' : `${rate.low}% – ${rate.high}%`}</td></tr>
          ${monthlyLow ? `<tr style="background:#f9f6f0"><td style="padding:10px 14px;font-size:13px;color:#5a5348">Est. monthly</td><td style="padding:10px 14px;font-size:13px;font-weight:600">${monthlyLow} – ${monthlyHigh}</td></tr>` : ''}
        </table>
      </td></tr>

      <tr><td style="background:#f06c00;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center">
        <a href="tel:${phone}" style="color:#fff;font-size:14px;font-weight:700;text-decoration:none">📞 Call ${firstName} now — ${phone}</a>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  // ── SEND BOTH EMAILS ─────────────────────────────────────────────
  try {
    await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'fundr <nick@fundr.co.nz>',
          to: [email],
          subject: `Your fundr finance quote — ${assetType}`,
          html: customerHtml
        })
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'fundr quotes <nick@fundr.co.nz>',
          to: ['nick@fundr.co.nz'],
          subject: `🔔 New quote request — ${fullName} | ${assetType} | ${valueLabel}`,
          html: nickHtml
        })
      })
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send emails' });
  }
}
