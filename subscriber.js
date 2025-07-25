const { connect } = require("nats");
const logger = require("./logger");

(async () => {
  const nc = await connect({
    servers: process.env.NATS_URL || "localhost:4222",
  });

  // 🟢 Helper function to handle subscription in its own loop
  const subscribe = async (subject, handler) => {
    const sub = nc.subscribe(subject);
    logger.info(`✅ Subscribed to '${subject}'`);
    // console.log(`✅ Subscribed to '${subject}'`);
    for await (const msg of sub) {
      const data = JSON.parse(msg.data);
      handler(data);
    }
  };

  // Run subscriptions in parallel
  subscribe("issue.created", (data) => {
    logger.info("Issue Created:", data);
    // console.log("Issue Created:", data);
  });

  subscribe("issues.retrieved", (data) => {
    logger.info("Issues Retrieved:", data);
    // console.log("Issues Retrieved:", data);
  });

  subscribe("issue.updated", (data) => {
    logger.info("Issue Updated:", data);
    // console.log("Issue Updated:", data);
  });

  subscribe("issue.deleted", (data) => {
    logger.info("Issue Deleted:", data);
    // console.log("Issue Deleted:", data);
  });
})();
