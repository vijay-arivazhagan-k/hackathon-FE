import React, { useEffect, useState } from 'react';
import { RequestItem } from '../types';
import { Box, Grid, Typography, Card, CardContent, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import RequestCard from '../components/RequestCard';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services';
import { useCategories } from '../hooks';
import dayjs from 'dayjs';

const PendingPage: React.FC = () => {
  const [data, setData] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState('this week');
  const [categoryId, setCategoryId] = useState('all');
  const navigate = useNavigate();

  // Fetch categories
  const { categories } = useCategories(1, 100);

  // Calculate start and end dates based on duration
  const getDateRange = (dur: string) => {
    const today = dayjs();
    let start: string | null = null;
    let end: string | null = today.format('YYYY-MM-DD');

    switch (dur) {
      case 'today':
        start = today.format('YYYY-MM-DD');
        break;
      case 'this week':
        start = today.day() === 0 ? today.startOf('day').format('YYYY-MM-DD') : today.subtract(today.day(), 'day').format('YYYY-MM-DD');
        break;
      case 'last week':
        const lastWeekStart = today.subtract(today.day() + 7, 'day');
        const lastWeekEnd = lastWeekStart.add(6, 'day');
        start = lastWeekStart.format('YYYY-MM-DD');
        end = lastWeekEnd.format('YYYY-MM-DD');
        break;
      case 'this month':
        start = today.startOf('month').format('YYYY-MM-DD');
        break;
      case 'last month':
        const lastMonth = today.subtract(1, 'month');
        start = lastMonth.startOf('month').format('YYYY-MM-DD');
        end = lastMonth.endOf('month').format('YYYY-MM-DD');
        break;
      default:
        start = null;
        end = null;
    }

    return { start, end };
  };

  useEffect(() => { load(); }, [duration, categoryId]);

  async function load(page: number = 1) {
    setLoading(true);
    setError(null);
    try {
      const dateRange = getDateRange(duration);
      const res = await requestService.getRequests(page, 50, {
        status: 'pending',
        start: dateRange.start || undefined,
        end: dateRange.end || undefined,
        category_id: categoryId !== 'all' ? categoryId : undefined,
      });
      setData(res.items);
    } catch (err: any) {
      setError(err?.message || 'Failed to load pending requests');
      console.error('Error loading pending requests:', err);
    } finally {
      setLoading(false);
    }
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

      {/* Filters Section */}
      <Box sx={{ px: 4, py: 3, backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Filter by Duration:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={duration} onChange={(e: SelectChangeEvent) => setDuration(e.target.value)}>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="this week">This Week</MenuItem>
              <MenuItem value="last week">Last Week</MenuItem>
              <MenuItem value="this month">This Month</MenuItem>
              <MenuItem value="last month">Last Month</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary', ml: 2 }}>
            Filter by Category:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={categoryId} onChange={(e: SelectChangeEvent) => setCategoryId(e.target.value)}>
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.ID} value={cat.CategoryName}>
                  {cat.CategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ px: 4, pb: 4, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ maxHeight: 600, overflowY: 'auto', pr: 1 }}>
          {loading ? (
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
                  Loading pending requests...
                </Typography>
              </CardContent>
            </Card>
          ) : error ? (
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
                <Typography variant="h6" sx={{ color: 'error.main', mb: 2 }}>
                  {error}
                </Typography>
              </CardContent>
            </Card>
          ) : data.length === 0 ? (
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
