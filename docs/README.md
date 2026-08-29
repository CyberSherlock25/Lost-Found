# Lost & Found Platform (Smart University Management System)

A production-grade Enterprise SaaS platform built with modern architectural standards for smart university lost and found item management.

---
   
## 🏛️ System Architecture Overview

The platform uses a decoupled clean architecture:
- **Backend**: Java 21, Spring Boot 3.3.0, Spring Security 6 with JWT (Access + Refresh token engine), Spring Data JPA, Bean Validation, MySQL database.
- **Strict Boilerplate Enforcement**: **NO Lombok** (all constructors, getters, setters, `equals()`, `hashCode()`, and `toString()` written manually).
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Chart.js, React Hook Form, Zod Validation, React Hot Toast.
- **Design System**: Modern SaaS dark glassmorphism design (`bg-slate-950`), custom CSS glass panels (`glass-panel`, `glass-card`), vibrant gradient buttons, micro-interactions, responsive sidebars, and skeleton loading states.

---

## 👥 Role Based Access Control (RBAC) Matrix

| Feature / Action | Admin | Staff (Security) | Teacher | Student |
| :--- | :---: | :---: | :---: | :---: |
| **Browse & Search Items** | ✅ | ✅ | ✅ | ✅ |
| **Report Lost Item** | ✅ | ✅ | ✅ | ✅ |
| **Upload Found Item** | ✅ | ✅ | ❌ | ❌ |
| **Verify Found Item** | ✅ | ✅ | ❌ | ❌ |
| **Submit Ownership Claim** | ❌ | ❌ | ✅ | ✅ |
| **Review Claims (Approve / Reject)** | ✅ | ✅ | ❌ | ❌ |
| **Mark Item Collected** | ✅ | ✅ | ❌ | ❌ |
| **Post Campus Announcements** | ✅ | ✅ | ✅ | ❌ |
| **User Directory & Role Management**| ✅ | ❌ | ❌ | ❌ |
| **Category & Location Management** | ✅ | ❌ | ❌ | ❌ |
| **System Security Audit Logs** | ✅ | ❌ | ❌ | ❌ |

---

## 🚀 Getting Started

### 1. Database Initialization
Execute the seed script inside MySQL:
```bash
mysql -u root -p lost_found_db < database/00_master_seed.sql
```

### 2. Backend Setup (Java 21 + Spring Boot)
```bash
cd backend
mvn clean spring-boot:run
```
Backend will start on `http://localhost:8080`.

### 3. Frontend Setup (React 18 + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## 🔐 Default Demo Accounts (Password: `Password@123`)

- **Administrator**: `admin@university.edu`
- **Security Officer**: `security@university.edu`
- **Faculty / Teacher**: `robert.chen@university.edu`
- **Student**: `alex.morgan@university.edu`
