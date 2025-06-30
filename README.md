# ABC Ignite Gym API

A lightweight Node.js + Express API to manage fitness classes and bookings for gyms and studios.

---

## 📁 Project Setup

### ✅ Requirements
- Node.js v14 or higher
- npm (Node Package Manager)

### ▶️ Installation & Running Locally

1. Extract the zip file.
2. Open the terminal and navigate to the project directory.
3. Run the following commands:

```bash
npm install
node server.js

# API Endpoints
    curl --location 'http://localhost:3000/api/classes' \
    --header 'Content-Type: application/json' \
    --data '{
    "name": "Yoga",
    "startDate": "2025-07-01",
    "endDate": "2025-07-05",
    "startTime": "10:00",
    "duration": 60,
    "capacity": 10
    }
    '


    curl --location 'http://localhost:3000/api/bookings' \
--header 'Content-Type: application/json' \
--data '{
  "memberName": "John",
  "className": "Yoga",
  "participationDate": "2025-07-02"
}
'

    curl --location 'http://localhost:3000/api/bookings?member=John&startDate=2025-07-01&endDate=2025-07-10%0A'