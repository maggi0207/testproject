ToastNotification › should render failure notification correctly

    TypeError: expect(...).toBeInTheDocument is not a function

      32 |       />
      33 |     );
    > 34 |     expect(screen.getByText(/This is a failure message/i)).toBeInTheDocument();
         |                                                            ^
      35 |     expect(screen.getByText(/Failure/i)).toBeInTheDocument();
      36 |     expect(screen.getByText(/Failure/i).parentElement).toHaveStyle('background-color: #E9F1FF');
      37 |   });

      at Object.<anonymous> (src/test/ToastNotification.test.js:34:60)
      at TestScheduler.scheduleTests (node_modules/@jest/core/build/TestScheduler.js:333:13)
      at runJest (node_modules/@jest/core/build/runJest.js:404:19)

  ● ToastNotification › should call handleClose when Snackbar is closed

    Unable to find an accessible element with the role "button"

    Here are the accessible roles:

      document:

      Name "":
      <body />

      --------------------------------------------------
      generic:

      Name "":
      <div />

      Name "":
      <div
        class="MuiSnackbar-root MuiSnackbar-anchorOriginTopRight"
      />

      Name "":
      <div
        class="MuiBox-root MuiBox-root-5"
        direction="down"
        gap="9"
        style="opacity: 1; transform: scale(1, 1); transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"
      />

      Name "":
      <div
        class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-1"
      />

      Name "":
      <div
        class="MuiGrid-root MuiGrid-item"
      />

      Name "":
      <div
        class="MuiBox-root MuiBox-root-6"
        style="margin-top: 5px; margin-right: 2px;"
      />

      Name "":
      <span
        class="Toast_Positive"
      />

      Name "":
      <div
        class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
      />

      --------------------------------------------------
      heading:

      Name "Success":
      <h6
        class="MuiTypography-root MuiTypography-h6"
        style="font-weight: bold; color: rgb(0, 112, 0); font-size: 16px;"
      />

      --------------------------------------------------

    <body>
      <div>
        <div
          class="MuiSnackbar-root MuiSnackbar-anchorOriginTopRight"
        >
          <div
            class="MuiBox-root MuiBox-root-5"
            direction="down"
            gap="9"
            style="opacity: 1; transform: scale(1, 1); transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"
          >
            <div
              class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-1"
            >
              <div
                class="MuiGrid-root MuiGrid-item"
              >
                <div
                  class="MuiBox-root MuiBox-root-6"
                  style="margin-top: 5px; margin-right: 2px;"
                >
                  <span
                    class="Toast_Positive"
                  />
                </div>
              </div>
              <div
                class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
              >
                <h6
                  class="MuiTypography-root MuiTypography-h6"
                  style="font-weight: bold; color: rgb(0, 112, 0); font-size: 16px;"
                >
                  Success
                </h6>
                <p
                  class="MuiTypography-root MuiTypography-body2"
                  style="color: rgb(25, 25, 26);"
                >
                  This is a message
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>

      47 |       />
      48 |     );
    > 49 |     fireEvent.click(screen.getByRole('button'));
         |                            ^
      50 |     expect(mockHandleClose).toHaveBeenCalledTimes(1);
      51 |   });
      52 |

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:34:12)
      at node_modules/@testing-library/dom/dist/query-helpers.js:71:38
      at getByRole (node_modules/@testing-library/dom/dist/query-helpers.js:54:17)
      at Object.<anonymous> (src/test/ToastNotification.test.js:49:28)
      at TestScheduler.scheduleTests (node_modules/@jest/core/build/TestScheduler.js:333:13)
      at runJest (node_modules/@jest/core/build/runJest.js:404:19)

  ● ToastNotification › should not render when open is false

    TypeError: expect(...).not.toBeInTheDocument is not a function

      61 |       />
      62 |     );
    > 63 |     expect(screen.queryByText(/This is a message/i)).not.toBeInTheDocument();
         |                                                          ^
      64 |   });
      65 | });

      at Object.<anonymous> (src/test/ToastNotification.test.js:63:58)
      at TestScheduler.scheduleTests (node_modules/@jest/core/build/TestScheduler.js:333:13)
      at runJest (node_modules/@jest/core/build/runJest.js:404:19)

Test Suites: 1 failed, 1 total
Tests:       4 failed, 4 total
Snapshots:   0 total
Time:        7.274 s
Ran all test suites matching /ToastNotification/i.

Active Filters: filename /ToastNotification/
 › Press c to clear filters.

Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press o to only run tests related to changed files.
 › Press q to quit watch mode.
 › Press i to run failing tests interactively.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press Enter to trigger a test run.
