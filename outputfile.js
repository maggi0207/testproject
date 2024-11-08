 <Switch
                  checked={webNotifications}
                  onChange={() => setWebNotifications(!webNotifications)}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'green', // Ball color when checked
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'green', // Track color when checked
                    },
                  }}
                />
