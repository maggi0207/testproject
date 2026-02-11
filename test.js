Summary
Implement Business Information page (Step 3) of the Employer Registration wizard
Created OutlinedSelectField reusable component for dropdown fields with floating label, error state, and custom arrow
Reused existing OutlinedTextField component for text inputs
All field-level error validation implemented using EditForm + DataAnnotationsValidator + FieldError component
Form sections: Business Details (FEIN, Legal Name, Trade Name, Phone, Email), Business Mailing Address, Physical Location
Navigation: Back → Ownership, Continue → Address Correction (with validation), Save & Quit → Dashboard
