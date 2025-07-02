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
  knownFieldIds,
  extractFields,
  initializeFieldState,
  handleSubmit,
  handleChange,
  validateFields,
} from './helpers';
import { useAuth } from '@costcolabs/forge-digital-components';
import RemovePersonModal from './SubComponents/RemovePersonModal';

export const AuthUserCardUI = ({ entryData }: AuthUserCardUIProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isUserSignedIn, isLoading: isLoadingMsal } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submittedUser, setSubmittedUser] = useState<{
    firstName: string;
    lastName: string;
    membershipNumber?: string;
  } | null>(null);
  const [removedUser, setRemovedUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

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
      isUserSignedIn().then(() => {
        setIsLoading(false);
      });
    }
  }, [isLoading, isLoadingMsal, isUserSignedIn]);

  const formik = useFormik({
    initialValues,
    validate: (values) => validateFields(values, requiredFields),
    onSubmit: (values, { setTouched }) =>
      handleSubmit(values, requiredFields, setTouched, (user) => {
        setSubmittedUser(user);
        setRemovedUser(null); // Clear any previous removal
        formik.resetForm();
        setIsExpanded(false);
      }),
  });

  const handleOpenRemoveModal = () => {
    if (submittedUser) {
      setModalUser({
        firstName: submittedUser.firstName,
        lastName: submittedUser.lastName,
      });
      setModalOpen(true);
    }
  };

  const handleRemove = (firstName: string, lastName: string) => {
    setSubmittedUser(null);
    setRemovedUser({ firstName, lastName });
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
      {/* Remove Confirmation Modal */}
      {modalUser && (
        <RemovePersonModal
          isOpen={isModalOpen}
          firstName={modalUser.firstName}
          lastName={modalUser.lastName}
          onClose={() => setModalOpen(false)}
          onRemove={handleRemove}
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

        {/* Notification if person was added */}
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

        {/* Notification if person was removed */}
        {removedUser && (
          <SuccessNotificationContainer>
            <Text variant="t6" sx={{ color: '#155724' }}>
              {removedUser.firstName} {removedUser.lastName} has been removed.
            </Text>
          </SuccessNotificationContainer>
        )}

        {/* Add Account Manager button */}
        {!isExpanded && !submittedUser && (
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              setIsExpanded(true);
              setRemovedUser(null); // Reset removal state
            }}
          >
            {entryData?.primarybuttonlabel || 'Add Account Manager'}
          </Button>
        )}

        {/* Form shown when expanded and no user submitted */}
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
