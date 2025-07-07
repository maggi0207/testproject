import { FormikHelpers } from 'formik';
import {
  AuthUserCardField,
  TextFieldWrapper,
  ButtonFieldWrapper,
  UserDetails,
  AuthUserCardEntry,
  BaseFormFields,
  RemovePersonComposerEntry,
  RemovePersonFields,
} from '#/src/types/pages/AuthUserCard';
import { Environments } from '#src/constants';
import { findOneBusinessEntryFromAccounts } from '#src/utils/server/contentStackUtils';
import { ProjectContentTypes } from '#src/enums/contentStackEnums';
import { LocaleProps } from '#src/types/contentStack';

// Identifiers for stable fields
export const knownFieldIds = {
  firstName: 'firstnameId',
  lastName: 'lastnameId',
  membershipNumber: 'membershipnumberId',
};

export const extractFields = (layout: AuthUserCardField[]) => {
  const fields: { textfield: TextFieldWrapper }[] = [];
  const buttons: { button: ButtonFieldWrapper }[] = [];

  layout.forEach((item) => {
    if ('textfield' in item) fields.push(item as { textfield: TextFieldWrapper });
    if ('button' in item) buttons.push(item as { button: ButtonFieldWrapper });
  });

  return { fields, buttons };
};

export const initializeFieldState = (fields: { textfield: TextFieldWrapper }[]) => {
  const initialValues: Record<string, string> = {};
  const requiredFields: Record<string, string> = {};

  fields.forEach(({ textfield }) => {
    const { fieldid, isverificationrequired, errormessage } = textfield;
    initialValues[fieldid] = '';
    if (isverificationrequired) {
      requiredFields[fieldid] = errormessage || 'Required';
    }
  });

  return { initialValues, requiredFields };
};

export const validateFields = (
  values: Record<string, string>,
  requiredFields: Record<string, string>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [fieldId, message] of Object.entries(requiredFields)) {
    if (!values[fieldId]?.trim()) {
      errors[fieldId] = message;
    }
  }

  return errors;
};

// Custom handleSubmit compatible with CostcoFormikForm
export const handleSubmit = async (
  values: Record<string, string>,
  requiredFields: Record<string, string>,
  setTouched: FormikHelpers<Record<string, string>>['setTouched'],
  onSuccess: (user: UserDetails) => void
) => {
  const errors = validateFields(values, requiredFields);

  if (Object.keys(errors).length > 0) {
    // Mark all required fields as touched
    setTouched(
      Object.fromEntries(Object.keys(requiredFields).map((field) => [field, true]))
    );
    return;
  }

  const user: UserDetails = {
    firstName: values[knownFieldIds.firstName] || '',
    lastName: values[knownFieldIds.lastName] || '',
    membershipNumber: values[knownFieldIds.membershipNumber] || '',
  };

  onSuccess(user);
};

export const buildFinalEntryData = async (
  entryId: string,
  locale: LocaleProps,
  site?: Environments
): Promise<AuthUserCardEntry | null> => {
  try {
    const entry = await findOneBusinessEntryFromAccounts<AuthUserCardEntry>(
      ProjectContentTypes.AuthorizedMembersContainer,
      entryId,
      locale
    );

    const baseformUid = entry?.baseformref?.[0]?.uid;
    const removePersonUid =
      entry?.removepersoncomposer?.[0]?.removepersonwrapper?.removepersonref?.[0]?.uid;

    const finalEntryData: AuthUserCardEntry = {
      title: entry?.title ?? '',
      tooltip: entry?.tooltip ?? '',
      primarybuttonlabel: entry?.primarybuttonlabel ?? '',
      translations: { value: entry?.translations?.value ?? [] },
      baseformref: entry?.baseformref ?? [],
      removepersoncomposer: entry?.removepersoncomposer ?? [],
    };

    if (baseformUid) {
      try {
        const baseformDetails = await findOneBusinessEntryFromAccounts<BaseFormFields>(
          'baseformlayout',
          baseformUid,
          locale
        );

        if (baseformDetails) {
          finalEntryData.baseformref = [
            {
              uid: baseformDetails.uid,
              title: baseformDetails.title ?? '',
              formcontext: baseformDetails.formcontext ?? [],
              locale: baseformDetails.locale ?? 'en-us',
            },
          ];
        }
      } catch {
        console.warn('Baseform layout fetch failed.');
      }
    }

    if (removePersonUid) {
      try {
        const removePersonDetails = await findOneBusinessEntryFromAccounts<RemovePersonFields>(
          'removeperson',
          removePersonUid,
          locale
        );

        if (removePersonDetails) {
          finalEntryData.removepersoncomposer = [
            {
              removepersonwrapper: {
                removepersonref: [
                  {
                    _content_type_uid: 'removeperson',
                    ...removePersonDetails,
                  },
                ],
                _metadata:
                  entry?.removepersoncomposer?.[0]?.removepersonwrapper?._metadata || {},
              },
            },
          ];
        }
      } catch {
        console.warn('Remove person layout fetch failed.');
      }
    }

    return finalEntryData;
  } catch (error) {
    console.error('Error building final entry data:', error);
    return null;
  }
};
