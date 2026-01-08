const API_BASE = "/api/contacts";

async function loadContacts(search = "") {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${API_BASE}${q}`);
  if (!res.ok) return;
  const data = await res.json();
  const container = document.getElementById("contacts-body");
  container.innerHTML = "";
  const list = Array.isArray(data) ? data : data.data || [];
  if (list.length === 0) {
    const e = document.createElement("div");
    e.className = "empty";
    e.textContent = "No contacts found";
    container.appendChild(e);
    return;
  }

  list.forEach((c) => {
    const item = document.createElement("div");
    item.className = "contact";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = (c.name || "?").slice(0, 2).toUpperCase();

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<div class="name">${c.name}</div><div class="email">${c.email || ""}</div>`;

    const actions = document.createElement("div");
    actions.className = "actions";
    const btnEdit = document.createElement("button");
    btnEdit.className = "btn ghost";
    btnEdit.textContent = "Edit";
    btnEdit.addEventListener("click", () => editContact(c.id));

    const btnDel = document.createElement("button");
    btnDel.className = "btn danger";
    btnDel.textContent = "Delete";
    btnDel.addEventListener("click", () => deleteContact(c.id));

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);

    item.appendChild(avatar);
    item.appendChild(meta);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

async function editContact(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) return;
  const c = await res.json();
  document.getElementById("contact-id").value = c.id;
  document.getElementById("name").value = c.name || "";
  document.getElementById("email").value = c.email || "";
  document.getElementById("phone").value = c.phone || "";
}

async function deleteContact(id) {
  if (!confirm("Delete this contact?")) return;
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    alert("Delete failed");
    return;
  }
  // reload
  loadContacts();
}

document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("contact-id").value;
  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_BASE}/${id}` : API_BASE;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const errorDiv = document.getElementById("form-error");
  const successDiv = document.getElementById("form-success");
  errorDiv.textContent = "";
  successDiv.textContent = "";

  if (!res.ok) {
    try {
      const body = await res.json();
      errorDiv.textContent = body.error || "Error";
    } catch (e) {
      errorDiv.textContent = "Error";
    }
  } else {
    successDiv.textContent = "Saved successfully";
    document.getElementById("contact-id").value = "";
    e.target.reset();
    loadContacts();
  }
});

document.getElementById("reset-btn").addEventListener("click", () => {
  document.getElementById("contact-id").value = "";
  document.getElementById("contact-form").reset();
});

document.getElementById("search-btn").addEventListener("click", () => {
  const q = document.getElementById("search").value;
  loadContacts(q);
});

// initial load
loadContacts();