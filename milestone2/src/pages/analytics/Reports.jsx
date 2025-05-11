// src/components/Reports.jsx
import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { usePendingCompany } from '../../context/PendingCompanyContext';
import { useInternships } from '../../context/InternshipContext';

import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Stack,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';

const Reports = () => {
  const { companies } = useCompany();
  const { pendingCompanies } = usePendingCompany();
  const { internships } = useInternships();

  const [reportType, setReportType] = useState('internship');
  const [timeFrame, setTimeFrame] = useState('past-12-months');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const [savedReports, setSavedReports] = useState([
    { id: 1, name: 'Internship Performance Q2 2023', type: 'internship', date: '2023-07-01', format: 'pdf', size: '2.4 MB' },
    { id: 2, name: 'Employer Engagement Report', type: 'employer', date: '2023-06-15', format: 'excel', size: '1.8 MB' },
    { id: 3, name: 'Student Placement Analysis', type: 'student', date: '2023-05-30', format: 'pdf', size: '3.2 MB' },
  ]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let reportData = {}, reportName = '';
      switch (reportType) {
        case 'internship':
          reportData = {
            totalInternships: internships.length,
            activeInternships: internships.filter(i => i.status === 'active').length,
            completedInternships: internships.filter(i => i.status === 'completed').length,
            internshipsByCompany: companies.map(c => ({
              company: c.name,
              count: internships.filter(i => i.employer === c.name).length
            }))
          };
          reportName = 'Internship Performance Report';
          break;
        case 'employer':
          reportData = {
            totalEmployers: companies.length,
            pendingApprovals: pendingCompanies.length,
            employersByIndustry: companies.reduce((acc, c) => {
              acc[c.industry] = (acc[c.industry] || 0) + 1;
              return acc;
            }, {})
          };
          reportName = 'Employer Engagement Report';
          break;
        case 'student':
          reportData = {
            totalStudents: 245,
            placementRate: '85%',
            averageDuration: '3.5 months'
          };
          reportName = 'Student Analytics Report';
          break;
        default:
          reportData = {};
          reportName = 'General Report';
      }

      const newReport = {
        id: savedReports.length + 1,
        name: `${reportName} ${new Date().toLocaleDateString()}`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        format,
        size: `${(Math.random() * 5).toFixed(1)} MB`,
        data: reportData
      };

      setSavedReports([newReport, ...savedReports]);
      setIsGenerating(false);
    }, 2000);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 3,
      renderCell: ({ value, row }) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {row.format === 'pdf'
            ? <PictureAsPdfIcon color="error" />
            : row.format === 'excel'
              ? <InsertChartIcon color="success" />
              : <TableChartIcon color="info" />
          }
          <Box>
            <Typography variant="body2">{value}</Typography>
            <Typography variant="caption" color="textSecondary">{row.size}</Typography>
          </Box>
        </Stack>
      )
    },
    { field: 'date', headerName: 'Date', flex: 1 },
    {
      field: 'format',
      headerName: 'Format',
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          component="span"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor:
              value === 'pdf' ? 'error.light'
              : value === 'excel' ? 'success.light'
              : 'info.light',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {value}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      sortable: false,
      renderCell: () => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
          <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" mb={4}>Reports</Typography>

      <Grid container spacing={4}>
        {/* Generate */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Generate New Report" />
            <CardContent>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    label="Report Type"
                    onChange={e => setReportType(e.target.value)}
                  >
                    <MenuItem value="internship">Internship Performance</MenuItem>
                    <MenuItem value="student">Student Analytics</MenuItem>
                    <MenuItem value="employer">Employer Engagement</MenuItem>
                    <MenuItem value="department">Department Analysis</MenuItem>
                    <MenuItem value="feedback">Feedback Summary</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Time Frame</InputLabel>
                  <Select
                    value={timeFrame}
                    label="Time Frame"
                    onChange={e => setTimeFrame(e.target.value)}
                  >
                    <MenuItem value="past-12-months">Past 12 Months</MenuItem>
                    <MenuItem value="past-6-months">Past 6 Months</MenuItem>
                    <MenuItem value="past-3-months">Past 3 Months</MenuItem>
                    <MenuItem value="current-year">Current Year</MenuItem>
                    <MenuItem value="previous-year">Previous Year</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={format}
                    label="Format"
                    onChange={e => setFormat(e.target.value)}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating…' : 'Generate Report'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Saved Reports */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Saved Reports" />
            <CardContent>
              <Box sx={{ width: '100%' }}>
                <DataGrid
                  rows={savedReports}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  autoHeight
                  getRowId={row => row.id}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
