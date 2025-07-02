'use client';

import {
  AuthUserCardUIProps,
  AuthUserCardField,
} from '#/src/types/pages/AuthUserCard';
import {
  AuthUserCard,
  HeaderContainer,
  PersonAddedContainer,
  SubComponentContainer,
  SuccessNotificationContainer,
  anchorTextStyle,
  boldBodyStyle,
} from './styles';
import { useState, useMemo, useEffect } from 'react';
import {
  Divider,
  Text,
  Tooltip,
  Button,
  TextField,
  Skeleton,
  SkeletonVariant,
} from '@costcolabs/forge-components';
import { Box } from '@mui/material';
import { SpaceMd } from '@costcolabs/forge-design-tokens';
import { useFormik } from 'formik';

import {
  extractFields,
  initializeFieldState,
  handleSubmit,
  handleChange,
  validateFields,
} from './helpers';
import { useAuth } from '@costcolabs/forge-digital-components';
import RemovePersonModal from './SubComponents/RemovePersonModal';

import { userDetails } from '#/src/types/userDetails'; // ✅ Adjust path as needed

export const AuthUserCardUI = ({ entryData }: AuthUserCardUIProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isUserSignedIn, isLoading: isLoadingMsal } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [submittedUser, setSubmittedUser] = useState<userDetails | null>(null);
  const [removedUser, setRemovedUser] = useState<userDetails | null>(null);
  const [modalUser, setModalUser] = useState<userDetails | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const layoutSchema: AuthUserCardField[] = useMemo(
    () =>
      entryData?.baseformref?.[0]?.formcontext?.[0]?.formtemplate?.layoutschema ||
      [],
    [entryData]
  );

  const { fields, buttons } = extractFields(layoutSchema);
  const { initialValues, requiredFields } = initializeFieldState(fields);

  useEffect(() => {
    if (!isLoadingMsal && isLoading) {
      isUserSignedIn().then(() => setIsLoading(false));
    }
  }, [isLoadingMsal, isLoading, isUserSignedIn]);

  const formik = useFormik({
    initialValues,
    validate: (values) => validateFields(values, requiredFields),
    onSubmit: async (values, { setTouched, validateForm }) => {
      // ✅ Mark all required fields as touched
      const allTouched = requiredFields.reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      );
      setTouched(allTouched, true);

      // ✅ Validate before submission
      const errors = await validateForm();
      if (Object.keys(errors).length > 0) return;

      handleSubmit(values, requiredFields, setTouched, (user: userDetails) => {
        setSubmittedUser(user);
        setRemovedUser(null);
        formik.resetForm();
        setIsExpanded(false);
      });
    },
  });

  const handleOpenRemoveModal = () => {
    if (submittedUser) {
      setModalUser(submittedUser);
      setModalOpen(true);
    }
  };

  const handleRemove = (user: userDetails) => {
    setSubmittedUser(null);
    setRemovedUser(user);
    setIsExpanded(false);
    setModalOpen(false);
  };

  const submitLabel = buttons[0]?.button.label || 'Submit';
  const cancelLabel = buttons[1]?.button.label || 'Cancel';

  if (isLoading) {
    return (
      <AuthUserCard>
        <Skeleton variant={SkeletonVariant.TextBody} width={343} />
      </AuthUserCard>
    );
  }

  return (
    <>
      {modalUser && (
        <RemovePersonModal
          isOpen={isModalOpen}
          firstName={modalUser.firstName}
          lastName={modalUser.lastName}
          onClose={() => setModalOpen(false)}
          onRemove={() => handleRemove(modalUser)}
        />
      )}

      <AuthUserCard>
        <HeaderContainer>
          <Text variant="t3" bold>
            {entryData?.title}
          </Text>
          <Tooltip
            position="right"
            uniqueId="MMC"
            buttonAriaLabel={entryData?.title || ''}
            tooltipId="MMC_Tooltip"
            content={entryData?.tooltip}
          />
        </HeaderContainer>

        <Divider sx={{ marginBottom: SpaceMd, marginTop: '8px' }} />

        {submittedUser && (
          <>
            <SuccessNotificationContainer>
              <Text variant="t6" sx={{ color: '#155724' }}>
                Person has been added.
              </Text>
            </SuccessNotificationContainer>
            <PersonAddedContainer>
              <Text sx={boldBodyStyle}>
                {submittedUser.firstName} {submittedUser.lastName}
              </Text>
              <Text
                sx={anchorTextStyle}
                onClick={handleOpenRemoveModal}
                style={{ cursor: 'pointer' }}
              >
                Remove
              </Text>
            </PersonAddedContainer>
          </>
        )}

        {removedUser && !submittedUser && (
          <SuccessNotificationContainer>
            <Text variant="t6" sx={{ color: '#155724' }}>
              {removedUser.firstName} {removedUser.lastName} has been removed.
            </Text>
          </SuccessNotificationContainer>
        )}

        {!isExpanded && !submittedUser && (
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              setIsExpanded(true);
              setRemovedUser(null);
            }}
          >
            {entryData?.primarybuttonlabel || 'Add Account Manager'}
          </Button>
        )}

        {isExpanded && !submittedUser && (
          <form onSubmit={formik.handleSubmit}>
            <SubComponentContainer>
              {fields.map(({ textfield }) => {
                const { fieldid, label } = textfield;
                const isTouched = formik.touched[fieldid];
                const error = formik.errors[fieldid];
                const isError = Boolean(isTouched && error);

                return (
                  <TextField
                    key={fieldid}
                    inputLabelId={fieldid}
                    uniqueId={fieldid}
                    id={fieldid}
                    label={label}
                    value={formik.values[fieldid] || ''}
                    onChange={(e) =>
                      handleChange(e, formik.setFieldValue, fieldid)
                    }
                    onBlur={() => formik.setFieldTouched(fieldid, true)}
                    isError={isError}
                    errorText={error || ''}
                    isRequired
                    type="text"
                    sx={{ marginBottom: SpaceMd }}
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
      </AuthUserCard>
    </>
  );
};
