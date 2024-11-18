import React from "react";
import { Snackbar, Box, Typography } from "@material-ui/core";
import { CheckCircle, Error } from "@material-ui/icons";

const ToastNotification = ({ open, handleClose, message, type, heading }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Box
                display="flex"
                flexDirection="column" // Align items vertically
                p={2}
                gap={2}
                width="292px"
                height="auto" // Allow height to adjust based on content
                bgcolor={type === "success" ? "#EFF6EF" : "#FEEFEF"}
                border={`1px solid ${type === "success" ? "#007000" : "#A00000"}`}
                boxShadow="0px 4px 8px rgba(25, 25, 26, 0.16)"
                borderRadius="8px"
            >
                {/* Heading: Icon + Custom Title */}
                <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                    {type === "success" ? (
                        <CheckCircle style={{ color: "#007000" }} />
                    ) : (
                        <Error style={{ color: "#A00000" }} />
                    )}
                    <Typography
                        variant="h6" // Make the title larger (headline style)
                        style={{ fontWeight: "bold", color: type === "success" ? "#007000" : "#A00000" }}
                    >
                        {heading || (type === "success" ? "Success" : "Failure")}
                    </Typography>
                </Box>

                {/* Message below heading */}
                <Typography variant="body2" style={{ color: "#19191A" }}>
                    {message}
                </Typography>
            </Box>
        </Snackbar>
    );
};

export default ToastNotification;
