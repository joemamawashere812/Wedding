const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbzMcxjV-opABaeEQzhdE971wMQQIfONaT1CAxGD5EH6c_L8-oSl1RjLUyKwbgoaw5lgXQ/exec";

const rsvpForm = document.querySelector("#rsvpForm");
const rsvpMessage = document.querySelector("#rsvpMessage");
const submitButton = document.querySelector("#submitButton");

function getFormPayload() {
  const formData = new FormData(rsvpForm);
  const submittedAt = new Date().toISOString();

  return {
    submittedAt,
    firstName: formData.get("firstName").trim(),
    lastName: formData.get("lastName").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    address1: formData.get("address1").trim(),
    address2: formData.get("address2").trim(),
    city: formData.get("city").trim(),
    state: formData.get("state").trim(),
    zip: formData.get("zip").trim(),
    rsvpStatus: formData.get("rsvpStatus"),
    partySize: formData.get("partySize"),
    message: formData.get("message").trim()
  };
}

function setFormState(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Sending..." : "Send RSVP";
}

async function submitRsvp(event) {
  event.preventDefault();

  if (!RSVP_ENDPOINT) {
    rsvpMessage.textContent = "This form is ready. Add your private Google Sheet endpoint in script.js before sharing it.";
    rsvpMessage.className = "status-message warning";
    return;
  }

  setFormState(true);
  rsvpMessage.textContent = "";
  rsvpMessage.className = "status-message";

  try {
    await fetch(RSVP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(getFormPayload())
    });

    rsvpForm.reset();
    rsvpMessage.textContent = "Thank you. Your RSVP has been sent.";
    rsvpMessage.className = "status-message success";
  } catch {
    rsvpMessage.textContent = "Something went wrong. Please try again in a moment.";
    rsvpMessage.className = "status-message error";
  } finally {
    setFormState(false);
  }
}

rsvpForm.addEventListener("submit", submitRsvp);
