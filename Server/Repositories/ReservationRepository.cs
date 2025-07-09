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
        /// Get reservation by reservation id from the database
        /// </summary>
        /// <param name="reservationId"></param>
        /// <returns></returns>
        public async Task<Reservation> GetReservation(int reservationId)
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

                reservation.Devices = await GetReservationDevices(reservation.Id);
                reservation.Services = await GetReservationServices(reservation.Id);

                return reservation;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get all reservations from the database
        /// </summary>
        /// <returns></returns>
        public async Task<List<Reservation>> GetReservations()
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

                    reservations.Add(reservation);
                }

                foreach (var reservation in reservations)
                {
                    reservation.Devices = await GetReservationDevices(reservation.Id);
                    reservation.Services = await GetReservationServices(reservation.Id);
                }

                return reservations;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get reservation devices by reservation id from the database
        /// </summary>
        /// <param name="reservationId"></param>
        /// <returns></returns>
        private async Task<List<Device>> GetReservationDevices(int reservationId)
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
        /// Get reservation services by reservation id from the database
        /// </summary>
        /// <param name="reservationId"></param>
        /// <returns></returns>
        private async Task<List<Service>> GetReservationServices(int reservationId)
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
        /// Cehck if a reservation has devices
        /// </summary>
        /// <param name="reservationId"></param>
        /// <returns></returns>
        public async Task<bool> HasDevicesOnReservation(int reservationId)
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
        /// Check if a reservation has services
        /// </summary>
        /// <param name="reservationId"></param>
        /// <returns></returns>
        public async Task<bool> HasServicesOnReservation(int reservationId)
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
        /// Get reserved dates by property from the database
        /// </summary>
        /// <param name="propertyId"></param>
        /// <returns></returns>
        public async Task<List<DateOnly>> GetReservedDates(int propertyId)
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
