
-- CREATE TABLES

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Offices'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Offices (
        office_id INT IDENTITY PRIMARY KEY,
        office_name VARCHAR(255) NOT NULL,
        office_address VARCHAR(255) NOT NULL,
        office_postalcode VARCHAR(255) NOT NULL,
        office_city VARCHAR(255) NOT NULL,
        office_country VARCHAR(255) NOT NULL,
        office_phone VARCHAR(255) NOT NULL,
        office_email VARCHAR(255) NOT NULL
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Customers'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Customers (
        customer_id INT IDENTITY PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(255) NOT NULL,
        customer_address VARCHAR(255) NOT NULL,
        customer_postalcode VARCHAR(255) NOT NULL,
        customer_city VARCHAR(255) NOT NULL,
        customer_country VARCHAR(255) NOT NULL
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Invoices'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Invoices (
        invoice_id INT IDENTITY PRIMARY KEY,
        customer_id INT NOT NULL,
        invoice_date DATE NOT NULL,
        invoice_due_date DATE NOT NULL,
        invoice_subtotal DECIMAL(10, 2) NOT NULL,
        invoice_discounts DECIMAL(10, 2) NOT NULL,
        invoice_vattotal DECIMAL(10, 2) NOT NULL,
        invoice_totalsum DECIMAL(10, 2) NOT NULL,
        invoice_description VARCHAR(255) NOT NULL,
        invoice_paid BIT DEFAULT 0 NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Office_properties'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Office_properties (
        property_id INT IDENTITY PRIMARY KEY,
        office_id INT NOT NULL,
        property_name VARCHAR(255) NOT NULL,
        property_area DECIMAL(10, 2) NOT NULL,
        property_price DECIMAL(10, 2) NOT NULL
        FOREIGN KEY (office_id) REFERENCES Offices (office_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Property_services'
AND TABLE_SCHEMA = 'dbo'
) 
BEGIN
    CREATE TABLE Property_services (
        service_id INT IDENTITY PRIMARY KEY,
        property_id INT NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        service_unit VARCHAR(255) NOT NULL,
        service_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (property_id) REFERENCES Office_properties (property_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Property_devices'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Property_devices (
        device_id INT IDENTITY PRIMARY KEY,
        property_id INT NOT NULL,
        device_name VARCHAR(255) NOT NULL,
        device_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (property_id) REFERENCES Office_properties (property_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Reservations'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Reservations (
        reservation_id INT IDENTITY PRIMARY KEY,
        property_id INT NOT NULL,
        customer_id INT NOT NULL,
        reservation_start DATE NOT NULL,
        reservation_end DATE NOT NULL,
        FOREIGN KEY (property_id) REFERENCES Office_properties (property_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Invoice_reservations'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Invoice_reservations (
        invoice_reservation_id INT IDENTITY PRIMARY KEY,
        invoice_id INT NOT NULL,
        reservation_id INT NOT NULL,
        FOREIGN KEY (invoice_id) REFERENCES Invoices (invoice_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
        FOREIGN KEY (reservation_id) REFERENCES Reservations (reservation_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Reservation_devices'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Reservation_devices (
        reservation_device_id INT IDENTITY PRIMARY KEY,
        reservation_id INT NOT NULL,
        device_id INT NOT NULL,
        device_price DECIMAL(10, 2) NOT NULL,
        device_vat DECIMAL(10, 2) NOT NULL,
        device_qty INT NOT NULL,
        device_discount DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (reservation_id) REFERENCES Reservations (reservation_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
        FOREIGN KEY (device_id) REFERENCES Property_devices (device_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Reservation_services'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Reservation_services (
        reservation_service_id INT IDENTITY PRIMARY KEY,
        reservation_id INT NOT NULL,
        service_id INT NOT NULL,
        service_price DECIMAL(10, 2) NOT NULL,
        service_vat DECIMAL(10, 2) NOT NULL,
        service_qty INT NOT NULL,
        service_discount DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (reservation_id) REFERENCES Reservations (reservation_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
        FOREIGN KEY (service_id) REFERENCES Property_services (service_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Users'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Users (
        userID VARCHAR(255) PRIMARY KEY,
        userPassword VARCHAR(255) NOT NULL,
    );
END;


-- MOCK DATA:

INSERT INTO Customers (customer_name, customer_email, customer_phone, customer_address, customer_postalcode, customer_city, customer_country) 
VALUES ('Testaaja 1', 'testi@test.com', '0401234567', 'Testikatu 10', '02340', 'Lahti', 'FIN');