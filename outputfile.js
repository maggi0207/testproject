import React from "react";
import {Snackbar, Box, Typography, Grid} from "@material-ui/core";

const ToastNotification = ({open, handleClose, message, type, heading}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
        >
            <Box
                display="flex"
                flexDirection="column"
                p={2}
                gap={9}
                width="292px"
                height="auto"
                top="390px"
                bgcolor={type === "success" ? "#EFF6EF" : "#E9F1FF"}
                border={`1px solid ${type === "success" ? "#007000" : "#0C55B8"}`}
                boxShadow="0px 4px 8px 0px #19191A29"
                borderRadius="8px"
            >
                <Grid container spacing={1}>
                    <Grid item>
                        <Box style={{marginTop: "5px", marginRight: "2px"}}>
                            {type === "success" ? (
                                <span className="Toast_Positive"></span>

                            ) : (
                                <span className="Toast_Activity"></span>
                            )}
                        </Box>
                    </Grid>


                    <Grid item xs>
                        <Typography
                            variant="h6"
                            style={{
                                fontWeight: "bold",
                                color: type === "success" ? "#007000" : "#323334",
                                fontSize: "16px",
                            }}
                        >
                            {heading || (type === "success" ? "Success" : "Failure")}
                        </Typography>
                        <Typography
                            variant="body2"
                            style={{color: "#19191A"}}
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
