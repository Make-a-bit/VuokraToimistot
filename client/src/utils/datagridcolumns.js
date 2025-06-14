import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const dataGridColumns = (schema, onDelete) => {
    const baseColumns = schema.map((item) => ({
        field: item.field,
        headerName: item.header,
        flex: item.flex || 1,
        editable: true,
    }));

    const actionColumn = {
        field: "actions",
        headerName: "Poista",
        sortable: false,
        renderCell: (params) => (
            <IconButton size="small" color="error" onClick={() => onDelete(params.row)}>
                <DeleteIcon />
            </IconButton>
        ),
    };

    return [...baseColumns, actionColumn];
};

export default dataGridColumns;