Summary
1. Created Shared Address Component
Reusable AddressField component with Country, Address Line 1/2, City, State, Zip Code, and +4 fields
Backed by AddressModel with DataAnnotations validation
Supports mailing address and up to 3 physical locations
Zip +4 field labeled "+4 (Optional)" per DWD review feedback
Note: Front-end "Address Line 1" maps to SUITES backend "Address Line 2" and vice versa
2. Created Shared Input Components for Phone Number and FEIN
PhoneNumberField — auto-formats input as 999-999-9999, strips non-digits, limits to 10 digits, displays format hint (999-999-9999)
FEINField — auto-formats input as 99-9999999, strips non-digits, limits to 9 digits
3. Organized Component Folder Structure

Components/
├── Inputs/        → OutlinedTextField, OutlinedSelectField+  SelectOption.cs, PhoneNumberField, FEINField
├── Address/       → AddressField
├── Validation/    →  CustomValidator


4. Custom Validator for Nested Object Validation
CustomValidator component uses ValidationMessageStore to handle validation for nested AddressModel objects
Why it's needed: Blazor's built-in DataAnnotationsValidator only validates top-level properties on BusinessInformationModel (FEIN, LegalName, Phone, Email). It does not recurse into nested objects like MailingAddress or PhysicalLocations[]
How it works:
On HandleContinue(), each AddressModel is manually validated using Validator.TryValidateObject()
Validation errors are passed to CustomValidator.DisplayErrors() which adds them to the ValidationMessageStore
This enables FieldError components and error styling to work on nested address fields (Country, City, State, Zip)
Errors auto-clear per field on OnFieldChanged as the user types/selects
