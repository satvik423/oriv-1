# 🛠️ Issue Management API with NATS Integration

A simple Express.js + MongoDB REST API to manage issues (create, update, delete, get), with real-time messaging using **NATS** for event streaming.

---

## 📦 Tech Stack

- **Node.js / Express**
- **MongoDB / Mongoose**
- **NATS Messaging**
- **Docker (for running NATS server)**

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/satvik423/oriv-1.git
cd oriv-1
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Create `.env` File

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/issuesdb
```

> Replace with your actual Mongo URI if needed (e.g., Atlas)

---

### 4️⃣ Run NATS Server (via Docker)

If you have Docker installed, start the NATS server with:

```bash
docker pull nats:latest
docker run -p 4222:4222 -p 8222:8222 nats
```

- NATS will run on `localhost:4222`
- Monitoring UI (optional) on `localhost:8222`

---

### 5️⃣ Start the Server

```bash
npm run dev
```

> Uses `nodemon` to auto-restart on changes

---

## 🔁 REST API Endpoints

All endpoints are prefixed with `/api/issues`

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/issues`     | Get all issues     |
| POST   | `/api/issues`     | Create a new issue |
| PUT    | `/api/issues/:id` | Update an issue    |
| DELETE | `/api/issues/:id` | Delete an issue    |

---

## 📄 Issue Model

```js
{
  title: String,           // required
  description: String,     // required
  status: "open" | "in progress" | "closed",   // default: "open"
  priority: "low" | "medium" | "high",         // default: "medium"
  createdAt: Date,         // default: Date.now
  updatedAt: Date          // default: Date.now
}
```

---

## 📡 NATS Events Published

| Event           | Description                  |
| --------------- | ---------------------------- |
| `issue.created` | Fired after issue is created |
| `issue.updated` | Fired after issue is updated |
| `issue.deleted` | Fired after issue is deleted |

> You can run a `subscriber.js` file to log or process events. node subscriber.js

---

## 🧪 Testing with Postman

- Use tools like Postman
- Set `Content-Type: application/json`
- Example request body for POST/PUT:

```json
{
  "title": "Fix login bug",
  "description": "User cannot log in with correct password",
  "status": "open",
  "priority": "high"
}
```

---

## 🧰 Scripts

| Script        | Description                                    |
| ------------- | ---------------------------------------------- |
| `npm start`   | Run the server normally                        |
| `npm run dev` | Run with nodemon (auto-reload on file changes) |

---
