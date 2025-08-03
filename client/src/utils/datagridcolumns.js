import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from '@mui/material';

/**
 * Represents a single column schema item.
 * @typedef {Object} ColumnSchemaItem
 * @property {string} field - The field name for the column.
 * @property {string} header - The header name for the column.
 * @property {number} [flex] - Optional flex value for the column width.
 */

/**
 * Represents a function to handle row deletion.
 * @callback OnDelete
 * @param {Object} row - The row object to delete.
 * @returns {void}
 */

/**
 * Generates column definitions for a data grid, including an action column for deletion.
 * @param {ColumnSchemaItem[]} schema - Array of column schema items.
 * @param {OnDelete} onDelete - Callback function to handle row deletion.
 * @returns {Object[]} Array of column definition objects for the data grid.
 *
 * Reasoning: 
 * - `schema` is mapped, so it must be an array of objects with at least `field` and `header` 
 *    string properties, and optional `flex` number property.
 * - `onDelete` is called with `params.row`, so it is a function accepting an object.
 * - The function returns an array of column definition objects.
 */
const dataGridColumns = (schema, onDelete) => {
    /**
     * @type {Object[]}
     * Array of base column definitions derived from the schema.
     */
    const baseColumns = schema.map((item) => ({
        field: item.field,
        headerName: item.header,
        flex: item.flex || 1,
        editable: true,
    }));

    /**
     * @type {Object}
     * Action column definition for delete functionality.
     */
    const actionColumn = {
        field: "actions",
        headerName: "Poista",
        sortable: false,
        renderCell: (params) => (
            <IconButton
                size="small"
                color="error"
                onClick={e => {
                    e.stopPropagation(); // Prevent row click event
                    onDelete(params.row);
                }}
            >
                <DeleteIcon />
            </IconButton>
        ),
    };

    return [...baseColumns, actionColumn];
};

export default dataGridColumns;