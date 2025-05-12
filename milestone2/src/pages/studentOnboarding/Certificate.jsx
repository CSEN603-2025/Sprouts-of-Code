import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import './Certificate.css';

const CertificatePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
  border: '2px solid #ffd700',
  borderRadius: '8px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/certificate-pattern.png")',
    opacity: 0.1,
    pointerEvents: 'none',
  }
}));

const Certificate = ({ workshop, student, onDownload }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <CertificatePaper elevation={3} className="certificate">
      <Box className="certificate-content">
        <Typography variant="h4" className="certificate-title" gutterBottom>
          Certificate of Completion
        </Typography>
        
        <Typography variant="h6" className="certificate-subtitle" gutterBottom>
          This is to certify that
        </Typography>
        
        <Typography variant="h5" className="student-name" gutterBottom>
          {student?.name || 'Student Name'}
        </Typography>
        
        <Typography variant="body1" className="certificate-text" gutterBottom>
          has successfully completed the workshop
        </Typography>
        
        <Typography variant="h5" className="workshop-name" gutterBottom>
          {workshop?.title || 'Workshop Title'}
        </Typography>
        
        <Box className="certificate-details">
          <Typography variant="body2" className="workshop-details">
            Conducted by: {workshop?.speaker || 'Speaker Name'}
          </Typography>
          <Typography variant="body2" className="workshop-details">
            Date: {currentDate}
          </Typography>
        </Box>
      </Box>
    </CertificatePaper>
  );
};

export default Certificate; 