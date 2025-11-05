import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryCreate } from '../types';
import { Box, Typography, TextField, Button, FormControl, Select, MenuItem } from '@mui/material';
import { createCategory } from '../api';

const AddCategoryPage: React.FC = () => {
  const [form, setForm] = useState<CategoryCreate>({
    CategoryName: '',
    CategoryDescription: '',
    MaximumAmount: undefined,
    Status: true,
      // Document field removed
    ApprovalCriteria: '',
  });
  const navigate = useNavigate();

  function handleChange(field: keyof CategoryCreate, value: any) {
    // Convert CategoryName to uppercase as user types
    if (field === 'CategoryName') {
      value = value.toUpperCase();
    }
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
  const formData = new FormData();
  formData.append('categoryname', form.CategoryName);
  formData.append('categorydescription', form.CategoryDescription || '');
  if (form.MaximumAmount !== undefined) formData.append('maximumamount', String(form.MaximumAmount));
  formData.append('status_param', String(form.Status));
  formData.append('approval_criteria', form.ApprovalCriteria || '');
    // Document upload removed
  await createCategory(formData);
  navigate('/categories');
  }

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Add Category</Typography>
      <TextField label="Category Name" fullWidth sx={{ mb: 2 }} value={form.CategoryName} onChange={e => handleChange('CategoryName', e.target.value)} />
      <TextField label="Description" fullWidth sx={{ mb: 2 }} value={form.CategoryDescription} onChange={e => handleChange('CategoryDescription', e.target.value)} />
      <TextField label="Approval Criteria" fullWidth multiline rows={3} sx={{ mb: 2 }} value={form.ApprovalCriteria || ''} onChange={e => handleChange('ApprovalCriteria', e.target.value)} />
      <TextField label="Maximum Amount" type="number" fullWidth sx={{ mb: 2 }} value={form.MaximumAmount ?? ''} onChange={e => handleChange('MaximumAmount', Number(e.target.value))} />
  {/* RequestCount removed from UI */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select value={form.Status ? 'enabled' : 'disabled'} onChange={e => handleChange('Status', e.target.value === 'enabled')}>
          <MenuItem value="enabled">Enabled</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSubmit} disabled={!form.CategoryName || !form.ApprovalCriteria}>Add Category</Button>
    </Box>
  );
};

export default AddCategoryPage;
