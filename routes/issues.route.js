const express = require("express");
const router = express.Router();
const roles = require("../middlewares/roles");
const {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
} = require("../controllers/issues");

/**
 * @swagger
 * components:
 *   schemas:
 *     Issue:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *         - priority
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the issue
 *         title:
 *           type: string
 *           description: Title of the issue
 *         description:
 *           type: string
 *           description: Description of the issue
 *         status:
 *           type: string
 *           enum: [open, in-progress, closed]
 *           description: Current status of the issue
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority level
 *       example:
 *         title: "Login button not working"
 *         description: "The login button on the homepage does nothing when clicked."
 *         status: "open"
 *         priority: "high"
 */

/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: Issue management endpoints
 */

/**
 * @swagger
 * /api/issues:
 *   get:
 *     summary: Get all issues
 *     tags: [Issues]
 *     responses:
 *       200:
 *         description: List of issues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Issue'
 */
router.get("/", roles("admin", "tester", "issuer"), getIssues);

/**
 * @swagger
 * /api/issues:
 *   post:
 *     summary: Create a new issue
 *     tags: [Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Issue'
 *     responses:
 *       201:
 *         description: Issue created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", roles("issuer"), createIssue);

/**
 * @swagger
 * /api/issues/{id}:
 *   put:
 *     summary: Update an existing issue
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The issue ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Issue'
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *       404:
 *         description: Issue not found
 */
router.put("/:id", roles("tester"), updateIssue);

/**
 * @swagger
 * /api/issues/{id}:
 *   delete:
 *     summary: Delete an issue
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The issue ID
 *     responses:
 *       200:
 *         description: Issue deleted successfully
 *       404:
 *         description: Issue not found
 */
router.delete("/:id", roles("admin"), deleteIssue);

module.exports = router;
