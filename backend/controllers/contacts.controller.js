// Simple in-memory contacts controller for local development/testing

let contacts = [];
let nextId = 1;

// Replace current contacts with provided array and reset id counter
export function seedContacts(initial = []) {
  contacts = initial.map((c, i) => ({
    id: c.id ? String(c.id) : String(i + 1),
    name: c.name || "",
    email: c.email || "",
    phone: c.phone || "",
  }));
  const maxId = contacts.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
  nextId = maxId + 1 || contacts.length + 1;
}

export function createContact(req, res) {
  const { name, email, phone } = req.body;
  const contact = { id: String(nextId++), name, email, phone };
  contacts.push(contact);
  res.status(201).json(contact);
}

export function listContacts(req, res) {
  res.json(contacts);
}

export function getContactById(req, res) {
  const { id } = req.params;
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return res.status(404).json({ error: "Not found" });
  res.json(contact);
}

export function updateContact(req, res) {
  const { id } = req.params;
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const { name, email, phone } = req.body;
  const updated = { id, name, email, phone };
  contacts[idx] = updated;
  res.json(updated);
}

export function patchContact(req, res) {
  const { id } = req.params;
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return res.status(404).json({ error: "Not found" });
  const { name, email, phone } = req.body;
  if (name !== undefined) contact.name = name;
  if (email !== undefined) contact.email = email;
  if (phone !== undefined) contact.phone = phone;
  res.json(contact);
}

export function deleteContact(req, res) {
  const { id } = req.params;
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const removed = contacts.splice(idx, 1)[0];
  res.json(removed);
}
