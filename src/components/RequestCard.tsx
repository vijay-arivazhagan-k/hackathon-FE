import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { RequestItem } from '../types';
import { formatCurrency } from '../utils/formatters';

const statusColors: Record<string, { bg: string; color: string }> = {
  approved: { bg: '#e8f5e8', color: '#4caf50' },
  rejected: { bg: '#ffebee', color: '#f44336' },
  pending: { bg: '#fff3e0', color: '#ff9800' },
  default: { bg: '#f8f9fa', color: '#24114f' },
};

interface RequestCardProps {
  item: RequestItem;
  onClick?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ item, onClick }) => {
  const status = item.current_status?.toLowerCase() || 'default';
  const { bg, color } = statusColors[status] || statusColors.default;

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(36, 17, 79, 0.12)',
        border: '1px solid rgba(36, 17, 79, 0.12)',
        mb: 2,
        background: bg,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: onClick ? '0 12px 40px rgba(36, 17, 79, 0.18)' : undefined,
          transform: onClick ? 'translateY(-4px)' : undefined,
        },
        maxHeight: 220,
        overflowY: 'auto',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#24114f', flexGrow: 1 }}>
            {item.user_id}
          </Typography>
          <Chip
            label={item.current_status}
            sx={{
              fontWeight: 600,
              background: color,
              color: 'white',
              textTransform: 'capitalize',
              ml: 1,
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <strong>Request #:</strong> {item.id}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <strong>Category:</strong> {item.category_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <strong>Amount:</strong> <span style={{ color: '#24114f', fontWeight: 500 }}>{formatCurrency(item.total_amount)}</span>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <strong>Approval Type:</strong> {item.approvaltype}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
