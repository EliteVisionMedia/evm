const Contact = require('../models/Contact');
const { sendEnquiryEmail } = require('./emailService');

/** Persists a validated enquiry (only whitelisted fields), then emails the team. */
async function createContact({ firstName, lastName, location, email, phone, services, message }) {
  const doc = await Contact.create({ firstName, lastName, location, email, phone, services, message });
  const lead = {
    id: doc._id.toString(), firstName, lastName, location, email, phone, services, message,
    createdAt: doc.createdAt, leadStatus: doc.status, assigned: doc.assigned, followUp: doc.followUp,
  };
  // Email problems never lose the lead: it is already saved, and the outcome is recorded on it.
  // Sent in the background so the visitor gets an instant confirmation.
  sendEnquiryEmail(lead)
    .then((ok) => ok && Contact.updateOne({ _id: doc._id }, { emailSent: true }))
    .catch((err) => console.error('[email] status update failed for lead', lead.id, '-', err.message));
  return { id: lead.id, status: doc.status, createdAt: doc.createdAt };
}

module.exports = { createContact };
