import express from "express";
import {
  createContact,
  listContacts,
  getContactById,
  updateContact,
  patchContact,
  deleteContact,
} from "../controllers/contacts.controller.js";
import { validateContact } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", validateContact, createContact);
router.get("/", listContacts);
router.get("/:id", getContactById);
router.put("/:id", validateContact, updateContact);
router.patch("/:id", patchContact);
router.delete("/:id", deleteContact);

export default router;
