namespace API.Entities
{
    public class Device
    {
        public int Id { get; set; }
        public int OfficeId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal Vat { get; set; }
        public decimal Qty { get; set; }
        public decimal Discount { get; set; }
    }
}
