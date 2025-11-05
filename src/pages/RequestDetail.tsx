import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRequest, updateRequestStatus } from '../api';
import { RequestItem } from '../types';
import { Box, Typography, Chip, Card, CardContent, TextField, FormControl, Select, MenuItem, Button, Grid, Divider } from '@mui/material';

const RequestDetail: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<RequestItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Pending');
  const [comments, setComments] = useState('');

  useEffect(() => { load(); }, [id]);

  async function load() {
    if (!id) return;
    const r = await fetchRequest(Number(id));
    setData(r);
    setNewStatus(r.current_status);
  }

  async function save() {
    if (!id || !comments) return;
    const updated = await updateRequestStatus(Number(id), newStatus, comments);
    setData(updated);
    setComments('');
  }

  if (!data) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Typography variant="h6" sx={{ color: '#24114f' }}>Loading request details...</Typography>
    </Box>
  );

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
          Request #{data.id}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            fontWeight: 400,
          }}
        >
          Detailed Invoice Processing Information
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(36, 17, 79, 0.15)',
              border: '1px solid rgba(36, 17, 79, 0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#24114f', mb: 3 }}>
                Request Details
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#24114f' }}>
                      {data.user_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Category
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {data.category_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#24114f', fontSize: '1.1rem' }}>
                      ${data.total_amount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Current Status
                    </Typography>
                    <Chip
                      label={data.current_status}
                      sx={{
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        backgroundColor: data.current_status === 'Approved' ? '#4caf50' :
                                       data.current_status === 'Rejected' ? '#f44336' : '#ff9800',
                        color: 'white',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Approval Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {data.approvaltype}
                    </Typography>
                  </Grid>
                  {data.comments && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Comments
                      </Typography>
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        {data.comments}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(36, 17, 79, 0.15)',
              border: '1px solid rgba(36, 17, 79, 0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#24114f', mb: 3 }}>
                Update Status
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  New Status
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(String(e.target.value))}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Comments
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add your comments here..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
              <Button
                variant="contained"
                fullWidth
                disabled={!comments}
                onClick={save}
                sx={{
                  background: 'linear-gradient(135deg, #24114f 0%, #4a2a7a 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a0a3a 0%, #24114f 100%)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                  },
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(36, 17, 79, 0.15)',
            border: '1px solid rgba(36, 17, 79, 0.1)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#24114f', mb: 3 }}>
              Approval History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              History functionality will be implemented with backend integration.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RequestDetail;
