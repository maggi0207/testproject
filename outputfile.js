import React from "react";
import { Snackbar, Box, Typography, Grid } from "@material-ui/core";
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
                p={2}
                width="292px"
                bgcolor={type === "success" ? "#EFF6EF" : "#FEEFEF"}
                border={`1px solid ${type === "success" ? "#007000" : "#A00000"}`}
                boxShadow="0px 4px 8px rgba(25, 25, 26, 0.16)"
                borderRadius="8px"
            >
                <Grid container spacing={2}>
                    {/* Icon Column */}
                    <Grid item>
                        {type === "success" ? (
                            <CheckCircle style={{ color: "#007000", fontSize: "24px" }} />
                        ) : (
                            <Error style={{ color: "#A00000", fontSize: "24px" }} />
                        )}
                    </Grid>

                    {/* Text Column */}
                    <Grid item xs>
                        <Typography
                            variant="h6"
                            style={{
                                fontWeight: "bold",
                                color: type === "success" ? "#007000" : "#A00000",
                                marginBottom: "8px", // Gap between heading and message
                            }}
                        >
                            {heading || (type === "success" ? "Success" : "Failure")}
                        </Typography>
                        <Typography
                            variant="body2"
                            style={{ color: "#19191A" }}
                        >
                            {message}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Snackbar>
    );
};

export default ToastNotification;
