const express = require("express");
const { google } = require("googleapis");
const app = express();
const PORT = process.env.PORT || 3000;

// Authentication using your downloaded service account key
const auth = new google.auth.GoogleAuth({
  keyFile: "sheet-reader-key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

app.get("/data", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1sNCiX5Uboa-7wei2H_IxNsgtUYO53s56fjPiyc3Uaxg", // Replace with your actual spreadsheet ID
      range: "Sheet1",
    });

    const rows = response.data.values;
    const headers = rows[0];
    const data = rows.slice(1).map(row =>
      Object.fromEntries(headers.map((key, i) => [key, row[i] || ""]))
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading sheet");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
