'use client';

import {
  AuthUserCardUIProps,
  AuthUserCardField,
  UserDetails,
  RemovePersonFields,
} from '#/src/types/pages/AuthUserCard';
import {
  AuthUserCard,
  HeaderContainer,
  SubComponentContainer,
} from './styles';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Divider,
  Text,
  Tooltip,
  Button,
  Skeleton,
  SkeletonVariant,
  Notification,
  Link,
} from '@costcolabs/forge-components';
import { Box, Stack } from '@mui/material';
import { SpaceMd, SpaceXs } from '@costcolabs/forge-design-tokens';
import CostcoFormikForm from '#/src/components/common/CostcoFormikForm'; // ✅ import wrapper
import FormikTextField from '#/src/components/common/FormikTextField'; // ✅ custom field
import {
  extractFields,
  initializeFieldState,
  validateFields,
  knownFieldIds,
} from './helpers';
import { useAuth } from '@costcolabs/forge-digital-components';
import RemovePersonModal from './SubComponents/RemovePersonModal';

export const AuthUserCardUI = ({ entryData, translations }: AuthUserCardUIProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isUserSignedIn, isLoading: isLoadingMsal } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [submittedUser, setSubmittedUser] = useState<UserDetails | null>(null);
  const [removedUser, setRemovedUser] = useState<UserDetails | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState<UserDetails | null>(null);
  const addAccountButtonref = useRef<HTMLButtonElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);

  const layoutSchema: AuthUserCardField[] = useMemo(
    () => entryData?.baseformref?.[0]?.formcontext?.[0]?.formtemplate?.layoutschema || [],
    [entryData]
  );

  const removePersonFields: RemovePersonFields[] = useMemo(
    () => entryData?.removepersoncomposer?.[0]?.removepersonwrapper?.removepersonref || [],
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

  const handleOpenRemoveModal = () => {
    if (submittedUser) {
      setModalUser(submittedUser);
      setModalOpen(true);
    }
  };

  const handleRemove = (userDetails: UserDetails) => {
    setRemovedUser(userDetails);
    setSubmittedUser(null);
    setIsExpanded(false);
    setModalOpen(false);
  };

  const submitLabel = buttons[0]?.button.label;
  const cancelLabel = buttons[1]?.button.label;

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
          userDetails={modalUser}
          onClose={() => setModalOpen(false)}
          onRemove={handleRemove}
          removePersonFields={removePersonFields}
        />
      )}

      <AuthUserCard>
        <HeaderContainer direction="row" justifyContent="space-between">
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

        <Divider sx={{ marginBottom: SpaceMd, marginTop: SpaceXs }} />

        <Stack gap={SpaceMd}>
          {submittedUser && (
            <Stack gap={SpaceMd}>
              <Notification
                ref={successMessageRef}
                message={translations?.alertaddperson}
                severity="success"
              />
              <Stack direction="row" alignItems="flex-start" gap={SpaceXs}>
                <Text bold>
                  {submittedUser.firstName} {submittedUser.lastName}
                </Text>
                <Link
                  aria-label={`Remove ${submittedUser.firstName} ${submittedUser.lastName}`}
                  onClick={handleOpenRemoveModal}
                  underline="always"
                  role="button"
                >
                  <Text variant="t6">{translations?.remove}</Text>
                </Link>
              </Stack>
            </Stack>
          )}

          {removedUser && (
            <Notification message={translations?.alertremoveperson} severity="success" />
          )}

          {!isExpanded && !submittedUser && (
            <Button
              fullWidth
              variant="secondary"
              ref={addAccountButtonref}
              onClick={() => {
                setIsExpanded(true);
                setRemovedUser(null);
                setTimeout(() => {
                  firstInputRef.current?.focus();
                }, 0);
              }}
            >
              {entryData?.primarybuttonlabel}
            </Button>
          )}

          {isExpanded && !submittedUser && (
            <CostcoFormikForm
              initialValues={initialValues}
              validate={(values) => validateFields(values, requiredFields)}
              onSubmit={(values, formikHelpers) => {
                const user: UserDetails = {
                  firstName: values[knownFieldIds.firstName],
                  lastName: values[knownFieldIds.lastName],
                  membershipNumber: values[knownFieldIds.membershipNumber],
                };
                setSubmittedUser(user);
                setRemovedUser(null);
                formikHelpers.resetForm();
                setIsExpanded(false);
                setTimeout(() => successMessageRef.current?.focus(), 0);
              }}
              formProps={{ noValidate: true }}
            >
              <SubComponentContainer>
                {fields.map(({ textfield }, index) => (
                  <FormikTextField
                    key={textfield.fieldid}
                    name={textfield.fieldid}
                    label={textfield.label}
                    isRequired={!!textfield.isverificationrequired}
                    type={textfield.fieldid === knownFieldIds.membershipNumber ? 'number' : 'text'}
                    sx={{ marginBottom: SpaceMd }}
                    inputRef={index === 0 ? firstInputRef : undefined}
                  />
                ))}

                <Stack gap={SpaceMd}>
                  <Button type="submit">{submitLabel}</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsExpanded(false);
                      setTimeout(() => {
                        addAccountButtonref.current?.focus();
                      }, 0);
                    }}
                  >
                    {cancelLabel}
                  </Button>
                </Stack>
              </SubComponentContainer>
            </CostcoFormikForm>
          )}
        </Stack>
      </AuthUserCard>
    </>
  );
};
