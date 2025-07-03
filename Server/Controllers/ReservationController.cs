using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    public class ReservationController : Controller
    {
        private readonly ReservationAdd _reservationAdd;
        private readonly ReservationRepository _reservationRepository;

        public ReservationController(ReservationAdd ra, ReservationRepository rr)
        {
            _reservationAdd = ra;
            _reservationRepository = rr;
        }

        [HttpGet]
        [Route("reserved-dates/{propertyId}")]
        public async Task<ActionResult> GetReservedDates(int propertyId)
        {
            try
            {
                var dates = await _reservationRepository.GetReservedDates(propertyId);
                return Ok(dates);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateReservation([FromBody] Reservation reservation)
        {
            try
            {
                var reservationID = await _reservationAdd.AddReservation(reservation);

                reservation.Id = reservationID.Value;

                return Ok(reservation);
            }
            catch 
            {
                return BadRequest();
            }
        }
    }
}
