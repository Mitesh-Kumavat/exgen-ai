# 🧠 ExGen AI – AI-Powered Digital Exam System

 

[![Watch Demo](https://img.shields.io/badge/Demo-YouTube-red)](https://youtu.be/OjIBbQ64HsM)

ExGen AI is a smart, secure, and scalable digital exam platform that dynamically generates and evaluates student-specific question papers using AI. Designed to mimic real-world exam systems, it supports subjective, objective, and coding questions with detailed automated feedback.

---

## 🚀 Features

### 👨‍🏫 Admin Panel
- **Create Exam**: Upload syllabus PDFs and define question pattern (marks, chapter-wise weightage, types).
- **Manage Exams**: View all exams, change status, view/export results, and delete exams.
- **Student Management**:
  - Add students via CSV or form
  - Auto-generate passwords (visible to admin)
  - Reset passwords for upcoming exams
  - Email credentials to students
- **Query Resolution**:
  - Review and update scores manually
  - Email student after resolution (marks changed or unchanged)

---

### 🧑‍🎓 Student Portal
- Login using enrollment number and password
- **AI-generated question paper** upon starting exam
- Answer MCQ, subjective, and coding questions
- Auto-evaluation on submission with:
  - **Per-question feedback** (for subjective & coding)
  - **Overall performance summary**
- Secure interface:
  - Disables right-click, copy-paste, inspect element
  - Enforces full-screen mode  

---

## 🧠 AI Capabilities (via LangChain)
- Vectorize syllabus PDFs using **ChromaDB**
- Generate unique, pattern-aligned exam paper per student
- Evaluate answers using LLMs (no ML model used)
- Return rich feedback on:
  - Subjective answers (coverage, reasoning)
  - Coding questions (logic, structure, syntax)

---

## 🛠 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React, TailwindCSS, ShadCN     |
| Backend     | Node.js (Express)              |
| AI Service  | Python (FastAPI + LangChain)   |
| Vector DB   | ChromaDB (local, persistent)   |
| Auth        | Custom auth for Admin/Student  |
| Deployment  | 🔧 *Not deployed yet* due to local ChromaDB |
| Email       | Nodemailer (results, credentials, queries) |
| PDF Notes       | Cloudinary |

---

## 📹 Demo

📺 **Watch full demo video:**  
[👉 https://youtu.be/OjIBbQ64HsM](https://youtu.be/OjIBbQ64HsM)

> © 2025 Mitesh — Original Author  
> This project is proprietary. Unauthorized copying, modification, or redistribution of any part of this code or documentation is strictly prohibited. 
