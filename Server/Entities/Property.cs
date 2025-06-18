namespace API.Entities
{
    public class Property
    {
        public int Id { get; set; }
        public int OfficeId { get; set; }
        public string Name { get; set; }
        public decimal Area { get; set; }
        public decimal Price { get; set; }
    }
}
