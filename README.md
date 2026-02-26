# CipherSQL Studio

A premium browser-based SQL learning platform built with the MERN stack architecture, designed to provide a secure and interactive SQL practice environment.

---

# 🚀 Tech Stack

## Frontend
- React.js (Vite)
- Vanilla SCSS (Mobile-first architecture)
- Monaco Editor
- Lucide Icons

## Backend
- Node.js
- Express.js

## Databases
- **Persistence Database:** MongoDB (Stores assignments and metadata)
- **Sandbox Database:** PostgreSQL (Executes user SQL queries securely)

## AI Integration
- Google Gemini API (Provides intelligent conceptual hints only)

---

# 🌟 Core Features

## 1. Assignment Listing
- Browse SQL challenges categorized by difficulty.
- Each assignment includes schema and sample data.
- Assignments are stored in MongoDB.

## 2. Interactive SQL Editor
- Monaco Editor integration.
- SQL syntax highlighting.
- Professional IDE-like coding experience.

## 3. Real-Time Query Execution
- Executes queries securely in PostgreSQL sandbox.
- Displays results instantly in structured table format.
- Handles SQL errors gracefully.

## 4. Intelligent Hint System
- Gemini AI provides conceptual hints.
- Prevents full solution disclosure.
- Encourages guided learning instead of copying.

## 5. Schema Viewer
- View database table structures.
- Explore sample data for each assignment.
- Helps understand relational mapping.

---

# ⚙️ Project Setup Instructions

## ✅ Prerequisites

Ensure the following are installed:

- Node.js (v18+ recommended)
- MongoDB (Local instance or Atlas URI)
- PostgreSQL (Running locally)

---

# 🖥 Backend Setup

### Step 1: Navigate to backend folder

```bash
cd backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create `.env` file

Inside `/backend`, create a file named `.env` and add:

```env
MONGODB_URI=mongodb://localhost:27017/ciphersql

PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_postgres_password
PGDATABASE=ciphersandbox
PGPORT=5432

GEMINI_API_KEY=your_gemini_api_key
```

### Step 4: Seed the Databases

```bash
node seed.js
```

This will:
- Create PostgreSQL tables
- Insert schema and sample data
- Seed MongoDB with assignments

### Step 5: Start Backend Server

```bash
node server.js
```

Backend runs at:
```
http://localhost:5000
```

---

# 💻 Frontend Setup

### Step 1: Navigate to frontend folder

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start development server

```bash
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

# 🔐 Environment Variables Explanation

| Variable | Purpose |
|-----------|----------|
| MONGODB_URI | Connects to MongoDB (stores assignments) |
| PGHOST | PostgreSQL host |
| PGUSER | PostgreSQL username |
| PGPASSWORD | PostgreSQL password |
| PGDATABASE | Sandbox database name |
| PGPORT | PostgreSQL port (default 5432) |
| GEMINI_API_KEY | API key for Gemini AI hint generation |

---

# 🧠 Technology Choices Explanation

## Why React?
- Component-based architecture
- Efficient state management
- Clean separation of UI logic

## Why Vanilla SCSS?
- Demonstrates CSS fundamentals
- Uses variables, mixins, nesting, partials
- Mobile-first responsive approach
- BEM naming convention

## Why PostgreSQL for Sandbox?
- Industry-standard relational database
- Accurate SQL execution
- Structured schema validation

## Why MongoDB for Persistence?
- Flexible document storage
- Easy assignment management
- Decouples metadata from execution database

## Why Gemini AI?
- Provides guided conceptual hints
- Prevents direct solution exposure
- Controlled prompt engineering

---

# 🔁 Data-Flow Diagram (Compulsory – Must Be Drawn By Hand)

You must draw this manually and include it in submission to prove understanding.

---

## Scenario: User Clicks "Run Query"

### Step 1
User writes SQL query in Monaco Editor.

### Step 2
User clicks **Run Query** button.

### Step 3
Frontend captures editor content.

### Step 4
Query is stored in React state.

### Step 5
Frontend sends API request:

```
POST /api/queries/execute
```

Request Body:
```json
{
  "query": "SELECT * FROM users;"
}
```

### Step 6
Express server receives request.

### Step 7
Validation Middleware:
- Blocks DROP, DELETE, UPDATE, INSERT, ALTER
- Allows only SELECT statements

### Step 8
Backend executes query on PostgreSQL:

```javascript
pool.query(query)
```

### Step 9
PostgreSQL processes query in sandbox database.

### Step 10
Database returns:
- Result rows (success)
- Error object (failure)

### Step 11
Backend sends JSON response to frontend.

### Step 12
Frontend updates:
- Results state
- Error state

### Step 13
Results component re-renders.

### Step 14
Formatted table is displayed in DOM.

---

## Hand-Drawn Diagram 

- User
- React Frontend
- API Call
- Express Backend
- Validation Middleware
- PostgreSQL Sandbox
- JSON Response
- React State Update
- UI Re-render

Label arrows clearly:
- HTTP Request
- Middleware Validation
- Database Query
- JSON Response
- State Update
- Component Re-render

---

# 📘 Reference & Helping Guide

## Essential Schema Design

Each Assignment Document (MongoDB) contains:

- title
- difficulty
- description
- question
- schemaSQL
- sampleDataSQL

Assignments are inserted via `seed.js`.

---

## Sandbox Security Guide

- Allow only SELECT queries.
- Reject destructive SQL commands.
- Catch SQL syntax errors safely.
- Prevent injection via strict validation.
- Optional isolation:

```sql
SET search_path TO assignment_schema;
```

---

## Key Architectural Decisions

1. Separate persistence DB (MongoDB) and execution DB (PostgreSQL).
2. Middleware-based query validation.
3. MVC-based backend structure.
4. Mobile-first SCSS design system.
5. AI restricted to hint-only mode.
6. Strict frontend-backend separation.

---

# 📱 Responsive Design Strategy

Breakpoints:

- 320px – Mobile
- 640px – Tablet
- 1024px – Desktop
- 1280px+ – Large screens

Design principles:

- Vertical stacking on mobile
- Grid layout for larger screens
- Scrollable result tables
- Touch-friendly UI controls
- Clear visual hierarchy

---

# 🎯 Conclusion

CipherSQL Studio demonstrates:

- Secure SQL execution
- Clean full-stack architecture
- Proper request-response lifecycle
- Database isolation and validation
- Responsive UI design
- Responsible AI integration

This project emphasizes system design clarity, secure database handling, and complete end-to-end data flow understanding.