namespace API.Entities
{
    public class Invoice
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        public int CustomerId { get; set; }
        public DateOnly InvoiceDate { get; set; }
        public DateOnly DueDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Discounts { get; set; }
        public decimal VatTotal { get; set; }
        public decimal TotalSum { get; set; }
        public string Description { get; set; }
        public bool Paid { get; set; }
    }
}
