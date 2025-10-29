import { TableCell, styled } from "@mui/material"

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: "5px 10px",
    fontSize: "0.8rem",
    fontWeight: 500,
    textAlign: "left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",

    "&.MuiTableCell-head": {
        backgroundColor: "#1B2064",
        color: "#ffffff",
        fontSize: "0.85rem",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontWeight: 600,
        borderRight: "none",
        whiteSpace: "nowrap",
    },

    "&.MuiTableCell-body": {
        position: "relative",
        "&:not(:last-child)::after": {
            content: '""',
            position: "absolute",
            top: "25%",
            bottom: "25%",
            right: 0,
            width: "1px",
            backgroundColor: "#E0E3E7",
        },
    },
}))