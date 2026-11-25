const asyncHandler = require('../utils/asyncHandler');
const { createContact } = require('../services/contactService');

exports.submitContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, services, message = '' } = req.body;
  const saved = await createContact({ firstName, lastName, email, phone, services, message });
  res.status(201).json({ success: true, message: 'Thanks! Your enquiry has been received.', data: { id: saved.id } });
});
