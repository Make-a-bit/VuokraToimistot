using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class PropertyRepository
    {
        private readonly DBManager _dbManager;

        public PropertyRepository(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Asynchronously retrieves a list of all properties from the database.
        /// </summary>
        /// <remarks>This method connects to the database and executes a query to fetch property details,
        /// including property ID, office ID, property name, area, price, VAT value, and office name.</remarks>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Property"/>
        /// objects, each representing a property with its associated details.</returns>
        public async Task<List<Property>> GetAllPropertiesAsync()
        {
            var properties = new List<Property>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    p.property_id,
                    p.office_id,
                    p.property_name, 
                    p.property_area,
                    p.property_price,
                    v.vat_id,
                    v.vat_value,
                    o.office_name
                FROM Office_properties p
                JOIN VAT v ON p.property_vat = v.vat_id
                JOIN Offices o ON p.office_id = o.office_id", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var property = new Property
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("property_id")),
                        OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                        OfficeName = reader.GetString(reader.GetOrdinal("office_name")),
                        Name = reader.GetString(reader.GetOrdinal("property_name")),
                        Area = reader.GetDecimal(reader.GetOrdinal("property_area")),
                        Price = reader.GetDecimal(reader.GetOrdinal("property_price")),
                        VAT = reader.GetDecimal(reader.GetOrdinal("vat_value")),
                        VatId = reader.GetInt32(reader.GetOrdinal("vat_id"))
                    };
                    properties.Add(property);
                }
                return properties;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously retrieves a list of properties associated with a specified office.
        /// </summary>
        /// <param name="officeId">The unique identifier of the office for which to retrieve properties. Must be a valid office ID.</param>
        /// <returns>A task representing the asynchronous operation. The task result contains a list of <see cref="Property"/>
        /// objects associated with the specified office. The list will be empty if no properties are found.</returns>
        public async Task<List<Property>> GetAllPropertiesAsync(int officeId)
        {
            var properties = new List<Property>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    p.property_id,
                    p.office_id,
                    p.property_name, 
                    p.property_area,
                    p.property_price,
                    v.vat_id,
                    v.vat_value,
                    o.office_name
                FROM Office_properties p
                JOIN VAT v ON p.property_vat = v.vat_id 
                JOIN Offices o ON p.office_id = o.office_id
                WHERE p.office_id = @officeId", conn);

                cmd.Parameters.AddWithValue("@officeId", officeId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var property = new Property
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("property_id")),
                        OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                        OfficeName = reader.GetString(reader.GetOrdinal("office_name")),
                        Name = reader.GetString(reader.GetOrdinal("property_name")),
                        Area = reader.GetDecimal(reader.GetOrdinal("property_area")),
                        Price = reader.GetDecimal(reader.GetOrdinal("property_price")),
                        VAT = reader.GetDecimal(reader.GetOrdinal("vat_value")),
                        VatId = reader.GetInt32(reader.GetOrdinal("vat_id"))
                    };

                    properties.Add(property);
                }
                return properties;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously retrieves a property by its identifier from the database.
        /// </summary>
        /// <remarks>This method establishes a connection to the database, executes a query to find the
        /// property with the specified identifier, and populates a <see cref="Property"/> object with the retrieved
        /// data.</remarks>
        /// <param name="propertyId">The unique identifier of the property to retrieve. Must be a positive integer.</param>
        /// <returns>A task representing the asynchronous operation. The task result contains the <see cref="Property"/> object
        /// with the specified identifier, or a default <see cref="Property"/> object if not found.</returns>
        public async Task<Property> GetPropertyAsync(int propertyId)
        {
            var property = new Property();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT * FROM Office_Properties 
                WHERE property_id = @property", conn);

                cmd.Parameters.AddWithValue("@property", propertyId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    property.Id = reader.GetInt32(reader.GetOrdinal("property_id"));
                    property.OfficeId = reader.GetInt32(reader.GetOrdinal("office_id"));
                    property.Name = reader.GetString(reader.GetOrdinal("property_name"));
                    property.Area = reader.GetDecimal(reader.GetOrdinal("property_area"));
                    property.Price = reader.GetDecimal(reader.GetOrdinal("property_price"));
                    property.VatId = reader.GetInt32(reader.GetOrdinal("property_vat"));
                }

                return property;
            }
            catch
            {
                throw;
            }
        }
    }
}
