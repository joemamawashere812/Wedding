# RSVP Google Sheet Setup

This site is ready to send RSVP submissions to a private Google Sheet.

## 1. Create the private sheet

Create a new Google Sheet in your Google account. Name it something like `Wedding RSVPs`.

## 2. Add the Apps Script

In the Google Sheet, go to `Extensions` > `Apps Script`.

Delete the starter code and paste the contents of `google-apps-script.js`.

## 3. Deploy the script

Click `Deploy` > `New deployment`.

Choose:

- Type: `Web app`
- Execute as: `Me`
- Who has access: `Anyone`

Click `Deploy`, approve access, and copy the Web App URL.

## 4. Connect the website

Open `script.js` and replace:

```js
const RSVP_ENDPOINT = "";
```

with:

```js
const RSVP_ENDPOINT = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
```

## 5. Test once

Submit the RSVP form from the website and confirm a new row appears in your private Google Sheet.

Do not put guest phone numbers or addresses directly in this GitHub repository.
