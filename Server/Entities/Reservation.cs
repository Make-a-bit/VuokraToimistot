namespace API.Entities
{
    public class Reservation
    {
        public int Id { get; set; }
        public Office Office { get; set; }
        public Property Property { get; set; }
        public Customer Customer { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public List<Device> Devices { get; set; }
        public List<Service> Services { get; set; }
        public bool Invoiced { get; set; }
        public DateOnly DueDate { get; set; }
        public DateOnly DateInvoiced { get; set; }
        public string Description { get; set; }

        public Reservation()
        {
            Office = new Office();
            Property = new Property();
            Customer = new Customer();
            Devices = new List<Device>();
            Services = new List<Service>();
        }
    }
}
