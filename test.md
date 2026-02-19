# Shared Components — Usage Guide

---

## Namespaces — Add these to your `.razor` file or `_Imports.razor`

```razor
@using System.ComponentModel.DataAnnotations
@using Microsoft.AspNetCore.Components.Forms
@using UI.EmployerPortal.Web.Features.Shared.Registrations.Models
@using UI.EmployerPortal.Razor.SharedComponents.Model
@using UI.EmployerPortal.Razor.SharedComponents.Address
@using UI.EmployerPortal.Razor.SharedComponents.Validation
@using UI.EmployerPortal.Razor.SharedComponents.Inputs
```

> Already added in `Features/_Imports.razor` and `Components/_Imports.razor`.
> Only add manually if creating a page outside those folders.

---

## Components at a Glance

| Component | File | What it does |
|---|---|---|
| `FEINField` | `Inputs/FEINField.razor` | FEIN input — auto-formats to `99-9999999` |
| `PhoneNumberField` | `Inputs/PhoneNumberField.razor` | Phone input — auto-formats to `999-999-9999` |
| `OutlinedTextField` | `Inputs/OutlinedTextField.razor` | Generic text input |
| `OutlinedSelectField` | `Inputs/OutlinedSelectField.razor` | Dropdown / select |
| `FieldError` | `Validation/FieldError.razor` | Red error message shown below a field |
| `AddressField` | `Address/AddressField.razor` | Full address block (all 7 fields in one) |

---

## 1. FEIN Number Field

**Purpose**
Text input for Federal Employer Identification Number.
Automatically formats the value as `99-9999999` as the user types.
Turns red with an error message if left empty on submit.

**File**
`Razor.SharedComponents/Inputs/FEINField.razor`

**Usage**
```razor
<FEINField @bind-Value="Model.FEIN"
           For="() => Model.FEIN"
           Visible="formSubmitted" />
<FieldError For="@(() => Model.FEIN)" Visible="formSubmitted" />
```

**Parameters**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `Value` | string? | | The FEIN value |
| `Label` | string | `"FEIN"` | Label shown above the field |
| `For` | Expression | | Links field to validation |
| `Visible` | bool | false | Show error state after submit |
| `Disabled` | bool | false | Makes field read-only |

**Model mapping**
`Features/Shared/Registrations/Models/BusinessInformationModel.cs`
```csharp
[Required(ErrorMessage = "FEIN is required.")]
[RegularExpression(@"^\d{2}-\d{7}$", ErrorMessage = "FEIN must be in format 99-9999999.")]
public string? FEIN { get; set; }
```

---

## 2. Phone Number Field

**Purpose**
Text input for a business phone number.
Automatically formats the value as `999-999-9999` as the user types.
Opens numeric keyboard on mobile. Turns red if left empty on submit.

**File**
`Razor.SharedComponents/Inputs/PhoneNumberField.razor`

**Usage**
```razor
<PhoneNumberField @bind-Value="Model.PhoneNumber"
                  For="() => Model.PhoneNumber"
                  Visible="formSubmitted" />
<FieldError For="@(() => Model.PhoneNumber)" Visible="formSubmitted" />
```

**Parameters**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `Value` | string? | | The phone number value |
| `Label` | string | `"Phone Number"` | Label shown above the field |
| `For` | Expression | | Links field to validation |
| `Visible` | bool | false | Show error state after submit |
| `Disabled` | bool | false | Makes field read-only |

**Model mapping**
`Features/Shared/Registrations/Models/BusinessInformationModel.cs`
```csharp
[Required(ErrorMessage = "Phone Number is required.")]
[RegularExpression(@"^\d{3}-\d{3}-\d{4}$", ErrorMessage = "Phone Number must be in format 999-999-9999.")]
public string? PhoneNumber { get; set; }
```

---

## 3. Select / Dropdown Field

**Purpose**
A dropdown where the user picks one option from a list (e.g. State, Country).
Shows a custom arrow icon. Turns red if nothing is selected on submit.

**File**
`Razor.SharedComponents/Inputs/OutlinedSelectField.razor`

**Usage**
```razor
<OutlinedSelectField Label="State"
                     @bind-Value="Model.State"
                     Options="States"
                     Placeholder="-- Select --"
                     For="() => Model.State"
                     Visible="formSubmitted" />
<FieldError For="@(() => Model.State)" Visible="formSubmitted" />
```

