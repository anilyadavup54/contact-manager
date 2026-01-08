const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(req, res, next) {
  const { name, email, phone } = req.body;

  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!phone || !phone.trim()) {
    errors.phone = "Phone is required";
  } else if (phone.length < 7 || phone.length > 25) {
    errors.phone = "Phone length must be between 7 and 25 characters";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
  }

  next();
}
