# Study Cafe Reservation and Management System

## 1. Project Overview

The Study Cafe Reservation and Management System is a database-driven application designed to manage study area reservations, seat availability, customer orders, memberships, and daily cafe operations.

## 2. Project Objectives

- Organize study cafe reservations and customer information.
- Manage study areas, seats, orders, and memberships.
- Monitor environmental conditions.
- Automate alerts and housekeeping tasks.
- Maintain accurate records and generate reports.

## 3. System Features

- User and Member Management
- Study Area and Seat Management
- Booking and Check-in/Check-out
- Order Management
- Membership Management
- Environmental Monitoring
- Automatic Alerts and Housekeeping Tasks
- Audit Logs
- Reports and Dashboard

## 4. Study Cafe DBMS – Team Task Assignment

| Member | GitHub Username | Assigned Tables | Endpoints / Screens | Join Report | Responsibility / Feature Role |
|---|---|---|---|---|---|
| A – Guinanas | `gellahh` | `roles`, `branches`, `users` | Login, Users CRUD, Roles and Branches Lists | Users with role and branch (INNER JOIN) | Core: Login, Roles, Shared Layout, DB Connection |
| B – Algie | `doriasalgie6-sys` | `study_areas`, `seats`, `menu_items` | Seats CRUD, Study Areas, Menu Items | Seats with no active booking (LEFT JOIN) | Master Data |
| C – Diaz | `diazjeffnyl-bot` | `bookings`, `orders`, `order_items` | Bookings CRUD, Check-in, Check-out, Order Entry | Bookings with seat, area, and order totals (INNER JOIN) | Transactions |
| D – Maldan | `TanduayRam` | `membership_tiers`, `area_thresholds`, `housekeeping_tasks` | Housekeeping Tasks CRUD, Membership Tiers, Area Thresholds | Current tier per member (INNER JOIN) | Unique Feature: No-show Release, Pricing, Tier Upgrade |
| E – Macias | `lowiij` | `environment_readings`, `alerts`, `audit_logs` | Alerts CRUD, Readings Entry, Audit Log View | Areas vs. Reading Coverage Gaps (FULL OUTER JOIN via UNION of LEFT and RIGHT JOIN) | Unique Workflow: Threshold Alerts, Automatic Tasks, Audit Logging |
| F – Javier | `Egoistmoe` | `members`, `feedback_reviews` | Feedback Reviews CRUD, Members List and Entry, Dashboard | Review Count per Study Area (RIGHT JOIN) | Reports, Dashboard, ER Diagram |

## 5. Database Overview

**Database Name:** `study_cafe`

**Total Tables:** 17

1. `roles`
2. `branches`
3. `users`
4. `study_areas`
5. `seats`
6. `menu_items`
7. `membership_tiers`
8. `members`
9. `area_thresholds`
10. `bookings`
11. `orders`
12. `order_items`
13. `environment_readings`
14. `alerts`
15. `housekeeping_tasks`
16. `audit_logs`
17. `feedback_reviews`

**Database View:** `v_reading_days`

## 6. Technologies Used

- MySQL
- Node.js
- Express.js
- JavaScript
- HTML and CSS
- Git and GitHub
- Visual Studio Code
- MySQL Workbench

## 7. System Workflow

The frontend sends requests to the Express.js backend. Controllers process the requests, models execute SQL queries, and MySQL stores and retrieves the information. The results are then displayed on the user interface.

## 8. Expected Outcome

A functional and organized Study Cafe Management System that improves reservation handling, database management, environmental monitoring, and daily cafe operations.