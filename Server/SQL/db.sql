CREATE DATABASE VuokraToimistot;
Use VuokraToimistot;

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
WHERE TABLE_NAME = 'Vat'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Vat (
        vat_id INT IDENTITY PRIMARY KEY,
        vat_value DECIMAL(4, 2) NOT NULL,
        vat_description VARCHAR(255) NOT NULL,
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
        property_price DECIMAL(10, 2) NOT NULL,
        property_vat INT NOT NULL,
        CONSTRAINT FK_Office_properties_Offices_Office_id FOREIGN KEY (office_id) REFERENCES Offices (office_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
        CONSTRAINT FK_Office_properties_VAT_vat_id FOREIGN KEY (property_vat) REFERENCES VAT (vat_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Office_services'
AND TABLE_SCHEMA = 'dbo'
) 
BEGIN
    CREATE TABLE Office_services (
        service_id INT IDENTITY PRIMARY KEY,
        office_id INT NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        service_unit VARCHAR(255) NOT NULL,
        service_price DECIMAL(10, 2) NOT NULL,
        service_vat INT NOT NULL,
        CONSTRAINT FK_Office_services_Offices_office_id FOREIGN KEY (office_id) REFERENCES Offices (office_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
        CONSTRAINT FK_Office_services_VAT_vat_id FOREIGN KEY (service_vat) REFERENCES VAT (vat_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
    );
END;

IF NOT EXISTS (
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Office_devices'
AND TABLE_SCHEMA = 'dbo'
)
BEGIN
    CREATE TABLE Office_devices (
        device_id INT IDENTITY PRIMARY KEY,
        office_id INT NOT NULL,
        device_name VARCHAR(255) NOT NULL,
        device_price DECIMAL(10, 2) NOT NULL,
        device_vat INT NOT NULL,
        CONSTRAINT Office_devices_Offices_office_id FOREIGN KEY (office_id) REFERENCES Offices (office_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
        CONSTRAINT Office_devices_VAT_vat_id FOREIGN KEY (device_vat) REFERENCES VAT (vat_id)
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
        reservation_description VARCHAR(255),
        invoiced BIT DEFAULT(0),
        CONSTRAINT Reservations_Office_properties_property_id FOREIGN KEY (property_id) REFERENCES Office_properties (property_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
        CONSTRAINT Reservations_Customers_customer_id FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
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
        reservation_id INT NOT NULL,
        customer_id INT NOT NULL,
        invoice_date DATE NOT NULL,
        invoice_due_date DATE NOT NULL,
        invoice_subtotal DECIMAL(10, 2) NOT NULL,
        invoice_discounts DECIMAL(10, 2) NOT NULL,
        invoice_vattotal DECIMAL(10, 2) NOT NULL,
        invoice_totalsum DECIMAL(10, 2) NOT NULL,
        invoice_paid BIT DEFAULT 0 NOT NULL,
        CONSTRAINT Invoices_Customers_customer_id FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
        CONSTRAINT Invoices_Reservations_reservation_id FOREIGN KEY (reservation_id) REFERENCES Reservations (reservation_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
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
        device_vat DECIMAL(4, 2) NOT NULL,
        device_qty INT NOT NULL,
        device_discount DECIMAL(10, 2) NOT NULL,
        CONSTRAINT Reservation_devices_Reservations_reservation_id FOREIGN KEY (reservation_id) REFERENCES Reservations (reservation_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
        CONSTRAINT Reservation_devices_Office_devices_device_id FOREIGN KEY (device_id) REFERENCES Office_devices (device_id)
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
        service_vat DECIMAL(4, 2) NOT NULL,
        service_qty INT NOT NULL,
        service_discount DECIMAL(10, 2) NOT NULL,
        CONSTRAINT Reservation_services_Reservations_reservation_id FOREIGN KEY (reservation_id) REFERENCES Reservations (reservation_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
        CONSTRAINT Reservation_services_Office_services_service_id FOREIGN KEY (service_id) REFERENCES Office_services (service_id)
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


CREATE INDEX IX_Office_Devices_officeId ON Office_devices(office_id);
CREATE INDEX IX_Office_Devices_deviceVat ON Office_devices(device_vat);
CREATE INDEX IX_Office_Properties_officeId ON Office_properties(office_id);
CREATE INDEX IX_Office_Properties_propertyVat ON Office_properties(property_vat);
CREATE INDEX IX_Office_Services_officeId ON Office_services(office_id);
CREATE INDEX IX_Office_Services_serviceVat ON Office_services(service_vat);
CREATE INDEX IX_Reservation_devices_reservationId ON Reservation_devices(reservation_id);
CREATE INDEX IX_Reservation_devices_deviceId ON Reservation_devices(device_id);
CREATE INDEX IX_Reservation_services_reservationId ON Reservation_services(reservation_id);
CREATE INDEX IX_Reservation_services_serviceId ON Reservation_services(service_id);
CREATE INDEX IX_Reservations_propertyId ON Reservations(property_id);
CREATE INDEX IX_Reservations_customerId ON Reservations(customer_id);
CREATE INDEX IX_Reservations_startDate ON Reservations(reservation_start);
CREATE INDEX IX_Reservations_endDate ON Reservations(reservation_end);