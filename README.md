# RisenCore 🚀

**RisenCore: Your Open-Source Digital Life Assistant**

RisenCore is a full-stack web application designed to be a central hub for managing personal life data. From daily tasks and financial transactions to health tracking and AI-powered weekly reviews, RisenCore aims to provide a secure, intuitive, and powerful platform to help you organize your digital life.

This project is being developed to showcase modern, professional, and enterprise-level software development practices using a Java (Spring Boot) backend and a React frontend, fully containerized with Docker.

---

### ✨ Features

- **Secure Authentication:** JWT-based user registration and login system.
- **Role-Based Access Control (RBAC):** Distinct `USER` and `ADMIN` roles with protected endpoints and UI elements.
- **Task Management:** A full CRUD module for users to manage their personal tasks.
- **Financial Tracking:** A module for tracking personal income and expenses.
- **Health Tracking:** Monitor vital health metrics like weight, sleep, and exercise.
- **AI Weekly Review:** Get personalized, AI-generated insights and summaries of your week (powered by Google Gemini).
- **Admin Panel:** A dedicated view for administrators to manage users.
- **Responsive UI:** A clean and modern user interface that works seamlessly on desktop and mobile devices.
- **API Documentation:** Interactive API documentation powered by Swagger/OpenAPI.
- **Database Migrations:** Version-controlled database schema management with Flyway.

---

### 📸 Screenshots

Here's a sneak peek of RisenCore in action:

**Login Page:**
![Login Page View](screenshots/login.png)

**Dashboard:**
![Dashboard View](screenshots/dashboard.png)

**Admin Panel:**
![Admin Panel View](screenshots/admin_panel.png)

---

### 🛠️ Tech Stack

**Backend:**
- **Java 17** & **Spring Boot 3**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** & **Hibernate**
- **PostgreSQL** (Database)
- **Flyway** (Database Migrations)
- **MapStruct** (Object Mapping)
- **Springdoc OpenAPI** (API Documentation)
- **Google Gemini API** (AI Integration)
- **Maven** (Build Tool)

**Frontend:**
- **React**
- **Vite** (Build Tool)
- **Axios** (HTTP Client)
- **React Router** (Routing)
- **React Hot Toast** (Notifications)
- **CSS Modules** (Styling)

**DevOps:**
- **Docker** & **Docker Compose**

---

### 🚀 Getting Started

The easiest way to run RisenCore is using Docker Compose.

**Prerequisites:**
- Docker & Docker Compose installed on your machine.
- Git.

**1. Clone the repository:**
```sh
git clone https://github.com/ersinelmas/RisenCore.git
cd RisenCore
```

**2. Configure Environment (Optional):**
- The project comes with default configuration for local development in `docker-compose.yml` and `.env`.
- If you want to use the AI features, you need to provide a Google Gemini API key.
- Create a `.env` file in the root directory (or modify the existing one) and add:
  ```env
  GEMINI_API_KEY=your_actual_api_key_here
  ```

**3. Run with Docker Compose:**
```sh
docker-compose up --build
```

**That's it!** 🎉

- **Frontend:** Open [http://localhost:5173](http://localhost:5173) in your browser.
- **Backend API:** Running on `http://localhost:8080`.
- **API Documentation:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).

**Default Credentials:**
- **Admin:** `adminuser` / `adminpass`
- **User:** `testuser` / `userpass`

To stop the application:
```sh
docker-compose down
```

---

### 📄 License

This project is licensed under the **Apache License 2.0**. See the `LICENSE` file for details.

Copyright 2025, Ersin Elmas.
