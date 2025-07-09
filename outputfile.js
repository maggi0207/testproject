// ✅ File: types/pages/AuthUserCard.ts

export type Metadata = {
  uid: string;
};

export type TextFieldWrapper = {
  label: string;
  isverificationrequired: boolean;
  errormessage?: string;
  fieldid: string;
  _metadata: Metadata;
};

export type ButtonFieldWrapper = {
  label: string;
  _metadata: Metadata;
};

export type DobFieldWrapper = {
  label: string;
  textlabelmonth: string;
  textlabelday: string;
  textlabelyear: string;
  errortextmonth: string;
  errortextyear: string;
  warningtext?: string;
  _metadata: Metadata;
};

export type InfoTextWrapper = {
  text: string;
  _metadata: Metadata;
};

export type AuthUserCardField =
  | { textfield: TextFieldWrapper }
  | { dob: DobFieldWrapper }
  | { button: ButtonFieldWrapper }
  | { infotext: InfoTextWrapper };

export interface UserDetails {
  firstName: string;
  lastName: string;
  membershipNumber?: string;
}

export interface AuthUserFormProps {
  fields: AuthUserCardField[];
  initialValues: Record<string, string>;
  requiredFields: Record<string, string>;
  submitLabel: string;
  cancelLabel: string;
  firstInputRef: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
  onSubmitSuccess: (values: Record<string, string>) => void;
}

// ✅ File: components/SubComponents/AuthUserForm.tsx

import {
  CostcoFormikForm,
  FormikTextField,
  FormikDateOfBirthField,
} from "@costcolabs/forge-digital-components";
import { Stack } from "@mui/material";
import { Button } from "@costcolabs/forge-components";
import { SpaceMd } from "@costcolabs/forge-design-tokens";
import { validateFields, knownFieldIds } from "../helpers";
import {
  AuthUserCardField,
  TextFieldWrapper,
  DobFieldWrapper,
  AuthUserFormProps,
} from "#/src/types/pages/AuthUserCard";

const AuthUserForm: React.FC<AuthUserFormProps> = ({
  fields,
  initialValues,
  requiredFields,
  submitLabel,
  cancelLabel,
  firstInputRef,
  onCancel,
  onSubmitSuccess,
}) => {
  return (
    <CostcoFormikForm
      initialValues={initialValues}
      validateOnBlur
      validateOnChange
      validate={(values) => validateFields(values, requiredFields)}
      onSubmit={(values, helpers) => {
        onSubmitSuccess(values);
        helpers.resetForm();
      }}
      formProps={{ noValidate: true }}
    >
      <Stack gap={SpaceMd}>
        {fields.map((field, index) => {
          if ("textfield" in field) {
            const textfield: TextFieldWrapper = field.textfield;
            return (
              <FormikTextField
                key={textfield.fieldid}
                name={textfield.fieldid}
                label={textfield.label}
                isRequired={!!textfield.isverificationrequired}
                type={textfield.fieldid === knownFieldIds.membershipNumber ? "number" : "text"}
                inputRef={index === 0 ? firstInputRef : undefined}
                sx={{ marginBottom: SpaceMd }}
              />
            );
          }

          if ("dob" in field) {
            return (
              <FormikDateOfBirthField
                key={field.dob.label}
                autoCompleteGroup="billing"
                name={knownFieldIds.dob}
                text={{
                  dayhelpertext: "DD",
                  daylabel: "Day",
                  dobdisclaimer: undefined,
                  monthhelpertext: "Month",
                  monthlabel: "Month",
                  yearhelpertext: "YYYY",
                  yearlabel: "Year",
                }}
              />
            );
          }

          return null;
        })}

        <Stack gap={SpaceMd}>
          <Button type="submit">{submitLabel}</Button>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        </Stack>
      </Stack>
    </CostcoFormikForm>
  );
};

export default AuthUserForm;
