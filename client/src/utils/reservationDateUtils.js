import dayjs from "../../src/dayjs-setup";

/**
 * Normalizes any date input to a Day.js object.
 * @param {any} d - The date input to normalize.
 * @returns {import("dayjs").Dayjs} A Day.js object.
 *
 * Reasoning: The function returns either the input if it's already a Day.js object 
 * (checked by isValid function), or creates a new Day.js object.
 */
const normalize = (d) => (d && typeof d.isValid === "function" ? d : dayjs(d));

/**
 * Provides utilities for reservation date selection and validation.
 * @param {Array<string|Date|import("dayjs").Dayjs>} reservedDates - Array of reserved dates, can be strings, Date objects, or Day.js objects.
 * @param {{startDate?: string|Date|import("dayjs").Dayjs, endDate?: string|Date|import("dayjs").Dayjs}|null|undefined} reservation - The current reservation object, may be null/undefined.
 * @param {string|Date|import("dayjs").Dayjs|null|undefined} startDate - The selected start date, may be null/undefined.
 * @returns {{
 *   shouldDisableStartDate: (date: any) => boolean,
 *   shouldDisableEndDate: (date: any) => boolean,
 *   reservedToDisable: Array<import("dayjs").Dayjs>,
 *   reservationRange: Array<string>,
 *   nextReservedAfterStart: import("dayjs").Dayjs|null|undefined
 * }}
 *
 * Reasoning: 
 * - reservedDates is deduplicated and mapped to Day.js objects.
 * - reservation is an object with optional startDate and endDate.
 * - startDate can be various date types or null/undefined.
 * - The returned object contains functions and arrays of Day.js objects and strings.
 */
export const getReservationDateUtils = (reservedDates, reservation, startDate) => {
    // Deduplicate reservedDates
    /** @type {Array<string|Date|import("dayjs").Dayjs>} */
    const uniqueReservedDates = Array.from(new Set(reservedDates));

    // Defensive: handle null/undefined reservation
    /** @type {import("dayjs").Dayjs|null} */
    const reservationStart = reservation && reservation.startDate ? normalize(reservation.startDate) : null;
    /** @type {import("dayjs").Dayjs|null} */
    const reservationEnd = reservation && reservation.endDate ? normalize(reservation.endDate) : null;

    // Convert reservedDates to dayjs objects
    /** @type {Array<import("dayjs").Dayjs>} */
    const reservedDayjsDates = uniqueReservedDates
        .map((d) => normalize(d))
        .filter((d) => d.isValid && d.isValid());

    // Get all days in the current reservation range
    /** @type {Array<string>} */
    let reservationRange = [];
    if (reservationStart && reservationStart.isValid() && reservationEnd && reservationEnd.isValid()) {
        let curr = reservationStart.startOf('day');
        while (curr && typeof curr.isSameOrBefore === "function" && curr.isSameOrBefore(reservationEnd, 'day')) {
            reservationRange.push(curr.format('YYYY-MM-DD'));
            curr = curr.add(1, 'day');
        }
    }

    // Build a Set of reserved dates, excluding those in the current reservation
    /** @type {Array<import("dayjs").Dayjs>} */
    const reservedToDisable = reservedDayjsDates.filter(
        d => !reservationRange.includes(d.format('YYYY-MM-DD'))
    );

    /**
     * Determines if a start date should be disabled.
     * @param {any} date - The date to check.
     * @returns {boolean} True if the date should be disabled.
     *
     * Reasoning: Accepts any input, normalizes to Day.js, checks against reservedToDisable.
     */
    const shouldDisableStartDate = (date) => {
        const d = normalize(date);
        return reservedToDisable.some((rd) => rd.isSame(d, "day"));
    };

    /**
     * The next reserved date after the selected start date.
     * @type {import("dayjs").Dayjs|null|undefined}
     *
     * Reasoning: Either the first reserved date after startDate, or null/undefined.
     */
    const nextReservedAfterStart = startDate
        ? reservedToDisable
            .filter(d => d.isAfter(normalize(startDate), "day"))
            .sort((a, b) => a.valueOf() - b.valueOf())[0]
        : null;

    /**
     * Determines if an end date should be disabled.
     * @param {any} date - The date to check.
     * @returns {boolean} True if the date should be disabled.
     *
     * Reasoning: Accepts any input, normalizes to Day.js, checks against startDate, reservedToDisable, and nextReservedAfterStart.
     */
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