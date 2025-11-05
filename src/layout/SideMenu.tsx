import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuWidth = 280;

const items: { label: string; path: string; icon?: string }[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Report', path: '/report' },
  { label: 'Pending Requests', path: '/pending' },
  { label: 'Categories', path: '/categories' }
];

export const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: menuWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: menuWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #24114f 0%, #1a0a3a 100%)',
          color: '#ffffff',
          borderRight: 'none',
          boxShadow: '4px 0 20px rgba(36, 17, 79, 0.3)',
        }
      }}
    >
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#24114f', fontWeight: 800, fontSize: '1.2rem' }}>
              AI
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
              Invoice
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
              Processing
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <List sx={{ px: 2 }}>
        {items.map(it => (
          <ListItemButton
            key={it.path}
            onClick={() => navigate(it.path)}
            selected={location.pathname === it.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              py: 1.5,
              px: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateX(4px)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
            }}
          >
            <ListItemText
              primary={it.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === it.path ? 600 : 500,
                fontSize: '0.95rem',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
