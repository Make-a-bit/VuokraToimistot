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
        private readonly ReservationDelete _reservationDelete;
        private readonly ReservationRepository _reservationRepository;
        private readonly ReservationUpdate _reservationUpdate;

        public ReservationController(ReservationAdd ra, ReservationRepository rr, ReservationUpdate ru, ReservationDelete rd)
        {
            _reservationAdd = ra;
            _reservationDelete = rd;
            _reservationRepository = rr;
            _reservationUpdate = ru;
        }

        [HttpGet]
        public async Task<ActionResult> GetReservations()
        {
            try
            {
                var reservations = await _reservationRepository.GetReservations();

                if (reservations.Count > 0)
                    return Ok(reservations);
                else return NotFound();
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

                if (dates.Count > 0) 
                    return Ok(dates);
                else return NotFound();
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
        [Route("update")]
        public async Task<ActionResult> UpdateReservation([FromBody] Reservation reservation)
        {
            try
            {
                if (await _reservationUpdate.UpdateReservation(reservation))
                {
                    var updatedReservation = await _reservationRepository.GetReservationById(reservation.Id);
                    return Ok(updatedReservation);
                }
                else NotFound();
            }
            catch
            {
                // logger
            }
            return BadRequest();
        }

        [HttpDelete]
        [Route("delete/{reservationId}")]
        public async Task<ActionResult> DeleteReservation([FromRoute] int reservationId)
        {
            try
            {
                if (await _reservationDelete.DeleteReservationCascade(reservationId)) 
                    return Ok();
                else return NotFound();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
