const Contact = require('../models/Contact');

/** Persists a validated enquiry. Only whitelisted fields are written. */
async function createContact({ firstName, lastName, email, phone, services, message }) {
  const doc = await Contact.create({ firstName, lastName, email, phone, services, message });
  return { id: doc._id.toString(), status: doc.status, createdAt: doc.createdAt };
}

module.exports = { createContact };
