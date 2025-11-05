import React, { useEffect, useState } from 'react';
import { fetchReports, exportReports, fetchCategories } from '../api';
import { RequestItem, Category } from '../types';
import { Box, Grid, Typography, FormControl, Select, MenuItem, Card, CardContent, Button } from '@mui/material';
import RequestCard from '../components/RequestCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import InsightsCard from '../components/InsightsCard';

const ReportPage: React.FC = () => {
  // Calculate week start (Sunday) and today
  const today = dayjs();
  const weekStart = today.day() === 0 ? today.startOf('day') : today.subtract(today.day(), 'day').startOf('day');
  const [start, setStart] = useState<Dayjs | null>(weekStart);
  const [end, setEnd] = useState<Dayjs | null>(today);
  const [status, setStatus] = useState('all');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [data, setData] = useState<RequestItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => { load(); loadCategories(); }, [start, end, status, categoryId]);
  // On first mount, ensure API is called with default dates
  useEffect(() => {
    load();
    loadCategories();
    // eslint-disable-next-line
  }, []);

  async function load(page: number = 1) {
    const params: any = { page, page_size: 50 };
    if (start) params.start = start.toISOString();
    if (end) params.end = end.toISOString();
    if (status) params.status = status;
    if (categoryId) params.category_id = categoryId;
    const res = await fetchReports(params);
    setData(res.items);
  }

  async function loadCategories() {
    const res = await fetchCategories(1, 100);
    setCategories(res.items);
  }

  const approvedTotal = data.filter((d: RequestItem) => d.current_status === 'Approved').reduce((acc: number, cur: RequestItem) => acc + (cur.total_amount || 0), 0);

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
          Reports & Analytics
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            fontWeight: 400,
          }}
        >
          Comprehensive Invoice Processing Insights
        </Typography>
      </Box>

      <Box
        sx={{
          background: 'white',
          borderRadius: 2,
          p: 3,
          mb: 3,
          boxShadow: '0 4px 20px rgba(36, 17, 79, 0.08)',
          border: '1px solid rgba(36, 17, 79, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#24114f', mb: 2 }}>
          Filter Options
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <DatePicker
                label="Start Date"
                value={start}
                onChange={(newValue) => setStart(newValue)}
                slotProps={{ textField: { size: 'small', sx: { minWidth: 200 } } }}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label="End Date"
                value={end}
                onChange={(newValue) => setEnd(newValue)}
                slotProps={{ textField: { size: 'small', sx: { minWidth: 200 } } }}
              />
            </Grid>
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select value={status} onChange={(e) => setStatus(String(e.target.value))}>
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value === '' ? undefined : Number(e.target.value))} displayEmpty>
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((c: Category) => <MenuItem key={c.ID} value={c.ID}>{c.CategoryName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>

      <InsightsCard
        title="Summary Statistics"
        metrics={[
          {
            value: data.length,
            label: 'Total',
            color: '#24114f',
            bgColor: '#f8f9fa',
            borderColor: '#e9ecef',
          },
          {
            value: data.filter((d: RequestItem) => d.current_status === 'Approved').length,
            label: 'Approved',
            color: '#4caf50',
            bgColor: '#e8f5e8',
            borderColor: '#c8e6c9',
          },
          {
            value: data.filter((d: RequestItem) => d.current_status === 'Rejected').length,
            label: 'Rejected',
            color: '#f44336',
            bgColor: '#ffebee',
            borderColor: '#ffcdd2',
          },
          {
            value: data.filter((d: RequestItem) => d.current_status === 'Pending').length,
            label: 'Pending',
            color: '#ff9800',
            bgColor: '#fff3e0',
            borderColor: '#ffcc02',
          },
          {
            value: `₹${approvedTotal.toFixed(2)}`,
            label: 'Approved Total',
            color: '#9c27b0',
            bgColor: '#f3e5f5',
            borderColor: '#ce93d8',
          },
        ]}
      />

      {/* Export Button */}
      <Box sx={{ px: 4, pb: 3, backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => exportReports({
              start: start?.toISOString(),
              end: end?.toISOString(),
              status,
              category_id: categoryId
            })}
            disabled={data.length === 0}
            sx={{
              background: 'linear-gradient(135deg, #24114f 0%, #4a2a7a 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1a0a3a 0%, #24114f 100%)',
              },
              '&:disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e',
              },
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Reports List */}
      <Box sx={{ px: 4, pb: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#24114f', mb: 3 }}>
          Report Details
        </Typography>
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
                  No reports found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  There are no reports matching your current filters. Try adjusting your search criteria or date range.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {data.map((item: RequestItem) => (
                <Grid item xs={12} key={item.id}>
                  <RequestCard item={item} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReportPage;
