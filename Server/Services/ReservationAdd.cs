using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class ReservationAdd
    {
        private readonly DBManager _dbManager;

        public ReservationAdd(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<int?> AddReservation(Reservation reservation)
        {
            int reservationID = 0;

            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();
                using var transaction = conn.BeginTransaction();

                using var cmd = new SqlCommand("INSERT INTO Reservations " +
                    "(property_id, customer_id, reservation_start, reservation_end) " +
                    "OUTPUT INSERTED.reservation_id " +
                    "VALUES (@pId, @cId, @start, @end)", conn, transaction);

                cmd.Parameters.AddWithValue("@pId", reservation.PropertyId);
                cmd.Parameters.AddWithValue("@cId", reservation.CustomerId);
                cmd.Parameters.AddWithValue("@start", reservation.StartDate);
                cmd.Parameters.AddWithValue("@end", reservation.EndDate);

                var result = await cmd.ExecuteScalarAsync();

                if (result == null || !int.TryParse(result.ToString(), out reservationID))
                {
                    await transaction.RollbackAsync();
                    return null;
                }

                foreach (var device in reservation.Devices)
                {
                    using var deviceCmd = new SqlCommand("INSERT INTO Reservation_devices " +
                        "(reservation_id, device_id, device_price, device_vat, device_qty, device_discount) " +
                        "VALUES (@rId, @dId, @price, @vat, @qty, @discount)", conn, transaction);

                    deviceCmd.Parameters.AddWithValue("@rId", reservationID);
                    deviceCmd.Parameters.AddWithValue("@dId", device.Id);
                    deviceCmd.Parameters.AddWithValue("@price", device.Price);
                    deviceCmd.Parameters.AddWithValue("@vat", device.Vat);
                    deviceCmd.Parameters.AddWithValue("@qty", device.Qty);
                    deviceCmd.Parameters.AddWithValue("@discount", device.Discount);

                    await deviceCmd.ExecuteNonQueryAsync();
                }

                foreach (var service in reservation.Services)
                {
                    using var serviceCmd = new SqlCommand("INSERT INTO Reservation_services " +
                        "(reservation_id, service_id, service_price, service_vat, service_qty, service_discount) " +
                        "VALUES (@rId, @sId, @price, @vat, @qty, @discount) ", conn, transaction);

                    serviceCmd.Parameters.AddWithValue("@rId", reservationID );
                    serviceCmd.Parameters.AddWithValue("@sId", service.Id);
                    serviceCmd.Parameters.AddWithValue("@price", service.Price);
                    serviceCmd.Parameters.AddWithValue("@vat", service.Vat);
                    serviceCmd.Parameters.AddWithValue("@qty", service.Qty);
                    serviceCmd.Parameters.AddWithValue("@discount", service.Discount);

                    await serviceCmd.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();
                return reservationID;
            }
            catch (SqlException error)
            {
                // Log error
            }
            return null;
        }
    }
}
