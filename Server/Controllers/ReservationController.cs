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
        private readonly ReservationUpdate _reservationUpdate;

        public ReservationController(ReservationAdd ra, ReservationRepository rr, ReservationUpdate ru)
        {
            _reservationAdd = ra;
            _reservationRepository = rr;
            _reservationUpdate = ru;
        }

        [HttpGet]
        public async Task<ActionResult> GetReservations()
        {
            try
            {
                var reservations = await _reservationRepository.GetReservations();

                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
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

        [HttpPut]
        public async Task<ActionResult> UpdateReservation([FromBody] Reservation reservation)
        {
            try
            {
                var success = await _reservationUpdate.UpdateReservation(reservation);

                if (success)
                {
                    var updatedReservation = await _reservationRepository.GetReservationById(reservation.Id);
                    return Ok(updatedReservation);
                }
            }
            catch
            {
                // logger
            }
            return BadRequest();
        }
    }
}
