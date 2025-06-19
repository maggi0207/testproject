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

export interface FieldConfig {
  label: string;
  name: string;
  required?: boolean;
  errormessage?: string;
  autocomplete?: string;
}

export interface ProfileManagerEntry {
  title: string;
  tooltip?: string;
  buttonLabel: string;
  cancelLabel?: string;
  fields: FieldConfig[];
}

interface Props {
  entry: ProfileManagerEntry;
  onSubmit?: (data: any) => void;
}

export const ProfileManagerCardUI: React.FC<Props> = ({ entry, onSubmit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const initialValues = entry.fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {} as Record<string, string>);

  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    entry.fields.forEach((field) => {
      if (field.required && !values[field.name]?.trim()) {
        errors[field.name] = field.errormessage || 'Required';
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
        {entry.tooltip && (
          <Tooltip title={entry.tooltip}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </ProfileManagerHeaderContainer>

      <Divider sx={{ my: 2 }} />

      {!isExpanded ? (
        <Button variant="contained" fullWidth onClick={() => setIsExpanded(true)}>
          {entry.buttonLabel}
        </Button>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <FormBox>
            {entry.fields.map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                fullWidth
                autoComplete={field.autocomplete || 'off'}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched[field.name] && !!formik.errors[field.name]}
                helperText={formik.touched[field.name] && formik.errors[field.name]}
              />
            ))}
            <Button variant="contained" type="submit">
              {entry.buttonLabel}
            </Button>
            {entry.cancelLabel && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  formik.resetForm();
                  setIsExpanded(false);
                }}
              >
                {entry.cancelLabel}
              </Button>
            )}
          </FormBox>
        </form>
      )}
    </ProfileManagerCard>
  );
};
