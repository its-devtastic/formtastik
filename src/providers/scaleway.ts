import { TransactionalEmail, createClient } from "@scaleway/sdk";

export default async function scalewayProvider(data: Record<string, unknown>) {
  const client = createClient({
    accessKey: process.env.SCW_ACCESS_KEY,
    secretKey: process.env.SCW_SECRET_KEY,
  });

  const api = new TransactionalEmail.v1alpha1.API(client);

  try {
    await api.createEmail({
      projectId: process.env.SCW_PROJECT_ID,
      subject: "New form submission",
      from: { name: "Devtastic", email: "noreply@devtastic.co" },
      text: Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n"),
      html: Object.entries(data)
        .map(([key, value]) => `<strong>${key}</strong>: ${value}`)
        .join("<br />"),
    });
  } catch (e) {
    console.error(e);
  }
}
