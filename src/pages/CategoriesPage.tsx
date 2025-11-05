
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api';
import { Category } from '../types';
import { Box, Grid, Typography, Card, CardContent, Button } from '@mui/material';


const CategoriesPage: React.FC = () => {
  const [data, setData] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  async function load(page: number = 1) {
    const res = await fetchCategories(page, 100);
    setData(res.items);
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #24114f 0%, #4a2a7a 50%, #1a0a3a 100%)',
          color: 'white',
          py: 3,
          px: 4,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(36, 17, 79, 0.08)',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            mb: 1,
            letterSpacing: 1,
          }}
        >
          Category Management
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            fontWeight: 400,
            mb: 2,
          }}
        >
          Configure Approval Limits & Settings
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" sx={{ background: '#24114f', color: '#fff', fontWeight: 600 }} onClick={() => navigate('/categories/add')}>
          Add Category
        </Button>
      </Box>
      {data.length === 0 ? (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography>
              There are currently no categories configured in the system. Please contact your administrator to set up categories.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1, px: 1 }}>
          {data.map((cat: Category) => (
            <Grid item xs={12} md={6} lg={4} key={cat.ID}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(36, 17, 79, 0.15)',
                  },
                }}
                onClick={() => navigate(`/categories/${cat.ID}`)}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#24114f', mb: 2 }}>
                    {cat.CategoryName}
                  </Typography>
                  <Typography>Description: {cat.CategoryDescription}</Typography>
                  <Typography>Max Amount: {cat.MaximumAmount}</Typography>
                  <Typography>Request Count: {cat.RequestCount}</Typography>
                  <Typography>Status: {cat.Status ? 'Enabled' : 'Disabled'}</Typography>
                  {cat.Document && (
                    <Typography>Document: <a href={cat.Document} target="_blank" rel="noopener noreferrer">View</a></Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
export default CategoriesPage;
