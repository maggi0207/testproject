import React from "react";
import {Snackbar, Box, Typography, Grid} from "@material-ui/core";

const ToastNotification = ({open, handleClose, message, type, heading, fromApi}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            style={{
                position : "fixed",
                top : fromApi === 'updateEmailDelivery' ? "130px" : "330px",
                right : "30px",
                zIndex : 9999,
            }}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
        >
            <Box className={`toast-notification ${type === "success" ? "success" : "failure"}`}>
                <Grid container spacing={1}>
                    <Grid item>
                        <Box className="icon">
                            {type === "success" ? (
                                <span className="Toast_Positive"></span>
                            ) : (
                                <span className="Toast_Activity"></span>
                            )}
                        </Box>
                    </Grid>


                    <Grid item xs>
                        <Typography variant="h6" className="heading">
                            {heading || (type === "success" ? "Success" : "Failure")}
                        </Typography>
                        <Typography variant="body2" className="message">
                            {message}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Snackbar>
    );
};

export default ToastNotification;
