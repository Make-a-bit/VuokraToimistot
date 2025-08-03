/**
 * @type {Object.<string, Object|string>}
 * 
 * The `dataGridSx` object defines custom style overrides for a DataGrid component.
 * Keys are CSS selectors or style properties, and values are either style objects or string values.
 * Chose `Object.<string, Object|string>` because the top-level keys are strings, and their values are 
 * either nested style objects or string values.
 */
const dataGridSx = {
    marginBottom: "20px",
    "& .MuiDataGrid-footerContainer": {
        display: "flex",
        alignItems: "center",
        minHeight: 40,
        justifyContent: "flex-end",
    },
    "& .MuiTablePagination-root": {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        minHeight: 40,
    },
    "& .MuiTablePagination-toolbar": {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        minHeight: 40,
    },
    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
        marginTop: 0,
        marginBottom: 0,
        lineHeight: "normal",
        alignSelf: "center",
    }
};

export default dataGridSx;