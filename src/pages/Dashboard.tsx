import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, FormControl, Select, MenuItem, Card, CardContent } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import RequestCard from '../components/RequestCard';
import InsightsCard from '../components/InsightsCard';
import { useRequests, useInsights } from '../hooks';
import { DURATION_OPTIONS } from '../utils/constants';

const Dashboard: React.FC = () => {
  const [duration, setDuration] = useState('this week');
  const [status, setStatus] = useState('All');
  const navigate = useNavigate();

  const { requests, loadRequests } = useRequests(1, 20, { status });
  const { insights, loadInsights } = useInsights(duration);

  useEffect(() => {
    loadRequests(1, 20, { status });
    loadInsights(duration);
  }, [duration, status]);

  return (
    <Box>
      {/* Banner Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #24114f 0%, #4a2a7a 50%, #1a0a3a 100%)',
          color: 'white',
          py: 4,
          px: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            mb: 1,
          }}
        >
          AI Invoice Processing
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            fontWeight: 400,
          }}
        >
          Intelligent Document Processing & Approval System
        </Typography>
      </Box>

      {/* Filters Section */}
      <Box sx={{ px: 4, py: 3, backgroundColor: 'white' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#24114f' }}>
            Dashboard Overview
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={duration} onChange={(e: SelectChangeEvent) => setDuration(e.target.value)}>
              {DURATION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Box>

      {/* Insights Card */}
      <InsightsCard
        title="Processing Insights"
        metrics={[
          {
            value: insights?.total ?? 0,
            label: 'Total Requests',
            color: '#24114f',
            bgColor: '#f8f9fa',
            borderColor: '#e9ecef',
          },
          {
            value: insights?.approved ?? 0,
            label: 'Approved',
            color: '#4caf50',
            bgColor: '#e8f5e8',
            borderColor: '#c8e6c9',
          },
          {
            value: insights?.rejected ?? 0,
            label: 'Rejected',
            color: '#f44336',
            bgColor: '#ffebee',
            borderColor: '#ffcdd2',
          },
          {
            value: insights?.pending ?? 0,
            label: 'Pending',
            color: '#ff9800',
            bgColor: '#fff3e0',
            borderColor: '#ffcc02',
          },
        ]}
      />
      {/* Status Filter */}
      <Box sx={{ px: 4, pb: 3, backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Filter by Status:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={status} onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}>
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Requests Grid */}
      <Box sx={{ px: 4, pb: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#24114f', mb: 3 }}>
          Recent Requests
        </Typography>
        <Box sx={{ maxHeight: 600, overflowY: 'auto', pr: 1 }}>
          {requests.length === 0 ? (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(36, 17, 79, 0.08)',
                border: '1px solid rgba(36, 17, 79, 0.1)',
                textAlign: 'center',
                py: 8,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                  No requests found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  There are no requests matching your current filters. Try adjusting your search criteria.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {requests.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <RequestCard item={item} onClick={() => navigate(`/requests/${item.id}`)} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
