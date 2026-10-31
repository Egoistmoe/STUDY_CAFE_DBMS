CREATE DATABASE IF NOT EXISTS study_cafe;
USE study_cafe;

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE branches (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    branch_id INT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

CREATE TABLE study_areas (
    study_area_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    area_name VARCHAR(100) NOT NULL,
    area_type VARCHAR(50) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    max_hours INT NOT NULL DEFAULT 8,
    description VARCHAR(255),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

CREATE TABLE seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    study_area_id INT NOT NULL,
    seat_label VARCHAR(50) NOT NULL,
    status ENUM('Available','Occupied','Maintenance')
        NOT NULL DEFAULT 'Available',
    UNIQUE (study_area_id, seat_label),
    FOREIGN KEY (study_area_id) REFERENCES study_areas(study_area_id)
);

CREATE TABLE menu_items (
    menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 5,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

CREATE TABLE membership_tiers (
    tier_id INT AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL UNIQUE,
    minimum_hours INT NOT NULL DEFAULT 0,
    discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0
);

CREATE TABLE members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    tier_id INT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    total_completed_hours DECIMAL(8,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tier_id) REFERENCES membership_tiers(tier_id)
);

CREATE TABLE area_thresholds (
    threshold_id INT AUTO_INCREMENT PRIMARY KEY,
    study_area_id INT NOT NULL,
    metric_name VARCHAR(50) NOT NULL,
    minimum_value DECIMAL(10,2) NULL,
    maximum_value DECIMAL(10,2) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (study_area_id) REFERENCES study_areas(study_area_id),
    UNIQUE (study_area_id, metric_name)
);

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    seat_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('Confirmed','Checked-In','Completed','Cancelled','No-Show')
        NOT NULL DEFAULT 'Confirmed',
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending','Preparing','Completed','Cancelled')
        NOT NULL DEFAULT 'Pending',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id)
);

CREATE TABLE environment_readings (
    reading_id INT AUTO_INCREMENT PRIMARY KEY,
    study_area_id INT NOT NULL,
    metric_name VARCHAR(50) NOT NULL,
    reading_value DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_area_id) REFERENCES study_areas(study_area_id)
);

CREATE TABLE alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    study_area_id INT NOT NULL,
    threshold_id INT NULL,
    severity ENUM('Low','Medium','High') NOT NULL DEFAULT 'Low',
    message VARCHAR(255) NOT NULL,
    status ENUM('Open','Acknowledged','Resolved') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_area_id) REFERENCES study_areas(study_area_id),
    FOREIGN KEY (threshold_id) REFERENCES area_thresholds(threshold_id)
);

CREATE TABLE housekeeping_tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    study_area_id INT NOT NULL,
    alert_id INT NULL,
    assigned_to INT NULL,
    task_description VARCHAR(255) NOT NULL,
    source ENUM('Auto','Manual') NOT NULL DEFAULT 'Manual',
    status ENUM('Pending','Completed','Overdue','Skipped')
        NOT NULL DEFAULT 'Pending',
    due_at DATETIME NULL,
    skip_reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_area_id) REFERENCES study_areas(study_area_id),
    FOREIGN KEY (alert_id) REFERENCES alerts(alert_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

CREATE TABLE audit_logs (
    audit_log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE feedback_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    member_id INT NOT NULL,
    study_area_id INT NOT NULL,
    rating TINYINT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (study_area_id) REFERENCES study_areas(study_area_id),
    CHECK (rating BETWEEN 1 AND 5)
);

CREATE VIEW v_reading_days AS
SELECT
    study_area_id,
    DATE(recorded_at) AS reading_date,
    COUNT(*) AS reading_count
FROM environment_readings
GROUP BY study_area_id, DATE(recorded_at);