namespace API.Entities
{
    public class Reservation
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public int CustomerId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public List<Device> Devices { get; set; }
        public List<Service> Services { get; set; }
    }
}
