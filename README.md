# La Maison — Restaurant Reservation System

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/8e8a82e9-9591-4e5a-b5f9-ec3cf7484264" />




Full-stack app: **Spring Boot (JWT)** backend + **React (Vite)** frontend.


<img width="1920" height="1200" alt="Screenshot (527)" src="https://github.com/user-attachments/assets/d01d91f3-d460-4cd0-b654-0cca0270608b" />


---

## Project Structure

```
lamaison/
├── backend/          ← Spring Boot + JWT + H2 (Maven)
└── frontend/         ← React + Vite
```

---

## Running in IntelliJ IDEA

### Prerequisites
- Java 17+ (File → Project Structure → SDKs)
- Node.js 18+ (for frontend)
- IntelliJ IDEA (Ultimate or Community)

---

### Step 1 — Open the Project

1. Open IntelliJ IDEA
2. **File → Open** → select the `lamaison/` folder
3. IntelliJ will detect two modules: a Maven project (`backend/`) and optionally the frontend

---

### Step 2 — Run the Backend

1. In the **Project** panel, expand `backend/`
2. Right-click `pom.xml` → **Add as Maven Project** (if not already)
3. Wait for Maven to download dependencies (progress bar bottom-right)
4. Navigate to: `src/main/java/com/lamaison/LaMaisonApplication.java`
5. Click the **▶ green Run** button next to the `main` method
   - Or use the top toolbar Run config → select `LaMaisonApplication`
6. Backend starts on **http://localhost:8080**
7. H2 Console available at: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:lamaison` | User: `sa` | Password: *(empty)*

---

### Step 3 — Run the Frontend

**Option A — IntelliJ Terminal (recommended)**

1. Open **Terminal** tab (bottom of IntelliJ)
2. `cd frontend`
3. `npm install`
4. `npm run dev`
5. Frontend runs at **http://localhost:5173**

**Option B — npm run config in IntelliJ**

1. **Run → Edit Configurations → + → npm**
2. Set:
   - Package.json: `frontend/package.json`
   - Command: `run`
   - Scripts: `dev`
3. Click **OK** then **▶ Run**

---

### Step 4 — Open the App

Go to **http://localhost:5173** in your browser.

#### Demo Credentials
| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@bistro.com   | admin123  |
| Customer | john@email.com  | john123   |

---

## API Endpoints

| Method | Endpoint                        | Auth     | Description            |
|--------|---------------------------------|----------|------------------------|
| POST   | /api/auth/login                 | Public   | Login → returns JWT    |
| POST   | /api/auth/register              | Public   | Register new user      |
| GET    | /api/tables                     | Any user | List all tables        |
| GET    | /api/reservations               | Admin    | All reservations       |
| GET    | /api/reservations/my            | Customer | Own reservations       |
| POST   | /api/reservations               | Any user | Create reservation     |
| PATCH  | /api/reservations/{id}/status   | Any user | Update status          |

---

## JWT Flow

1. User logs in → backend returns `{ token, user }`
2. Token stored in `localStorage`
3. All subsequent requests send `Authorization: Bearer <token>`
4. Spring Security validates token on every request

---

## Switching to MySQL (Production)

Replace in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lamaison
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

And add to `pom.xml`:
```xml
<dependency>
  <groupId>com.mysql</groupId>
  <artifactId>mysql-connector-j</artifactId>
  <scope>runtime</scope>
</dependency>
```
