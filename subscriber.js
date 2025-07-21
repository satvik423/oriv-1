const { connect } = require("nats");

(async () => {
  const nc = await connect({ servers: "localhost:4222" });

  // 🟢 Helper function to handle subscription in its own loop
  const subscribe = async (subject, handler) => {
    const sub = nc.subscribe(subject);
    console.log(`✅ Subscribed to '${subject}'`);
    for await (const msg of sub) {
      const data = JSON.parse(msg.data);
      handler(data);
    }
  };

  // Run subscriptions in parallel
  subscribe("issue.created", (data) => {
    console.log("Issue Created:", data);
  });

  subscribe("issues.retrieved", (data) => {
    console.log("Issues Retrieved:", data);
  });

  subscribe("issue.updated", (data) => {
    console.log("Issue Updated:", data);
  });

  subscribe("issue.deleted", (data) => {
    console.log("Issue Deleted:", data);
  });
})();
