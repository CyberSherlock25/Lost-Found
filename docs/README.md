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
Run the SQL files in this order from the repository root. On Windows, use the
full path if `mysql` is not on your `PATH`:
```text
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

Then run these commands at the `mysql>` prompt. Do not add a semicolon to a
`SOURCE` command:
```text
SOURCE D:/MCA/AIT/Project/Lost-Found/database/01_create_database.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/02_create_tables.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/05_categories.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/06_locations.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/07_item_types.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/08_item_statuses.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/07_items.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/10_item_images.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/11_claim_statuses.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/11_claims.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/12_notification_types.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/12_notifications.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/13_announcements.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/14_audit_logs.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/15_refresh_tokens.sql
SOURCE D:/MCA/AIT/Project/Lost-Found/database/16_otp_requests.sql
USE lost_found_db;
SHOW TABLES;
```

### 2. Backend Setup (Java 21 + Spring Boot)
From PowerShell, use the project launcher. It configures Java 21 and the
bundled Maven installation for the current process:
```powershell
cd backend
.\run-backend.ps1
```
Backend will start on `http://localhost:8080`.

Alternatively, close and reopen PowerShell so the persistent PATH changes are
loaded, then run:
```powershell
mvn clean spring-boot:run
```

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
