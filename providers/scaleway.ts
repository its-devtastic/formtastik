import { TransactionalEmail, createClient } from "@scaleway/sdk";

export default async function scalewayProvider(data: Record<string, unknown>) {
  const client = createClient({
    accessKey: process.env.SCW_ACCESS_KEY,
    secretKey: process.env.SCW_SECRET_KEY,
    defaultRegion: "fr-par",
  });

  const api = new TransactionalEmail.v1alpha1.API(client);

  try {
    await api.createEmail({
      to: process.env.SCW_RECIPIENTS!.split(",").map((email) => ({ email })),
      projectId: process.env.SCW_PROJECT_ID,
      subject: process.env.SCW_EMAIL_SUBJECT!,
      from: {
        name: process.env.SCW_FROM_NAME,
        email: process.env.SCW_FROM_EMAIL!,
      },
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
