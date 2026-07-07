import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { put } from '@vercel/blob';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const CONSENT_PARAGRAPHS = [
  { text: 'I Confirm', bold: true },
  { text: 'The information in this application is true, accurate and complete. I will notify fundr of any changes. I have not withheld any information about our financial position that may impact the lender\'s decision.' },
  { text: 'I/We Acknowledge', bold: true },
  { text: 'fundr will collect and use the information in this application to assess our loan request, held securely and used in accordance with the Fundr Privacy Policy. fundr and its related organisations may collect, use and share personal information for purposes including verifying identity, assessing credit eligibility, managing our account, complying with applicable laws, and conducting market research. Information may be shared with financiers, credit reporting and debt collection agencies, guarantors, and relevant authorities.' },
  { text: 'Credit Reporting – Equifax Authorisation', bold: true },
  { text: 'I/We authorise fundr and any lender to use the services of Equifax (www.equifax.co.nz) and other credit reporting agencies in connection with this application and the ongoing provision of credit. Personal information will be provided to Equifax, who will retain it on their systems and use it to provide reporting services. Default information may be disclosed to other Equifax customers. fundr or any lender may use Equifax\'s services in the future for e-Alert monitoring services.' },
  { text: 'I/We Authorise', bold: true },
  { text: 'fundr, any lender and related parties to collect personal information about me/us from credit reporting agencies, banks, employers and other appropriate sources for the purposes of assessing this application and administering any credit provided.' },
  { text: 'Unless agreed in writing, fundr will not charge me for its service but may receive a commission from any lender.' },
  { text: 'I Certify That I Am Not', bold: true },
  { text: 'An undischarged bankrupt, nor subject to a proposal, summary judgment order, or no asset procedure under Part 5 of the Insolvency Act 2006. I/We have not committed offences under the Companies Act 1993, Financial Reporting Act 2013, Receivership Act 1993, Crimes Act 1961, Financial Markets Conduct Act 2013, or Takeovers Act 1993.' }
];

