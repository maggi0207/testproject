import styled from 'styled-components';
import { Card, Box } from '@mui/material';

export const ProfileManagerCard = styled(Card)`
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
`;

export const ProfileManagerHeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FormBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
