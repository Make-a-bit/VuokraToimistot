import dayjs from "../../src/dayjs-setup";

// Always normalize any date input to a Day.js object
const normalize = (d) => (d && typeof d.isValid === "function" ? d : dayjs(d));

export const getReservationDateUtils = (reservedDates, reservation, startDate) => {
    // Deduplicate reservedDates
    const uniqueReservedDates = Array.from(new Set(reservedDates));

    // Defensive: handle null/undefined reservation
    const reservationStart = reservation && reservation.startDate ? normalize(reservation.startDate) : null;
    const reservationEnd = reservation && reservation.endDate ? normalize(reservation.endDate) : null;

    // Convert reservedDates to dayjs objects
    const reservedDayjsDates = uniqueReservedDates
        .map((d) => normalize(d))
        .filter((d) => d.isValid && d.isValid());

    // Get all days in the current reservation range
    let reservationRange = [];
    if (reservationStart && reservationStart.isValid() && reservationEnd && reservationEnd.isValid()) {
        let curr = reservationStart.startOf('day');
        while (curr && typeof curr.isSameOrBefore === "function" && curr.isSameOrBefore(reservationEnd, 'day')) {
            reservationRange.push(curr.format('YYYY-MM-DD'));
            curr = curr.add(1, 'day');
        }
    }

    // Build a Set of reserved dates, excluding those in the current reservation
    const reservedToDisable = reservedDayjsDates.filter(
        d => !reservationRange.includes(d.format('YYYY-MM-DD'))
    );

    // shouldDisableStartDate: always normalize the input
    const shouldDisableStartDate = (date) => {
        const d = normalize(date);
        return reservedToDisable.some((rd) => rd.isSame(d, "day"));
    };

    // Find the next reserved date after the selected start date
    const nextReservedAfterStart = startDate
        ? reservedToDisable
            .filter(d => d.isAfter(normalize(startDate), "day"))
            .sort((a, b) => a.valueOf() - b.valueOf())[0]
        : null;

    // shouldDisableEndDate: always normalize the input
    const shouldDisableEndDate = (date) => {
        const d = normalize(date);
        if (!startDate) return true;
        if (d.isBefore(normalize(startDate), "day")) return true;
        if (reservedToDisable.some(rd => rd.isSame(d, "day"))) return true;
        if (nextReservedAfterStart && d.isSameOrAfter(nextReservedAfterStart, "day")) return true;
        return false;
    };

    return {
        shouldDisableStartDate,
        shouldDisableEndDate,
        reservedToDisable,
        reservationRange,
        nextReservedAfterStart
    };
};