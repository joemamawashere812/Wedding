const STORAGE_KEY = "weddingGuests";

const sampleGuests = [
  {
    id: crypto.randomUUID(),
    name: "Maya Johnson",
    email: "maya@example.com",
    group: "Family",
    inviteStatus: "save the date sent",
    rsvpStatus: "pending",
    partySize: 1,
    note: ""
  },
  {
    id: crypto.randomUUID(),
    name: "Chris Lee",
    email: "chris@example.com",
    group: "Friends",
    inviteStatus: "to invite",
    rsvpStatus: "pending",
    partySize: 1,
    note: ""
  }
];

const guestForm = document.querySelector("#guestForm");
const rsvpForm = document.querySelector("#rsvpForm");
const guestTableBody = document.querySelector("#guestTableBody");
const searchInput = document.querySelector("#searchInput");
const rsvpMessage = document.querySelector("#rsvpMessage");
const exportButton = document.querySelector("#exportButton");
const resetSampleButton = document.querySelector("#resetSampleButton");

let guests = loadGuests();

function loadGuests() {
  const savedGuests = localStorage.getItem(STORAGE_KEY);

  if (!savedGuests) {
    return [];
  }

  try {
    return JSON.parse(savedGuests);
  } catch {
    return [];
  }
}

function saveGuests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
}

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function getFilteredGuests() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (!searchTerm) {
    return guests;
  }

  return guests.filter((guest) => {
    return [guest.name, guest.email, guest.group, guest.inviteStatus, guest.rsvpStatus]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm);
  });
}

function renderStats() {
  const yesGuests = guests.filter((guest) => guest.rsvpStatus === "yes");
  const noGuests = guests.filter((guest) => guest.rsvpStatus === "no");
  const pendingGuests = guests.filter((guest) => guest.rsvpStatus === "pending");
  const attendingCount = yesGuests.reduce((total, guest) => total + Number(guest.partySize || 1), 0);

  document.querySelector("#totalGuests").textContent = guests.length;
  document.querySelector("#yesCount").textContent = attendingCount;
  document.querySelector("#noCount").textContent = noGuests.length;
  document.querySelector("#pendingCount").textContent = pendingGuests.length;
}

function renderGuests() {
  const filteredGuests = getFilteredGuests();

  guestTableBody.innerHTML = "";

  if (filteredGuests.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="8" class="empty-state">No guests yet. Add someone above or load the sample guests.</td>';
    guestTableBody.append(row);
    renderStats();
    return;
  }

  filteredGuests.forEach((guest) => {
    const row = document.createElement("tr");
    row.append(
      createTextCell(guest.name),
      createTextCell(guest.email || "-"),
      createTextCell(guest.group || "-"),
      createPillCell(guest.inviteStatus),
      createPillCell(guest.rsvpStatus, guest.rsvpStatus),
      createTextCell(guest.partySize || 1),
      createTextCell(guest.note || "-"),
      createDeleteCell(guest.id)
    );
    guestTableBody.append(row);
  });

  renderStats();
}

function createTextCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function createPillCell(value, statusClass = "") {
  const cell = document.createElement("td");
  const pill = document.createElement("span");
  pill.className = statusClass ? `pill ${statusClass}` : "pill";
  pill.textContent = value;
  cell.append(pill);
  return cell;
}

function createDeleteCell(id) {
  const cell = document.createElement("td");
  const button = document.createElement("button");
  button.className = "ghost-button";
  button.type = "button";
  button.dataset.delete = id;
  button.textContent = "Remove";
  cell.append(button);
  return cell;
}

function addGuest(event) {
  event.preventDefault();

  const formData = new FormData(guestForm);
  const name = formData.get("guestName").trim();

  const alreadyExists = guests.some((guest) => normalizeName(guest.name) === normalizeName(name));

  if (alreadyExists) {
    alert("That guest is already on the list.");
    return;
  }

  guests.push({
    id: crypto.randomUUID(),
    name,
    email: formData.get("guestEmail").trim(),
    group: formData.get("inviteGroup").trim(),
    inviteStatus: formData.get("inviteStatus"),
    rsvpStatus: "pending",
    partySize: 1,
    note: ""
  });

  saveGuests();
  guestForm.reset();
  renderGuests();
}

function submitRsvp(event) {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const name = formData.get("rsvpName").trim();
  const existingGuest = guests.find((guest) => normalizeName(guest.name) === normalizeName(name));

  const guest = existingGuest || {
    id: crypto.randomUUID(),
    name,
    email: "",
    group: "RSVP",
    inviteStatus: "rsvp received",
    rsvpStatus: "pending",
    partySize: 1,
    note: ""
  };

  guest.rsvpStatus = formData.get("rsvpStatus");
  guest.partySize = Number(formData.get("partySize"));
  guest.note = formData.get("message").trim();

  if (!existingGuest) {
    guests.push(guest);
  }

  saveGuests();
  rsvpForm.reset();
  rsvpMessage.textContent = "Thank you. Your RSVP has been saved.";
  renderGuests();
}

function removeGuest(event) {
  const deleteId = event.target.dataset.delete;

  if (!deleteId) {
    return;
  }

  guests = guests.filter((guest) => guest.id !== deleteId);
  saveGuests();
  renderGuests();
}

function loadSampleGuests() {
  const shouldLoad = guests.length === 0 || confirm("Replace your current list with sample guests?");

  if (!shouldLoad) {
    return;
  }

  guests = sampleGuests.map((guest) => ({ ...guest, id: crypto.randomUUID() }));
  saveGuests();
  renderGuests();
}

function exportCsv() {
  const header = ["Name", "Email", "Group", "Invite status", "RSVP", "Party size", "Note"];
  const rows = guests.map((guest) => [
    guest.name,
    guest.email,
    guest.group,
    guest.inviteStatus,
    guest.rsvpStatus,
    guest.partySize,
    guest.note
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding-guests.csv";
  link.click();
  URL.revokeObjectURL(url);
}

guestForm.addEventListener("submit", addGuest);
rsvpForm.addEventListener("submit", submitRsvp);
guestTableBody.addEventListener("click", removeGuest);
searchInput.addEventListener("input", renderGuests);
exportButton.addEventListener("click", exportCsv);
resetSampleButton.addEventListener("click", loadSampleGuests);

renderGuests();
