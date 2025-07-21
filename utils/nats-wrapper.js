// utils/nats-wrapper.js
const { connect } = require("nats");

let natsConnection;

async function connectNats() {
  natsConnection = await connect({ servers: "localhost:4222" }); // or your NATS server URL
  console.log("✅ Connected to NATS");

  natsConnection.closed().then(() => {
    console.log("🔴 NATS connection closed");
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
