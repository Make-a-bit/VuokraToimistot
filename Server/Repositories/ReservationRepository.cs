using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

namespace API.Repositories
{
    public class ReservationRepository
    {
        private readonly DBManager _dbManager;

        public ReservationRepository(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Asynchronously retrieves a reservation by its unique identifier.
        /// </summary>
        /// <remarks>This method retrieves detailed information about a reservation, including its
        /// associated customer, property, and office. It also populates the reservation with related devices and
        /// services.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation to retrieve. Must be a positive integer.</param>
        /// <returns>A <see cref="Reservation"/> object containing the details of the reservation, including associated customer,
        /// property, and office information. Returns <see langword="null"/> if no reservation is found with the
        /// specified identifier.</returns>
        public async Task<Reservation> GetReservationAsync(int reservationId)
        {
            var reservation = new Reservation();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    r.reservation_id,
                    r.property_id,
                    r.customer_id,
                    r.reservation_start,
                    r.reservation_end,
                    r.invoiced,
                    c.customer_name,
                    p.property_name,
                    o.office_name
                FROM Reservations r
                JOIN Customers c ON r.customer_id = c.customer_id
                JOIN Office_properties p ON r.property_id = p.property_id
                JOIN Offices o ON p.office_id = o.office_id
                WHERE reservation_id = @reservationId", conn);

                cmd.Parameters.AddWithValue("@reservationId", reservationId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    reservation.Id = reader.GetInt32(reader.GetOrdinal("reservation_id"));
                    reservation.Office.Name = reader.GetString(reader.GetOrdinal("office_name"));
                    reservation.Property.Id = reader.GetInt32(reader.GetOrdinal("property_id"));
                    reservation.Property.Name = reader.GetString(reader.GetOrdinal("property_name"));
                    reservation.Customer.Id = reader.GetInt32(reader.GetOrdinal("customer_id"));
                    reservation.Customer.Name = reader.GetString(reader.GetOrdinal("customer_name"));
                    reservation.StartDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("reservation_start")));
                    reservation.EndDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("reservation_end")));
                    reservation.Invoiced = reader.GetBoolean(reader.GetOrdinal("invoiced"));
                }

                reservation.Devices = await GetReservationDevicesAsync(reservation.Id);
                reservation.Services = await GetReservationServicesAsync(reservation.Id);

                return reservation;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously retrieves all reservations from the database.
        /// </summary>
        /// <remarks>This method fetches reservation details including associated customer, property, and
        /// office information. It also populates each reservation with related devices and services.</remarks>
        /// <returns>A task representing the asynchronous operation. The task result contains a list of <see cref="Reservation"/>
        /// objects, each representing a reservation with its associated details.</returns>
        public async Task<List<Reservation>> GetAllReservationsAsync()
        {
            var reservations = new List<Reservation>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                var query = @"
                SELECT 
                    r.reservation_id,
                    r.property_id,
                    r.customer_id,
                    r.reservation_start,
                    r.reservation_end,
                    r.invoiced,
                    r.reservation_description,
                    c.customer_name,
                    p.property_name,
                    o.office_name
                FROM Reservations r
                JOIN Customers c ON r.customer_id = c.customer_id
                JOIN Office_properties p ON r.property_id = p.property_id
                JOIN Offices o ON p.office_id = o.office_id";

                using var cmd = new SqlCommand(query, conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var reservation = new Reservation();

                    reservation.Id = reader.GetInt32(reader.GetOrdinal("reservation_id"));
                    reservation.Office.Name = reader.GetString(reader.GetOrdinal("office_name"));
                    reservation.Property.Id = reader.GetInt32(reader.GetOrdinal("property_id"));
                    reservation.Property.Name = reader.GetString(reader.GetOrdinal("property_name"));
                    reservation.Customer.Id = reader.GetInt32(reader.GetOrdinal("customer_id"));
                    reservation.Customer.Name = reader.GetString(reader.GetOrdinal("customer_name"));
                    reservation.StartDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("reservation_start")));
                    reservation.EndDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("reservation_end")));
                    reservation.Invoiced = reader.GetBoolean(reader.GetOrdinal("invoiced"));
                    reservation.Description = reader.IsDBNull(reader.GetOrdinal("reservation_description"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("reservation_description"));

                    reservations.Add(reservation);
                }

                foreach (var reservation in reservations)
                {
                    reservation.Devices = await GetReservationDevicesAsync(reservation.Id);
                    reservation.Services = await GetReservationServicesAsync(reservation.Id);
                }

                return reservations;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously retrieves a list of devices associated with a specified reservation.
        /// </summary>
        /// <remarks>This method queries the database to obtain details about devices linked to a given
        /// reservation, including their ID, name, price, VAT, quantity, and discount.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation for which to retrieve devices.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Device"/>
        /// objects associated with the specified reservation.</returns>
        private async Task<List<Device>> GetReservationDevicesAsync(int reservationId)
        {
            var devices = new List<Device>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    d.device_id, 
                    d.device_name, 
                    rd.device_price, 
                    rd.device_vat, 
                    rd.device_qty, 
                    rd.device_discount
                FROM Reservation_devices rd
                JOIN Office_devices d ON rd.device_id = d.device_id
                WHERE rd.reservation_id = @reservationId", conn);

                cmd.Parameters.AddWithValue("@reservationId", reservationId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var device = new Device
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("device_id")),
                        Name = reader.GetString(reader.GetOrdinal("device_name")),
                        Price = reader.GetDecimal(reader.GetOrdinal("device_price")),
                        Vat = reader.GetDecimal(reader.GetOrdinal("device_vat")),
                        Qty = reader.GetInt32(reader.GetOrdinal("device_qty")),
                        Discount = reader.GetDecimal(reader.GetOrdinal("device_discount"))
                    };
                    devices.Add(device);
                }
                return devices;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously retrieves a list of services associated with a specified reservation.
        /// </summary>
        /// <param name="reservationId">The unique identifier of the reservation for which to retrieve services. Must be a valid reservation ID.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Service"/>
        /// objects associated with the specified reservation.</returns>
        private async Task<List<Service>> GetReservationServicesAsync(int reservationId)
        {
            var services = new List<Service>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    s.service_id, 
                    s.service_name, 
                    s.service_unit, 
                    rs.service_price, 
                    rs.service_vat, 
                    rs.service_qty, 
                    rs.service_discount 
                FROM Reservation_services rs 
                JOIN Office_services s ON rs.service_id = s.service_id 
                WHERE rs.reservation_id = @reservationId", conn);

                cmd.Parameters.AddWithValue("@reservationId", reservationId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var service = new Service
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("service_id")),
                        Name = reader.GetString(reader.GetOrdinal("service_name")),
                        Unit = reader.GetString(reader.GetOrdinal("service_unit")),
                        Price = reader.GetDecimal(reader.GetOrdinal("service_price")),
                        Vat = reader.GetDecimal(reader.GetOrdinal("service_vat")),
                        Qty = reader.GetInt32(reader.GetOrdinal("service_qty")),
                        Discount = reader.GetDecimal(reader.GetOrdinal("service_discount"))
                    };
                    services.Add(service);
                }
                return services;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously determines whether there are any devices associated with a specified reservation.
        /// </summary>
        /// <remarks>This method connects to the database to check for devices linked to the given
        /// reservation ID. Ensure that the database connection is properly configured before calling this
        /// method.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation to check for associated devices.</param>
        /// <returns><see langword="true"/> if there are one or more devices associated with the reservation;  otherwise, <see
        /// langword="false"/>.</returns>
        public async Task<bool> HasDevicesOnReservationAsync(int reservationId)
        {
            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT COUNT(*) 
                FROM Reservation_devices 
                WHERE reservation_id = @rid", conn);
                cmd.Parameters.AddWithValue("@rid", reservationId);

                int deviceCount = (int)await cmd.ExecuteScalarAsync();

                return deviceCount > 0;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously determines whether there are any services associated with a specified reservation.
        /// </summary>
        /// <remarks>This method connects to the database to check for services linked to the given
        /// reservation ID. Ensure that the database connection is properly configured before calling this
        /// method.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation to check for associated services.</param>
        /// <returns><see langword="true"/> if there are one or more services associated with the reservation; otherwise, <see
        /// langword="false"/>.</returns>
        public async Task<bool> HasServicesOnReservationAsync(int reservationId)
        {
            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT COUNT(*) 
                FROM Reservation_services 
                WHERE reservation_id = @rid", conn);
                cmd.Parameters.AddWithValue("@rid", reservationId);

                int serviceCount = (int)await cmd.ExecuteScalarAsync();

                return serviceCount > 0;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously retrieves a list of reserved dates for a specified property.
        /// </summary>
        /// <remarks>This method queries the database for reservations associated with the given property
        /// ID and returns all dates within each reservation period.</remarks>
        /// <param name="propertyId">The unique identifier of the property for which to retrieve reserved dates.</param>
        /// <returns>A task representing the asynchronous operation. The task result contains a list of <see cref="DateOnly"/>
        /// objects representing each reserved date for the specified property.</returns>
        public async Task<List<DateOnly>> GetReservedDatesAsync(int propertyId)
        {
            var dates = new List<DateOnly>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT reservation_start, reservation_end 
                FROM Reservations
                WHERE property_id = @pId", conn);

                cmd.Parameters.AddWithValue("@pId", propertyId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var start = DateOnly.FromDateTime(reader.GetDateTime(0));
                    var end = DateOnly.FromDateTime(reader.GetDateTime(1));

                    for (var date = start; date <= end; date = date.AddDays(1))
                    {
                        dates.Add(date);
                    }
                }
                return dates;
            }
            catch
            {
                throw;
            }
        }
    }
}
