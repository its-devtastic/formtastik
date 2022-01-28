export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json();
  }

  console.log("New form submission", req.body);

  // Add row in a Google sheet
  if (process.env.FORMTASTIK_SHEET_URL) {
    const { GoogleSpreadsheet } = require("google-spreadsheet");

    const doc = new GoogleSpreadsheet(process.env.FORMTASTIK_SHEET_URL);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow(req.body);
  }

  // Send email using AWS SES
  if (process.env.FORMTASTIK_EMAIL_TO && process.env.FORMTASTIK_EMAIL_FROM) {
    const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

    const client = new SESClient({ region: "eu-west-1" });
    const command = new SendEmailCommand({
      Source: process.env.FORMTASTIK_EMAIL_FROM,
      Destination: { ToAddresses: [process.env.FORMTASTIK_EMAIL_TO] },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: Object.keys(req.body)
              .map((key) => `<strong>${key}</strong>: ${req.body[key]}`)
              .join("<br />"),
          },
          Text: {
            Charset: "UTF-8",
            Data: Object.keys(req.body)
              .map((key) => `${key}: ${req.body[key]}`)
              .join("\n"),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "New form submission",
        },
      },
    });

    try {
      await client.send(command);
    } catch (error) {
      console.error(error);
    }
  }

  res.status(201).json();
}
