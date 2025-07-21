# RisenCore 🚀

**RisenCore: Your Open-Source Digital Life Assistant**

RisenCore is a full-stack web application designed to be a central hub for managing personal life data. From daily tasks and financial transactions to future modules like health tracking and personal notes, RisenCore aims to provide a secure, intuitive, and powerful platform to help you organize your digital life.

This project is being developed to showcase modern, professional, and enterprise-level software development practices using a Java (Spring Boot) backend and a React frontend.

---

### ✨ Features

- **Secure Authentication:** JWT-based user registration and login system.
- **Role-Based Access Control (RBAC):** Distinct `USER` and `ADMIN` roles with protected endpoints and UI elements.
- **Task Management:** A full CRUD module for users to manage their personal tasks.
- **Financial Tracking:** A module for tracking personal income and expenses.
- **Admin Panel:** A dedicated view for administrators to manage users.
- **Responsive UI:** A clean and modern user interface that works seamlessly on desktop and mobile devices.
- **API Documentation:** Interactive API documentation powered by Swagger/OpenAPI.
- **Database Migrations:** Version-controlled database schema management with Flyway.

---

### 📸 Screenshots

Here's a sneak peek of RisenCore in action:

**Dashboard:**
![Dashboard View](screenshots/dashboard.png)

**Admin Panel:**
![Admin Panel View](screenshots/admin_panel.png)

**Login Page:**
![Login Page View](screenshots/login.png)


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
- **Maven** (Build Tool)

**Frontend:**
- **React**
- **Vite** (Build Tool)
- **Axios** (HTTP Client)
- **React Router** (Routing)
- **React Hot Toast** (Notifications)
- **CSS Modules** (Styling)

---

### 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

**Prerequisites:**
- Java 17+
- Maven
- Node.js & npm
- PostgreSQL

**1. Clone the repository:**
```sh
git clone https://github.com/ersinelmas/RisenCore.git
cd RisenCore
```

**2. Backend Setup:**
- Navigate to the `backend` directory: `cd backend`
- Create a PostgreSQL database named `risencore_db`.
- Update the database credentials in `src/main/resources/application.properties`.
- Run the application using your IDE or Maven:
  ```sh
  mvn spring-boot:run
  ```
- The backend will start on `http://localhost:8080`.
- API documentation is available at `http://localhost:8080/swagger-ui.html`.
- On first run, Flyway will create the necessary tables, and a default `adminuser` (pass: `adminpass`) and `testuser` (pass: `userpass`) will be created.

**3. Frontend Setup:**
- Navigate to the `frontend` directory: `cd ../frontend`
- Install NPM packages:
  ```sh
  npm install
  ```
- Start the development server:
  ```sh
  npm run dev
  ```
- Open [http://localhost:5173](http://localhost:5173) in your browser to see your app. The live version is available at [risencore.vercel.app](https://risencore.vercel.app).

---

### 📄 License

This project is licensed under the **Apache License 2.0**. See the `LICENSE` file for details.

Copyright 2025, Ersin Elmas.
