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

import CostcoFormikForm from '#/src/components/common/CostcoFormikForm';
import FormikTextField from '#/src/components/common/FormikTextField';

import {
  extractFields,
  initializeFieldState,
  handleSubmit,
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
  const [modalUser, setModalUser] = useState<UserDetails | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const addAccountButtonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
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
      isUserSignedIn().then(() => setIsLoading(false));
    }
  }, [isLoading, isLoadingMsal, isUserSignedIn]);

  const submitLabel = buttons[0]?.button.label || 'Submit';
  const cancelLabel = buttons[1]?.button.label || 'Cancel';

  const handleFormSubmit = async (
    values: Record<string, string>,
    helpers: any
  ) => {
    await handleSubmit(values, requiredFields, helpers.setTouched, (user: UserDetails) => {
      setSubmittedUser(user);
      setRemovedUser(null);
      helpers.resetForm();
      setIsExpanded(false);
      setTimeout(() => successMessageRef.current?.focus(), 0);
    });
  };

  const handleOpenRemoveModal = () => {
    if (submittedUser) {
      setModalUser(submittedUser);
      setModalOpen(true);
    }
  };

  const handleRemove = (user: UserDetails) => {
    setRemovedUser(user);
    setSubmittedUser(null);
    setIsExpanded(false);
    setModalOpen(false);
  };

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
        <HeaderContainer direction={'row'} justifyContent={'space-between'}>
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
              <Notification ref={successMessageRef} message={translations?.alertaddperson} severity="success" />
              <Stack direction="row" gap={SpaceXs} alignItems="center">
                <Text bold>
                  {submittedUser.firstName} {submittedUser.lastName}
                </Text>
                <Link
                  aria-label={`${translations?.remove} ${submittedUser.firstName} ${submittedUser.lastName}`}
                  onClick={handleOpenRemoveModal}
                  underline="always"
                  role="button"
                >
                  <Text variant="t6">{translations?.remove}</Text>
                </Link>
              </Stack>
            </Stack>
          )}

          {removedUser && !submittedUser && (
            <Notification message={translations?.alertremoveperson} severity="success" />
          )}

          {!isExpanded && !submittedUser && (
            <Button
              fullWidth
              variant="secondary"
              ref={addAccountButtonRef}
              onClick={() => {
                setIsExpanded(true);
                setRemovedUser(null);
                setTimeout(() => firstInputRef.current?.focus(), 0);
              }}
            >
              {entryData?.primarybuttonlabel}
            </Button>
          )}

          {isExpanded && !submittedUser && (
            <CostcoFormikForm
              initialValues={initialValues}
              onSubmit={handleFormSubmit}
              validateOnChange={false}
              validateOnBlur={false}
              formProps={{ noValidate: true }}
            >
              {(formik) => (
                <SubComponentContainer>
                  {fields.map(({ textfield }, index) => {
                    const { fieldid, label } = textfield;

                    return (
                      <FormikTextField
                        key={fieldid}
                        name={fieldid}
                        label={label}
                        uniqueId={fieldid}
                        inputAriaLabel={label}
                        isRequired
                        type={fieldid === knownFieldIds.membershipNumber ? 'number' : 'text'}
                        inputRef={index === 0 ? firstInputRef : undefined}
                        sx={{ marginBottom: SpaceMd }}
                      />
                    );
                  })}

                  <Stack gap={SpaceMd}>
                    <Button type="submit">{submitLabel}</Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        formik.resetForm();
                        setIsExpanded(false);
                        setTimeout(() => addAccountButtonRef.current?.focus(), 0);
                      }}
                    >
                      {cancelLabel}
                    </Button>
                  </Stack>
                </SubComponentContainer>
              )}
            </CostcoFormikForm>
          )}
        </Stack>
      </AuthUserCard>
    </>
  );
};
