// utils/nats-wrapper.js
const { connect } = require("nats");
const logger = require("../logger");

let natsConnection;

async function connectNats() {
  natsConnection = await connect({
    servers: process.env.NATS_URL || "localhost:4222",
  });
  logger.info("✅ Connected to NATS");
  // console.log("✅ Connected to NATS");

  natsConnection.closed().then(() => {
    logger.info("🔴 NATS connection closed");
    // console.log("🔴 NATS connection closed");
  });

  return natsConnection;
}

function getNatsConnection() {
  if (!natsConnection) throw new Error("NATS not connected yet!");
  return natsConnection;
}

module.exports = {
  connectNats,
  getNatsConnection,
};
