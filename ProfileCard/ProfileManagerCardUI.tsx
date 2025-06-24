'use client';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
  TextField,
  Button,
  Divider,
  Text,
  Tooltip,
} from '@costcolabs/forge-components';
import { Box } from '@mui/material';
import {
  ProfileManagerCard,
  MMCHeaderContainer,
  SubComponentContainer,
} from '../styles';
import { ProfileManagerCardUIProps } from '#/src/types/pages/manageMembership';
import { SpaceXs } from '@costcolabs/forge-design-tokens';

export const ProfileManagerCardUI = ({ entryData }: ProfileManagerCardUIProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [submittedUser, setSubmittedUser] = useState<{
    firstName: string;
    lastName: string;
    membershipNumber?: string;
  } | null>(null);

  const layoutSchema = entryData?.formcontext?.[0]?.formtemplate?.layoutschema || [];

  const fields = layoutSchema.filter((item) => item.textwrapper);
  const buttons = layoutSchema.filter((item) => item.button_wrapper);

  const initialValues: Record<string, string> = {};
  const requiredFields: Record<string, string> = {};

  let firstNameFieldUid = '';
  let lastNameFieldUid = '';
  let membershipNumberFieldUid = '';

  fields.forEach((field) => {
    const uid = field.textwrapper!._metadata.uid;
    const label = field.textwrapper!.label.toLowerCase();

    initialValues[uid] = '';

    if (field.textwrapper!.isvalidationrequired) {
      requiredFields[uid] = field.textwrapper!.errormessage || 'Required';
    }

    if (label.includes('first name')) {
      firstNameFieldUid = uid;
    } else if (label.includes('last name')) {
      lastNameFieldUid = uid;
    } else if (label.includes('membership')) {
      membershipNumberFieldUid = uid;
    }
  });

  const submitLabel = buttons[0]?.button_wrapper?.label || 'Submit';
  const cancelLabel = buttons[1]?.button_wrapper?.label || 'Cancel';

  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    Object.entries(requiredFields).forEach(([uid, message]) => {
      if (!values[uid]?.trim()) {
        errors[uid] = message;
      }
    });
    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values, { setTouched }) => {
      const errors = validate(values);

      if (Object.keys(errors).length > 0) {
        // ✅ Mark all required fields as touched
        const touchedMap = Object.keys(requiredFields).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
        setTouched(touchedMap);
        return;
      }

      const firstName = values[firstNameFieldUid] || '';
      const lastName = values[lastNameFieldUid] || '';
      const membershipNumber = values[membershipNumberFieldUid] || '';

      try {
        // 🔧 Placeholder for backend API integration
        // await api.addAccountManager(values);

        setSubmittedUser({ firstName, lastName, membershipNumber });
        formik.resetForm();
        setIsExpanded(false);
      } catch (error) {
        console.error('Submission error:', error);
      }
    },
  });

  // 🕒 Auto-dismiss success message after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submittedUser) {
      timer = setTimeout(() => {
        setSubmittedUser(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [submittedUser]);

  return (
    <ProfileManagerCard>
      <MMCHeaderContainer>
        <Text variant="t3" bold>
          {entryData.title}
        </Text>
        {entryData.tooltip && (
          <Tooltip
            position="right"
            uniqueId="MMC"
            buttonAriaLabel={entryData.title}
            tooltipId="MMC_Tooltip"
            content={entryData.tooltip}
          />
        )}
      </MMCHeaderContainer>

      <Divider sx={{ marginBottom: SpaceXs, marginTop: '8px' }} />

      {/* ✅ Success Message */}
      {submittedUser && (
        <Box
          sx={{
            backgroundColor: '#d4edda',
            border: '1px solid green',
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '6px',
          }}
        >
          <Text variant="t6" style={{ color: '#155724' }}>
            Person has been added.
          </Text>
          <Box sx={{ marginTop: '8px' }}>
            <Text bold>
              {submittedUser.firstName} {submittedUser.lastName}
            </Text>
            {submittedUser.membershipNumber && (
              <Text variant="t6" style={{ fontWeight: 400 }}>
                Membership #: {submittedUser.membershipNumber}
              </Text>
            )}
            <Button
              variant="link"
              onClick={() => setSubmittedUser(null)}
              style={{
                color: '#007bff',
                textDecoration: 'underline',
                fontWeight: 'normal',
                marginTop: '8px',
              }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      )}

      {/* ✅ Show Add button initially */}
      {!submittedUser && !isExpanded && (
        <Button fullWidth variant="secondary" onClick={() => setIsExpanded(true)}>
          {submitLabel}
        </Button>
      )}

      {/* ✅ Form - only when expanded and not yet submitted */}
      {isExpanded && !submittedUser && (
        <form onSubmit={formik.handleSubmit}>
          <SubComponentContainer>
            {fields.map((field) => {
              const { label, _metadata } = field.textwrapper!;
              const name = _metadata.uid;
              const isError = Boolean(formik.touched[name] && formik.errors[name]);
              const errorText = isError ? formik.errors[name] : '';

              return (
                <TextField
                  key={name}
                  sx={{ marginTop: '16px', marginBottom: '16px' }}
                  inputLabelId={name}
                  name={name}
                  label={label}
                  value={formik.values[name] || ''}
                  onChange={(e) => formik.setFieldValue(name, e.target.value)}
                  onBlur={() => formik.setFieldTouched(name, true)} // ensures touched
                  isError={isError}
                  errorText={errorText}
                  id={name}
                  isRequired={field.textwrapper!.isvalidationrequired}
                  type="text"
                  uniqueId={`MMC_${name}`}
                />
              );
            })}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Button type="submit">{submitLabel}</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  formik.resetForm();
                  setIsExpanded(false);
                }}
              >
                {cancelLabel}
              </Button>
            </Box>
          </SubComponentContainer>
        </form>
      )}
    </ProfileManagerCard>
  );
};