Define the options list in code-behind:
```csharp
protected List<SelectOption> States { get; set; } = new()
{
    new SelectOption { Value = "AL", Text = "Alabama" },
    new SelectOption { Value = "AK", Text = "Alaska" },
    // ...
};
```

**Parameters**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `Value` | string? | | The selected value |
| `Label` | string? | | Label shown above the dropdown |
| `Options` | List\<SelectOption\> | `[]` | List of options to show |
| `Placeholder` | string? | | Greyed-out first option (e.g. `"-- Select --"`) |
| `For` | Expression | | Links field to validation |
| `Visible` | bool | false | Show error state after submit |
| `Disabled` | bool | false | Makes field read-only |

**Model mapping**
```csharp
[Required(ErrorMessage = "State is required.")]
public string? State { get; set; }
```

---

## 4. Address Field

**Purpose**
A ready-made address form that renders all 7 fields at once:
Country, Address Line 1, Address Line 2 (optional), City, State, Zip Code, Extension (optional).
Uses `AddressModel` to hold the values. You must pass in the `Countries` and `States` lists.

**Files**
- Component: `Razor.SharedComponents/Address/AddressField.razor`
- Model: `Razor.SharedComponents/Model/AddressModel.cs`

**Usage**
```razor
<AddressField Address="Model.MailingAddress"
              Countries="Countries"
              States="States"
              Visible="formSubmitted" />
```

**Parameters**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `Address` | AddressModel | Yes | The address object to bind to |
| `Countries` | List\<SelectOption\> | Yes | List of country options |
| `States` | List\<SelectOption\> | Yes | List of state options |
| `Visible` | bool | | Show error state after submit |

**Model mapping**
`Features/Shared/Registrations/Models/BusinessInformationModel.cs`
```csharp
public AddressModel MailingAddress { get; set; } = new();

public List<AddressModel> PhysicalLocations { get; set; } = new()
{
    new AddressModel()
};
```

`AddressModel` properties (`Razor.SharedComponents/Model/AddressModel.cs`):
```csharp
public string? Country      { get; set; } = "United States";  // required
public string? AddressLine1 { get; set; }                      // required
public string? AddressLine2 { get; set; }                      // optional
public string? City         { get; set; }                      // required
public string? State        { get; set; }                      // required
public string? Zip          { get; set; }                      // required
public string? Extension    { get; set; }                      // optional (ZIP+4)
```

---

## 5. Validation

**Purpose**
Error messages are hidden when the page loads.
They appear only after the user clicks Submit and a required field is empty.
Each field clears its own error as the user fixes the value.

**File**
`Razor.SharedComponents/Validation/FieldError.razor`

**Rule — always place `FieldError` directly below every required field**

```razor
<FEINField @bind-Value="Model.FEIN"
           For="() => Model.FEIN"
           Visible="formSubmitted" />
<FieldError For="@(() => Model.FEIN)" Visible="formSubmitted" />
```

Both lines must use the same `For` expression and the same `Visible` value.
Optional fields do not need a `FieldError`.

**Page setup**
```razor
<EditForm EditContext="editContext"
          OnValidSubmit="OnValidSubmit"
          OnInvalidSubmit="OnInvalid">

    <DataAnnotationsValidator />

    <!-- fields go here -->

    <button type="submit">Continue</button>
</EditForm>
```

**Code-behind setup**
```csharp
private BusinessInformationModel Model = new();
private EditContext editContext = default!;
private bool formSubmitted = false;

protected override void OnInitialized()
{
    editContext = new EditContext(Model);
    editContext.OnFieldChanged += (_, __) => StateHasChanged();
}

private void OnValidSubmit()  { /* proceed to next step */ }

private void OnInvalid()
{
    formSubmitted = true;   // shows all FieldError messages
    StateHasChanged();
}
```

**Adding a validation rule to a model property**
```csharp
// Required field
[Required(ErrorMessage = "Legal Name is required.")]
public string? LegalName { get; set; }

// Required + format check
[Required(ErrorMessage = "Email Address is required.")]
[EmailAddress(ErrorMessage = "Please enter a valid email address.")]
public string? Email { get; set; }
```

Change the `ErrorMessage` text to control exactly what the user sees.

---

## Checklist — Adding a New Field

- [ ] Add the property to `BusinessInformationModel.cs`
- [ ] Add `[Required]` (and any format rule) if mandatory
- [ ] Add the component to the `.razor` page
- [ ] Place `<FieldError>` directly below it (required fields only)
- [ ] Set the same `For=` expression on both lines
- [ ] Set `Visible="formSubmitted"` on both lines
