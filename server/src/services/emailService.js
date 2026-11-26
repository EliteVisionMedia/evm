const { Resend } = require('resend');
const { email: cfg } = require('../config/env');

const resend = cfg.apiKey ? new Resend(cfg.apiKey) : null;

/** Escapes user-provided text before it is placed in the HTML template. */
const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const row = (label, value) => `
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid #e6f4f4;width:38%;font-size:13px;color:#5b6270;font-weight:600;vertical-align:top">${esc(label)}</td>
    <td style="padding:12px 16px;border-bottom:1px solid #e6f4f4;font-size:14px;color:#0c0d11;vertical-align:top">${value}</td>
  </tr>`;

function enquiryHtml(lead) {
  const date = new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  const services = lead.services.map((s) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;background:#e6f4f4;color:#017F82;font-size:12px;font-weight:600">${esc(s)}</span>`).join('');
  const message = lead.message ? esc(lead.message).replace(/\r?\n/g, '<br>') : '<span style="color:#5b6270">No details provided.</span>';
  return `<!doctype html><html><body style="margin:0;background:#f4f6f7;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f7;padding:24px 12px"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
      <tr><td style="background:#019A9D;padding:24px 28px;color:#ffffff">
        <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85">Elite Vision Media</p>
        <h1 style="margin:6px 0 0;font-size:22px">New Client Enquiry</h1>
        <p style="margin:6px 0 0;font-size:13px;opacity:.9">Submitted ${esc(date)} (IST) via the EVM website</p>
      </td></tr>
      <tr><td style="padding:20px 12px 8px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('First Name', esc(lead.firstName))}
          ${row('Last Name', esc(lead.lastName))}
          ${row('Location', esc(lead.location))}
          ${row('Email Address', `<a href="mailto:${esc(lead.email)}" style="color:#017F82">${esc(lead.email)}</a>`)}
          ${row('Phone Number', `<a href="tel:${esc(lead.phone.replace(/[^\d+]/g, ''))}" style="color:#017F82">${esc(lead.phone)}</a>`)}
          ${row('Interested Services', services)}
          ${row('Lead Details / Message', message)}
          ${row('Submission Date', esc(date))}
        </table>
      </td></tr>
      <tr><td style="padding:8px 28px 20px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fbfb;border-radius:12px"><tr>
          <td style="padding:14px;font-size:12px;color:#5b6270">Lead Status<br><b style="color:#0c0d11;font-size:14px">${esc(lead.leadStatus)}</b></td>
          <td style="padding:14px;font-size:12px;color:#5b6270">Assigned<br><b style="color:#0c0d11;font-size:14px">${esc(lead.assigned)}</b></td>
          <td style="padding:14px;font-size:12px;color:#5b6270">Follow-up<br><b style="color:#0c0d11;font-size:14px">${esc(lead.followUp)}</b></td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:0 28px 26px;font-size:12px;color:#5b6270">Reply to this email to respond to the client directly. Lead ID: ${esc(lead.id)}</td></tr>
    </table>
  </td></tr></table></body></html>`;
}

const enquiryText = (l) =>
  [`New Client Enquiry | EVM Website`, '', `First Name: ${l.firstName}`, `Last Name: ${l.lastName}`, `Location: ${l.location}`, `Email: ${l.email}`, `Phone: ${l.phone}`,
    `Services: ${l.services.join(', ')}`, `Message: ${l.message || '-'}`, `Submitted: ${new Date(l.createdAt).toISOString()}`,
    `Lead Status: ${l.leadStatus} | Assigned: ${l.assigned} | Follow-up: ${l.followUp}`].join('\n');

/**
 * Sends the enquiry notification. Never throws: the lead is already saved,
 * so failures are logged (without secrets or client data) and reported as `false`.
 */
async function sendEnquiryEmail(lead) {
  if (!resend || !cfg.from || !cfg.to) {
    console.warn('[email] Resend not configured (RESEND_API_KEY / EMAIL_FROM / RECEIVER_EMAIL); skipped for lead', lead.id);
    return false;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: cfg.from,
      to: cfg.to,
      replyTo: lead.email,
      subject: 'New Client Enquiry | EVM Website',
      html: enquiryHtml(lead),
      text: enquiryText(lead),
    });
    if (error) {
      console.error('[email] Resend rejected lead', lead.id, '-', error.name || 'error', error.message || '');
      return false;
    }
    console.log('[email] Enquiry email sent for lead', lead.id, 'id', data?.id);
    return true;
  } catch (err) {
    console.error('[email] Send failed for lead', lead.id, '-', err.message);
    return false;
  }
}

module.exports = { sendEnquiryEmail, enquiryHtml };
