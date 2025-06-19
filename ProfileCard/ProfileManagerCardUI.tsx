'use client';
import React, { useState } from 'react';
import {
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Divider,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useFormik } from 'formik';
import {
  ProfileManagerCard,
  ProfileManagerHeaderContainer,
  FormBox,
} from '../styles/profileManager.styles';

interface ContentstackField {
  textwrapper?: {
    label: string;
    isvalidationrequired: boolean;
    errormessage?: string;
    _metadata: { uid: string };
  };
  button_wrapper?: {
    label: string;
    _metadata: { uid: string };
  };
}

interface ContentstackFormTemplate {
  layoutschema: ContentstackField[];
  _metadata?: { uid: string };
}

interface ContentstackSchema {
  title: string;
  formcontext: [
    {
      formtemplate: ContentstackFormTemplate;
    }
  ];
}

interface Props {
  entry: ContentstackSchema;
  onSubmit?: (data: Record<string, string>) => void;
}

export const ProfileManagerCardUI: React.FC<Props> = ({ entry, onSubmit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const layoutSchema = entry?.formcontext?.[0]?.formtemplate?.layoutschema || [];

  const fields = layoutSchema.filter((item) => item.textwrapper);
  const buttons = layoutSchema.filter((item) => item.button_wrapper);

  const initialValues: Record<string, string> = {};
  const requiredFields: Record<string, string> = {};

  fields.forEach((field) => {
    const uid = field.textwrapper!._metadata.uid;
    initialValues[uid] = '';
    if (field.textwrapper!.isvalidationrequired) {
      requiredFields[uid] = field.textwrapper!.errormessage || 'Required';
    }
  });

  const submitLabel =
    buttons.find((b) => b.button_wrapper?.label.toLowerCase().includes('add'))?.button_wrapper?.label ||
    'Submit';
  const cancelLabel =
    buttons.find((b) => b.button_wrapper?.label.toLowerCase().includes('cancel'))?.button_wrapper?.label ||
    'Cancel';

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
    onSubmit: (values) => {
      onSubmit?.(values);
      console.log('Submitted:', values);
    },
  });

  return (
    <ProfileManagerCard>
      <ProfileManagerHeaderContainer>
        <Typography variant="h6" fontWeight="bold">
          {entry.title}
        </Typography>
        <Tooltip title="Info about this form">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ProfileManagerHeaderContainer>

      <Divider sx={{ my: 2 }} />

      {!isExpanded ? (
        <Button variant="contained" fullWidth onClick={() => setIsExpanded(true)}>
          {submitLabel}
        </Button>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <FormBox>
            {fields.map((field) => {
              const { label, _metadata } = field.textwrapper!;
              const name = _metadata.uid;
              return (
                <TextField
                  key={name}
                  name={name}
                  label={label}
                  fullWidth
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched[name] && formik.errors[name])}
                  helperText={formik.touched[name] && formik.errors[name]}
                />
              );
            })}
            <Button variant="contained" type="submit">
              {submitLabel}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                formik.resetForm();
                setIsExpanded(false);
              }}
            >
              {cancelLabel}
            </Button>
          </FormBox>
        </form>
      )}
    </ProfileManagerCard>
  );
};
