const successMessageRef = useRef<HTMLDivElement>(null);


handleSubmit(values, requiredFields, setTouched, (user: userDetails) => {
  setSubmittedUser(user);
  setRemovedUser(null);
  formik.resetForm();
  setIsExpanded(false);

  // ✅ Move focus to success message
  setTimeout(() => {
    successMessageRef.current?.focus();
  }, 0);
});


<SuccessNotificationContainer
  ref={successMessageRef}
  tabIndex={-1}
  aria-live="polite"
  role="status"
>
  <Text variant="t6" sx={{ color: '#155724' }}>
    Person has been added.
  </Text>
</SuccessNotificationContainer>


<Text
  sx={anchorTextStyle}
  role="button"
  tabIndex={0}
  aria-label={`Remove ${submittedUser.firstName} ${submittedUser.lastName}`}
  onClick={handleOpenRemoveModal}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleOpenRemoveModal();
      e.preventDefault();
    }
  }}
  style={{ cursor: 'pointer' }}
>
  Remove
</Text>
