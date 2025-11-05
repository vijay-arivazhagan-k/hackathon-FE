import React, { useEffect, useState } from 'react';
import { fetchPending } from '../api';
import { RequestItem } from '../types';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import RequestCard from '../components/RequestCard';
import { useNavigate } from 'react-router-dom';

const PendingPage: React.FC = () => {
  const [data, setData] = useState<RequestItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  async function load(page: number = 1) {
    const res = await fetchPending(page, 50);
    setData(res.items);
  }

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #24114f 0%, #4a2a7a 50%, #1a0a3a 100%)',
          color: 'white',
          py: 3,
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
          Pending Requests
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            fontWeight: 400,
          }}
        >
          Awaiting Approval & Review
        </Typography>
      </Box>

      <Box sx={{ px: 4, pb: 4, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ maxHeight: 600, overflowY: 'auto', pr: 1 }}>
          {data.length === 0 ? (
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
                  No pending requests
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  All requests have been processed. There are currently no pending items awaiting approval.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {data.map((item: RequestItem) => (
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

export default PendingPage;
