namespace API.Entities
{
    public class Device
    {
        public int Id { get; set; }
        public int OfficeId { get; set; }
        public string OfficeName { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal Vat { get; set; }
        public int VatId { get; set; }
        public int Qty { get; set; }
        public decimal Discount { get; set; }
    }
}
