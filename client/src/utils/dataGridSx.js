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