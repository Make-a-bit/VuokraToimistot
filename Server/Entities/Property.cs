namespace API.Entities
{
    public class Property
    {
        public int Id { get; set; }
        public int OfficeId { get; set; }
        public string OfficeName { get; set; }
        public string Name { get; set; }
        public decimal Area { get; set; }
        public decimal Price { get; set; }
        public decimal VAT { get; set; }
        public int VatId { get; set; }
    }
}
