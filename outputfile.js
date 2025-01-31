import React from "react";
import { Container, Typography, Box, Paper, Grid, Card, CardContent, Divider } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import Page from "components/Page";
import MicrocopyComponent from "framework/components/MicrocopyComponent";
import LightTooltip from "components/CustomToolTip";
import InfoCard from "components/ToolTip";
import HelpIcon from "components/icons/HelpIcon";
import { novoRoutes } from "framework/routes";
import { marketingPortal } from "library/config/constants";
import './Overview.scss'
import { padding } from "@mui/system";

// Need to handle direct flow from partner

// Need to handle flow from initial info
// - For existing application


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

const Overview = ({ data = sampleData }) => {
    const novoRouteKey = 'ApplicationOverView'
    const primaryDriver = data?.drivers?.[0];
    const secondaryDrivers = data?.drivers?.slice(1)?.map(driver => `${driver.personal_detail.name.first_name} ${driver.personal_detail.name.last_name}`) || [];
    const primaryVehicles = data?.vehicles?.slice(0, 2) || [];
    const remainingVehicleCount = (data?.vehicles?.length || 0) - 2;
    const novoRoute = novoRoutes[novoRouteKey]

    return (
        <Grid id="ApplicationOverView" container className="quote-wrapper">
            <Page routeKey={novoRouteKey}>
                <Box className="quote-summary-content">
                    {primaryDriver && (
                        <>
                            <Typography variant="h3" className="quote-summary-title">
                                Welcome, {primaryDriver.personal_detail.name.first_name}!
                            </Typography>
                            <Typography variant="body1" className="quote-summary-subtitle">
                                Just a few more questions before we can finalize your quote
                            </Typography>
                        </>
                    )}
                    <div className="quote-summary-price-section">
                        <Typography variant="body1" className="quote-summary-text">Based on what you entered, this is your estimated premium:</Typography>
                        <Typography variant="h4" className="quote-summary-price">$164/mo</Typography>
                        <Typography variant="body2" className="quote-summary-price-discount ">• Good Student discount applied</Typography>
                    </div>

                    <Divider className="quote-summary-divider" />
                    <Typography variant="h6" className="quote-summary-section">Here's a summary of your profile</Typography>
                    <Card variant="outlined" className="quote-summary-card">
                        <CardContent sx={{ padding: 0 }}>
                            <Typography variant="subtitle1" className="quote-summary-subheading">Drivers</Typography>
                            {primaryDriver && (
                                <div className="quote-driver-info-section">
                                    <Typography variant="body1" className="quote-summary-subheading-title">{primaryDriver.personal_detail.name.first_name} {primaryDriver.personal_detail.name.last_name}</Typography>
                                    <Typography variant="body2" className="quote-summary-driver">{primaryDriver.personal_detail.dob}</Typography>
                                    <Typography variant="body2" className="quote-summary-driver">test</Typography>
                                </div>
                            )}
                            {secondaryDrivers.map((driver, index) => (
                                <Typography key={index} variant="body2" className="quote-summary-driver">& {driver}</Typography>
                            ))}
                            <Divider className="quote-summary-divider" />
                            <Typography variant="subtitle1" className="quote-summary-subheading">Vehicles</Typography>
                            <div className="quote-vechile-info-section">
                                {primaryVehicles.map((vehicle, index) => (
                                    <Typography key={index} variant="body1" className="quote-summary-vehicle">{vehicle.description.year} {vehicle.description.make} {vehicle.description.model}</Typography>
                                ))}
                            </div>
                            {remainingVehicleCount > 0 && (
                                <Typography variant="body2" className="quote-summary-vehicle">& {remainingVehicleCount} other vehicle(s) found</Typography>
                            )}
                        </CardContent>
                    </Card>
                    <Grid item lg={11} md={12} sm={12} xs={12} sx={{ mt: '1.5rem', backgroundColor: '#F1F2F5', padding: '12px' }}>
                        <Typography
                            variant="subtitle2"
                            component="h2"
                            className={'page-header-h2 page-header-h2-font-25'}
                            sx={{ marginBottom: '1rem !important' }}
                        >
                            <MicrocopyComponent
                                labelKey={novoRoute.disclosure as string}
                                placeHolderKey="$MARKETING_PORTAL_URL$"
                                actualValue={marketingPortal}
                            />
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            component="h2"
                            className={'page-header-h2 page-header-h2-font-25'}
                            sx={{ marginBottom: '0rem !important', display: 'flex' }}
                        >
                            <MicrocopyComponent labelKey="q2b.initial.info.sr22" />
                            <span id="root_sr22Required" style={{ marginTop: '12px', marginLeft: '8px' }}></span>
                        </Typography>
                        <span style={{ display: 'flex', fontSize: '14px' }}>
                            We are unable to offer
                            <LightTooltip
                                placement="bottom"
                                title={
                                    <InfoCard
                                        title={`What's an SR-22?`}
                                        description={`Also known as a "Certificate of Financial Responsibility", An SR-22 is a form that's filed with your state to prove that you have car insurance meeting the minimum coverage required by law.`}
                                    ></InfoCard>
                                }
                            >
                                <span
                                    style={{
                                        display: 'inline',
                                        marginLeft: '4px',
                                        marginRight: '4px',
                                        cursor: 'pointer',
                                    }}
                                    id="root_sr22Required"
                                >
                                    SR-22
                                    <HelpIcon style={{ marginLeft: '0.5rem', color: 'black' }} />
                                </span>
                            </LightTooltip>
                            an at this time.
                        </span>
                    </Grid>
                </Box>

            </Page>

        </Grid>
    );
};

export default Overview;
