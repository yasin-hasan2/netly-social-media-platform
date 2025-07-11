// instrument.js
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import dotenv from "dotenv";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});

Sentry.startSpan({ name: "Server Startup" }, () => {
  // Optional: Put startup profiling logic here
});