function wrapText(text, font, size, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function buildPdf(d, meta) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pageW = 595.28, pageH = 841.89, margin = 50;
  let page = pdfDoc.addPage([pageW, pageH]);
  let y = pageH - margin;

  function ensureSpace(h) {
    if (y - h < margin) {
      page = pdfDoc.addPage([pageW, pageH]);
      y = pageH - margin;
    }
  }
  function heading(text) {
    ensureSpace(30);
    y -= 6;
    page.drawText(text, { x: margin, y, size: 13, font: bold, color: rgb(0.94, 0.42, 0) });
    y -= 8;
    page.drawLine({ start: { x: margin, y }, end: { x: pageW - margin, y }, thickness: 0.5, color: rgb(0.85, 0.82, 0.76) });
    y -= 16;
  }
  function row(label, value) {
    if (value === undefined || value === null || value === '' || value === false) return;
    const labelW = 170;
    const valueW = pageW - margin * 2 - labelW;
    const lines = wrapText(value === true ? 'Yes' : value, font, 10, valueW);
    ensureSpace(lines.length * 14 + 4);
    page.drawText(label, { x: margin, y, size: 10, font: bold, color: rgb(0.35, 0.33, 0.28) });
    lines.forEach((line, i) => {
      page.drawText(line, { x: margin + labelW, y: y - i * 14, size: 10, font, color: rgb(0.09, 0.08, 0.06) });
    });
    y -= lines.length * 14 + 6;
  }

  function paragraph(text, isBold) {
    const f = isBold ? bold : font;
    const maxWidth = pageW - margin * 2;
    const lines = wrapText(text, f, 9.5, maxWidth);
    ensureSpace(lines.length * 13 + 8);
    lines.forEach((line, i) => {
      page.drawText(line, { x: margin, y: y - i * 13, size: 9.5, font: f, color: rgb(0.25, 0.23, 0.19) });
    });
    y -= lines.length * 13 + 8;
  }

  page.drawText('fundr.', { x: margin, y, size: 22, font: bold, color: rgb(0.06, 0.05, 0.04) });
  page.drawText('Loan Application', { x: margin, y: y - 22, size: 13, font, color: rgb(0.35, 0.33, 0.28) });
  y -= 50;

  heading('Submission Record');
  row('Submitted', meta.submittedAt);
  row('Application type', d.application_type);
  row('IP address', meta.ip);
  row('Device / browser', meta.userAgent);

  const isBusiness = d.application_type === 'Business';

  if (isBusiness) {
    heading('Finance Details');
    row('Asset type', d.asset_type);
    row('Asset description', d.asset_description);
    row('Finance amount', d.finance_amount ? `$${d.finance_amount}` : '');
    row('Repayment term', d.repayment_term);
    row('Asset purchased?', d.asset_purchased);
    row('Purchase purpose', d.purchase_purpose);

    heading('Business Details');
    row('Business name', d.business_name);
    row('Legal structure', d.legal_structure);
    row('Years trading', d.years_trading);
    row('Industry', d.business_industry);
    row('Annual turnover', d.annual_turnover);
    row('GST registered', d.gst_registered);
    row('Business address', d.business_address);

    heading('Director Details');
    row('Name', `${d.director_first_name || ''} ${d.director_last_name || ''}`.trim());
    row('Date of birth', d.director_dob);
    row('Residential address', d.director_address);
    const ownershipLabels={'own-free':'Own (mortgage-free)','own-mortgage':'Own (with mortgage)','renting':'Renting','board':'Board / Other'};
    row('Property ownership', ownershipLabels[d.property_ownership] || d.property_ownership);
    row('Time at address', d.time_at_address);
    row('Estimated property value', d.property_value ? `$${d.property_value}` : '');
    row('Outstanding mortgage balance', d.mortgage_balance ? `$${d.mortgage_balance}` : '');
    row('Monthly mortgage repayment', d.mortgage_repayment ? `$${d.mortgage_repayment}` : '');
    row('Monthly rent / board', d.monthly_rent ? `$${d.monthly_rent}` : '');
    row('Is director?', d.is_director);
    row('Licence number', d.director_licence_number);
    row('Licence version', d.director_licence_version);
    row('Licence expiry', d.director_licence_expiry);
  } else {
    heading('Finance Details');
    row('Finance type', d.personal_finance_type);
    row('Vehicle / asset', d.personal_asset);
    row('Amount required', d.personal_finance_amount ? `$${d.personal_finance_amount}` : '');
    row('Repayment term', d.personal_repayment_term);
    row('Employment status', d.employment_status);

    heading('Your Details');
    row('Name', `${d.personal_first_name || ''} ${d.personal_last_name || ''}`.trim());
    row('Date of birth', d.personal_dob);
    row('Residential address', d.personal_address);
    row('Marital status', d.marital_status);
    row('Dependants', d.dependants);
    row('Annual income', d.personal_income ? `$${d.personal_income}` : '');
    row('Monthly housing cost', d.housing_cost ? `$${d.housing_cost}` : '');
    row('Licence number', d.personal_licence_number);
    row('Licence version', d.personal_licence_version);
    row('Licence expiry', d.personal_licence_expiry);
  }

  heading('Contact Details');
  row('Email', d.email);
  row('Phone', d.phone);
  row('Preferred contact', d.contact_preference);
  row('Notes', d.notes);

  heading('Authorisation & Acknowledgement');
  CONSENT_PARAGRAPHS.forEach(p => paragraph(p.text, p.bold));

  y -= 4;
  ensureSpace(20);
  page.drawText('Consent confirmed', { x: margin, y, size: 10, font: bold, color: rgb(0.35, 0.33, 0.28) });
  page.drawText(d.consent_all ? 'Yes — read and agreed to all sections' : 'Not confirmed', { x: margin + 170, y, size: 10, font, color: rgb(0.09, 0.08, 0.06) });
  y -= 24;

  if (meta.signatureBytes) {
    try {
      const sigImage = await pdfDoc.embedPng(meta.signatureBytes);
      const maxSigWidth = 220;
      const scaleFactor = Math.min(1, maxSigWidth / sigImage.width);
      const sigW = sigImage.width * scaleFactor;
      const sigH = sigImage.height * scaleFactor;
      ensureSpace(sigH + 50);
      page.drawText('Signature', { x: margin, y, size: 10, font: bold, color: rgb(0.35, 0.33, 0.28) });
      y -= 14;
      page.drawRectangle({ x: margin, y: y - sigH, width: sigW, height: sigH, borderColor: rgb(0.85, 0.82, 0.76), borderWidth: 0.5 });
      page.drawImage(sigImage, { x: margin, y: y - sigH, width: sigW, height: sigH });
      y -= sigH + 10;
      page.drawText(`Signed by ${meta.fullName} (${d.email || 'no email provided'}) on ${meta.submittedAt}`, { x: margin, y, size: 9, font, color: rgb(0.35, 0.33, 0.28) });
      y -= 13;
      page.drawText(`IP address: ${meta.ip}`, { x: margin, y, size: 9, font, color: rgb(0.35, 0.33, 0.28) });
      y -= 16;
    } catch (e) {
      row('Signature', 'Could not render signature image');
    }
  } else {
    row('Signature', 'Not provided');
  }

  // ── Audit Trail cover page (page 1) ─────────────────────────────
  const contentPageCount = pdfDoc.getPageCount();
  const auditPage = pdfDoc.insertPage(0, [pageW, pageH]);
  let ay = pageH - margin;

  auditPage.drawText('fundr', { x: margin, y: ay, size: 20, font: bold, color: rgb(0.06, 0.05, 0.04) });
  auditPage.drawText('Audit Trail', { x: pageW - margin - 90, y: ay, size: 13, font: bold, color: rgb(0.35, 0.33, 0.28) });
  ay -= 14;
  auditPage.drawLine({ start: { x: margin, y: ay }, end: { x: pageW - margin, y: ay }, thickness: 0.75, color: rgb(0.85, 0.82, 0.76) });
  ay -= 32;

  function auditRow(label, value) {
    auditPage.drawText(label.toUpperCase(), { x: margin, y: ay, size: 9, font: bold, color: rgb(0.35, 0.33, 0.28) });
    auditPage.drawText(String(value), { x: margin + 200, y: ay, size: 10.5, font, color: rgb(0.09, 0.08, 0.06) });
    ay -= 24;
  }

  auditRow('Title', 'fundr Loan Application Form');
  auditRow('Document ID', meta.documentId);
  auditRow('Document Pages', contentPageCount);
  auditRow('Status', 'Completed');
  auditRow('Time Zone', 'Pacific/Auckland');

  ay -= 12;
  auditPage.drawLine({ start: { x: margin, y: ay }, end: { x: pageW - margin, y: ay }, thickness: 0.75, color: rgb(0.85, 0.82, 0.76) });
  ay -= 34;

  auditPage.drawText('DOCUMENT HISTORY', { x: margin, y: ay, size: 9, font: bold, color: rgb(0.35, 0.33, 0.28) });
  ay -= 28;

  auditPage.drawCircle({ x: margin + 7, y: ay + 3, size: 8, borderColor: rgb(0.94, 0.42, 0), borderWidth: 1.2, color: rgb(1, 0.96, 0.93) });
  auditPage.drawText('Signed', { x: margin + 24, y: ay, size: 10, font: bold, color: rgb(0.09, 0.08, 0.06) });
  auditPage.drawText(meta.submittedAt, { x: margin + 140, y: ay, size: 10, font, color: rgb(0.09, 0.08, 0.06) });
  auditPage.drawText(`Signed by (${d.email || 'unknown'})`, { x: margin + 320, y: ay, size: 10, font, color: rgb(0.09, 0.08, 0.06) });
  ay -= 15;
  auditPage.drawText(`IP: ${meta.ip}`, { x: margin + 320, y: ay, size: 10, font, color: rgb(0.09, 0.08, 0.06) });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes).toString('base64');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const d = req.body || {};
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || 'unknown';
    const submittedAt = new Date().toLocaleString('en-NZ', {
      timeZone: 'Pacific/Auckland', dateStyle: 'medium', timeStyle: 'medium'
    }) + ' NZT';

    const fullName = d.application_type === 'Business'
      ? (`${d.director_first_name || ''} ${d.director_last_name || ''}`.trim() || d.business_name || 'Unknown applicant')
      : (`${d.personal_first_name || ''} ${d.personal_last_name || ''}`.trim() || 'Unknown applicant');

    let signatureBytes = null;
    if (typeof d.signature === 'string' && d.signature.startsWith('data:image/png;base64,')) {
      try {
        signatureBytes = Buffer.from(d.signature.split(',')[1], 'base64');
      } catch (e) {
        signatureBytes = null;
      }
    }

    const documentId = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
    const pdfBase64 = await buildPdf(d, { ip, userAgent, submittedAt, fullName, signatureBytes, documentId });

    const applicationId = d.application_id;
    if (applicationId) {
      try {
        await put(
          `applications/${applicationId}/meta.json`,
          JSON.stringify({ applicationId, fullName, email: d.email, applicationType: d.application_type, submittedAt }),
          { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true }
        );
      } catch (err) {
        console.error('meta.json write error:', err);
      }
    }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'fundr applications <nick@fundr.co.nz>',
        to: ['nick@fundr.co.nz'],
        subject: `📄 New ${d.application_type || ''} application — ${fullName}`,
        html: `<p>New ${d.application_type || ''} loan application submitted via fundr.co.nz.</p>
               <p>Submitted: ${submittedAt}<br>IP: ${ip}<br>Device: ${userAgent}</p>
               <p>Full application details are attached as a PDF.</p>`,
        attachments: [{ filename: 'fundr-application.pdf', content: pdfBase64 }]
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Application PDF error:', err);
    return res.status(500).json({ error: 'Failed to process application' });
  }
}
