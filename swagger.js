// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Issue Tracker API",
      version: "1.0.0",
      description: "API documentation for the Issue Tracker App",
    },
    servers: [
      {
        url: "http://localhost:5000", // change based on your environment
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // path to files where API is defined
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at http://localhost:5000/api-docs");
}

module.exports = swaggerDocs;
