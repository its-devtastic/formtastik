# Formtastik
Form API handler for Vercel Cloud projects.

## Installation

```shell
npm i formtastik
```

Add the following to your `next.config.js`

```js
transpilePackages: ["formtastik"]
```

## Providers

### Scaleway Transaction Email

Install the required dependency
```shell
npm i @scaleway/sdk
```

Create a file in the `api` directory with the following content:

```js
import createFormHandler from "formtastik";
import scaleway from "formtastik/providers/scaleway";

export default createFormHandler({
  providers: [scaleway],
});
```
Add the following environment variables to your .env file
```dotenv
SCW_ACCESS_KEY=XXX
SCW_SECRET_KEY=XXX
SCW_PROJECT_ID=XXX
SCW_RECIPIENTS=joe@example.com,jane@example.com
SCW_EMAIL_SUBJECT='New form submission'
SCW_FROM_NAME='Your App'
SCW_FROM_EMAIL=noreply@example.com
```
