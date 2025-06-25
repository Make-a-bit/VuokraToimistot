namespace API.Entities
{
    public class Service
    {
        public int Id { get; set; }
        public int OfficeId { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }
    }
}
