


Scenario 1: Case Email notification preferences Toggle Email Notification and/or Instant Email checkbox On/Off successful

GIVEN I am a hub user on the Case Email notification preferences section of the My Account page

WHEN I toggle either the Daily Summary or Instant emails option to on/off AND/OR check the Instant notifications box AND successfully update

THEN I should receive a green text only (no title/header) toast notification that says "Your case email notifications preferences have been updated."

Scenario 2: Case Email notification preferences Toggle Email Notification and/or Instant Email checkbox On/Off not successful
GIVEN I am on the Case Email notification preferences section of the My Account page

WHEN I toggle either the Daily Summary or Instant emails option to on/off AND/OR check the Instant notifications box AND do not have a successful update

THEN I should receive a red text only (no title/header) toast notification that says "Your case email notification preferences were not saved. If you wish to make changes, please update your preferences again."



Scenario 3: Communication notification preferences Toggle Email Notification On/Off successful

GIVEN I am on the Communication notification preferences section of the My Account page

WHEN I toggle the Email notification for Payer processing issues ON/OFF and successfully update

THEN I should receive a green text only (no title/header) toast notification that says "Your communication message notifications preferences have been updated."

Scenario 4: Communication notification preferences Toggle Email Notification On/Off not successful
GIVEN I am on the Communication notification preferences section of the My Account page

WHEN I toggle the Email notification for Payer processing issues ON/OFF and do NOT have a successful update

THEN I should receive a red text only (no title/header) toast notification that says "Your communication message notifications preferences were not saved. If you wish to make changes, please update your preferences again."


Scenario 5: Notification preference changes cancellation (existing behavior - no changes)
GIVEN I am a hub user on the any section of the My Account page

WHEN I cancel any notification change prior to updating

THEN I should receive a blue text only (no title/header) toast notification with the message "Your preferences were not saved. If you wish to make changes, please update your preferences again."

Scenario 6: Updating Case Email notification preferences only

GIVEN I am on the Notification preferences section of the My Account page

WHEN I make an update on Case Email notification preferences but do not make a change on Communication notification preferences

THEN the API should only be called for the updated item 
AND I should only receive a toast notification for the updated item

Scenario 7: Updating Communication notification preferences only

GIVEN I am on the Notification preferences section of the My Account page

WHEN I make an update on Communication notification preferences but do not make a change on Case Email notification preferences

THEN the API should only be called for the updated item 
AND I should only receive a toast notification for the updated item
