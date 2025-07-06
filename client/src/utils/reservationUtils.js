import dayjs from "../../src/dayjs-setup";

/**
 * Returns the number of days between two dates (inclusive).
 * If either date is missing, returns 1.
 */
export const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    return dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
}

/**
 * Adds a device or service row to the itemRows array if not already present.
 * Returns the new array.
 */
export const addItemRow = (itemRows, item, type, qty) => {
    if (!item || item.id === undefined) return itemRows;
    if (itemRows.some(row => row.type === type && row.itemId === item.id)) return itemRows;

    return [
        ...itemRows,
        {
            id: `${type}-${item.id}`,
            itemId: item.id,
            name: item.name,
            price: item.price,
            vat: item.vat,
            qty,
            discount: 0,
            type
        }
    ];
}

/**
 * Updates the qty for all rows in itemRows.
 */
export const updateRowsQty = (itemRows, qty) => {
    return itemRows.map(row => ({
        ...row,
        qty
    }));
}

/**
 * Updates a specific row in the rows array with newRow data.
 */
export function updateRow(rows, newRow) {
    return rows.map(row =>
        row.id === newRow.id ? { ...row, ...newRow } : row
    );
}

/**
 * Deletes a row from the rows array by its id.
 */
export function deleteRow(rows, id) {
    return rows.filter(row => row.id !== id);
}