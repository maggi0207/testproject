import React from "react";
import { Container, Typography, Box, Paper, Grid, Card, CardContent, Divider } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";

const sampleData = {
  drivers: [
    {
      personal_detail: {
        name: { first_name: "Jacob", last_name: "Smith" },
        dob: "1995-06-15",
        address: {
          address_line_1: "2450 Mission College Blvd",
          city: "Santa Clara",
          state: "CA",
          zip: "95054",
        },
      },
    },
    {
      personal_detail: {
        name: { first_name: "Julia", last_name: "Smith" },
      },
    },
  ],
  vehicles: [
    {
      description: { year: "2021", make: "Jeep", model: "Liberty" },
    },
    {
      description: { year: "2022", make: "Toyota", model: "Tundra" },
    },
    {
      description: { year: "2020", make: "Honda", model: "Civic" },
    },
  ],
};

const QuoteSummary = ({ data = sampleData }) => {
  const primaryDriver = data?.drivers?.[0];
  const secondaryDrivers = data?.drivers?.slice(1)?.map(driver => `${driver.personal_detail.name.first_name} ${driver.personal_detail.name.last_name}`) || [];
  const primaryVehicles = data?.vehicles?.slice(0, 2) || [];
  const remainingVehicleCount = (data?.vehicles?.length || 0) - 2;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Container maxWidth="md" sx={{ textAlign: "left" }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {primaryDriver && (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Welcome, {primaryDriver.personal_detail.name.first_name}!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Just a few more questions before we can finalize your quote
              </Typography>
            </>
          )}
          <Typography variant="h6">Based on what you entered, this is your estimated premium:</Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>$164/mo</Typography>
          <Typography variant="body2" color="primary">• Good Student discount applied</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Here's a summary of your profile</Typography>
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Drivers</Typography>
              {primaryDriver && (
                <>
                  <Typography variant="body1">{primaryDriver.personal_detail.name.first_name} {primaryDriver.personal_detail.name.last_name}</Typography>
                  <Typography variant="body2">{primaryDriver.personal_detail.dob}</Typography>
                  <Typography variant="body2">{primaryDriver.personal_detail.address.address_line_1}, {primaryDriver.personal_detail.address.city}, {primaryDriver.personal_detail.address.state} {primaryDriver.personal_detail.address.zip}</Typography>
                </>
              )}
              {secondaryDrivers.map((driver, index) => (
                <Typography key={index} variant="body2">& {driver}</Typography>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Vehicles</Typography>
              {primaryVehicles.map((vehicle, index) => (
                <Typography key={index} variant="body1" sx={{ fontWeight: "bold" }}>{vehicle.description.year} {vehicle.description.make} {vehicle.description.model}</Typography>
              ))}
              {remainingVehicleCount > 0 && (
                <Typography variant="body2">& {remainingVehicleCount} other vehicle(s) found</Typography>
              )}
            </CardContent>
          </Card>
        </Paper>
      </Container>
    </Box>
  );
};

export default QuoteSummary;
