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

        public async Task<List<Reservation>> GetReservations()
        {
            var reservations = new List<Reservation>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("SELECT * FROM Reservations", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var reservation = new Reservation();

                    reservation.Id = reader.GetInt32(reader.GetOrdinal("reservation_id"));
                    reservation.PropertyId = reader.GetInt32(reader.GetOrdinal("property_id"));
                    reservation.CustomerId = reader.GetInt32(reader.GetOrdinal("customer_id"));
                    reservation.StartDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("reservation_start")));
                    reservation.EndDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("reservation_end")));
                    reservation.Invoiced = reader.GetBoolean(reader.GetOrdinal("invoiced"));

                    reservations.Add(reservation);
                }

                foreach (var reservation in reservations)
                {
                    reservation.Devices = await GetReservationDevicesByReservationId(reservation.Id);
                    reservation.Services = await GetReservationServicesByReservationId(reservation.Id);
                }

                return reservations;
            }
            catch
            {
                throw;
            }
        }

        private async Task<List<Device>> GetReservationDevicesByReservationId(int id)
        {
            var devices = new List<Device>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("SELECT d.device_id, d.device_name, rd.device_price, " +
                    "rd.device_vat, rd.device_qty, rd.device_discount " +
                    "FROM Reservation_devices rd " +
                    "JOIN Office_devices d ON rd.device_id = d.device_id " +
                    "WHERE rd.reservation_id = @id", conn);

                cmd.Parameters.AddWithValue("@id", id);

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

        private async Task<List<Service>> GetReservationServicesByReservationId(int id)
        {
            var services = new List<Service>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("SELECT s.service_id, s.service_name, s.service_unit, " +
                    "rs.service_price, rs.service_vat, rs.service_qty, rs.service_discount " +
                    "FROM Reservation_services rs " +
                    "JOIN Office_services s ON rs.service_id = s.service_id " +
                    "WHERE rs.reservation_id = @id", conn);
                cmd.Parameters.AddWithValue("@id", id);

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

        public async Task<List<DateOnly>> GetReservedDates(int propertyId)
        {
            var dates = new List<DateOnly>();
            var today = DateOnly.FromDateTime(DateTime.Today);

            var conn = _dbManager.GetConnection();
            await conn.OpenAsync();

            var cmd = new SqlCommand("SELECT reservation_start, reservation_end FROM Reservations " +
                "WHERE property_id = @pId", conn);

            cmd.Parameters.AddWithValue("@pId", propertyId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var start = DateOnly.FromDateTime(reader.GetDateTime(0));
                var end = DateOnly.FromDateTime(reader.GetDateTime(1));

                for (var date = start; date <= end; date = date.AddDays(1))
                {
                    if (date >= today) dates.Add(date);
                }
            }

            return dates;
        }
    }
}
