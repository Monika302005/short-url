# Custom URL Shortener

A robust, secure, and performance-optimized URL Shortener API and web application built using **Node.js**, **Express.js**, **MongoDB**, and **EJS**. 

This project features complete user authentication, role-based authorization (RBAC) using JWT, analytics tracking, and server-side rendering.

## 🚀 Features

- **URL Shortening**: Generates secure, 8-character unique short IDs using `nanoid`.
- **Analytics & Tracking**: Tracks click counts and registers detailed visit history (timestamp logs) for every redirected link.
- **User Authentication**: Secured Signup and Login system using Cookies and JSON Web Tokens (JWT).
- **Role-Based Access Control (RBAC)**: 
  - **Normal Users**: Can create short links and view their own list of shortened links.
  - **Admin Users**: Have access to the `/admin/urls` dashboard to monitor all URLs generated in the system.
- **Server-Side Rendering (SSR)**: Dynamic page rendering using EJS template engine.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose (ODM)
- **Authentication**: JSON Web Tokens (JWT), Cookie-Parser
- **View Engine**: EJS (Embedded JavaScript)
- **ID Generation**: NanoID

---

## 💻 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/short-url.git
   cd short-url
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start MongoDB**:
   Ensure your local MongoDB instance is active:
   ```bash
   mongod
   ```

4. **Start the Application**:
   For local development (with hot-reloading):
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```
   *The server will start on `http://localhost:8001`.*

### Environment Variables

You can configure the following environment variables if deploying online:
- `PORT`: Port the server runs on (defaults to `8001`).
- `MONGODB_URI`: MongoDB connection string (defaults to `mongodb://localhost:27017/short-url`).

---

## 🔌 API Endpoints & Routes

| HTTP Method | Route | Description | Access Level |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Renders user's home dashboard with their shortened URLs | Normal / Admin |
| **GET** | `/signup` | Renders the signup page | Public |
| **GET** | `/login` | Renders the login page | Public |
| **GET** | `/admin/urls` | Renders dashboard of all shortened URLs in the system | Admin Only |
| **POST** | `/url` | Generates a new short URL for the provided original URL | Normal / Admin |
| **GET** | `/url/:shortId` | Redirects to the original URL and tracks analytics | Public |
| **GET** | `/url/analytics/:shortId` | Returns JSON containing total clicks and visit history | Normal / Admin |

---

## 📁 Directory Structure

```text
├── controllers/      # Request handlers / Controller logic
├── middlewares/      # Express authorization & authentication middlewares
├── models/           # Mongoose schemas (URL, User)
├── routes/           # Express router setup (static, url, user)
├── service/          # Utility services (JWT handler)
├── views/            # EJS templates for UI pages (home, signup, login)
├── connect.js        # MongoDB connection setup
├── index.js          # Main entrypoint of the application
├── package.json      # Dependencies and npm scripts
└── README.md         # Project documentation
```
