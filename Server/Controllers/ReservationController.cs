using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    public class ReservationController : Controller
    {
        private readonly ReservationAdd _reservationAdd;

        public ReservationController(ReservationAdd ra)
        {
            _reservationAdd = ra;
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
