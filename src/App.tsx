import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SideMenu } from './layout/SideMenu';

import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import PendingPage from './pages/PendingPage';
import CategoriesPage from './pages/CategoriesPage';
import RequestDetail from './pages/RequestDetail';
import CategoryViewPage from './pages/CategoryViewPage';
import AddCategoryPage from './pages/AddCategoryPage';
import UpdateCategoryPage from './pages/UpdateCategoryPage';
import { Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <SideMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/add" element={<AddCategoryPage />} />
          <Route path="/categories/:id" element={<CategoryViewPage />} />
          <Route path="/categories/:id/edit" element={<UpdateCategoryPage />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
