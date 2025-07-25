"use strict";

const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-base");
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require("@opentelemetry/sdk-metrics");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  defaultResource,
  resourceFromAttributes,
} = require("@opentelemetry/resources");

const {
  SERVICE_NAME,
  SERVICE_VERSION,
  DEPLOYMENT_ENVIRONMENT,
  HOST_NAME,
} = require("@opentelemetry/semantic-conventions");
// const { Resource } = require("@opentelemetry/resources");

const os = require("os");

// ✅ Define a Resource describing your service
const resource = defaultResource().merge(
  resourceFromAttributes({
    [SERVICE_NAME]: "issue-tracker-service",
    [SERVICE_VERSION]: "1.0.0",
    [DEPLOYMENT_ENVIRONMENT]: "dev",
    [HOST_NAME]: os.hostname(),
    "custom.attribute.team": "platform",
  })
);

const instrumentations = getNodeAutoInstrumentations({
  // Disable or configure specific plugins
  "@opentelemetry/instrumentation-fs": {
    enabled: false,
  },
  "@opentelemetry/instrumentation-dns": {
    enabled: false,
  },
  "@opentelemetry/instrumentation-http": {
    enabled: true,
    ignoreIncomingPaths: ["/health", "/favicon.ico"],
  },
});

// ✅ Create the OpenTelemetry SDK
const sdk = new NodeSDK({
  resource,
  traceExporter: new ConsoleSpanExporter(), // change to OTLP or Jaeger later
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// ✅ Start the SDK
try {
  sdk.start();
  console.log("Tracing started");
} catch (error) {
  console.error("Error starting tracing", error);
}

// ✅ Handle graceful shutdown
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing stopped"))
    .catch((err) => console.error("Error stopping tracing", err));
});
