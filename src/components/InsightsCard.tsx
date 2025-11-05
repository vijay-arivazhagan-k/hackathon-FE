import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

interface MetricItem {
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface InsightsCardProps {
  title: string;
  metrics: MetricItem[];
}

const InsightsCard: React.FC<InsightsCardProps> = ({ title, metrics }) => {
  return (
    <Box sx={{ px: 4, pb: 3, backgroundColor: 'white' }}>
      <Box
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(36, 17, 79, 0.08)',
          border: '1px solid rgba(36, 17, 79, 0.1)',
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#24114f', mb: 3 }}>
            {title}
          </Typography>
          <Grid container spacing={3}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={metrics.length <= 4 ? 3 : 2.4} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: metric.bgColor,
                    border: `1px solid ${metric.borderColor}`,
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, color: metric.color, mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {metric.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default InsightsCard;