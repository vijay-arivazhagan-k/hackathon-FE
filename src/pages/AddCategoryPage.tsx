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
    RequestCount: undefined,
    Document: null,
  });
  const navigate = useNavigate();

  function handleChange(field: keyof CategoryCreate, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, Document: file }));
  }

  async function handleSubmit() {
  const formData = new FormData();
  formData.append('CategoryName', form.CategoryName);
  formData.append('CategoryDescription', form.CategoryDescription || '');
  if (form.MaximumAmount !== undefined) formData.append('MaximumAmount', String(form.MaximumAmount));
  formData.append('Status', String(form.Status));
  if (form.RequestCount !== undefined) formData.append('RequestCount', String(form.RequestCount));
  if (form.Document) formData.append('Document', form.Document);
  await createCategory(formData);
  navigate('/categories');
  }

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Add Category</Typography>
      <TextField label="Category Name" fullWidth sx={{ mb: 2 }} value={form.CategoryName} onChange={e => handleChange('CategoryName', e.target.value)} />
      <TextField label="Description" fullWidth sx={{ mb: 2 }} value={form.CategoryDescription} onChange={e => handleChange('CategoryDescription', e.target.value)} />
      <TextField label="Maximum Amount" type="number" fullWidth sx={{ mb: 2 }} value={form.MaximumAmount ?? ''} onChange={e => handleChange('MaximumAmount', Number(e.target.value))} />
      <TextField label="Request Count" type="number" fullWidth sx={{ mb: 2 }} value={form.RequestCount ?? ''} onChange={e => handleChange('RequestCount', Number(e.target.value))} />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select value={form.Status ? 'enabled' : 'disabled'} onChange={e => handleChange('Status', e.target.value === 'enabled')}>
          <MenuItem value="enabled">Enabled</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" component="label">
          Upload Document (PDF)
          <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
        </Button>
        {form.Document && <Typography variant="body2" sx={{ mt: 1 }}>{form.Document.name}</Typography>}
      </Box>
      <Button variant="contained" onClick={handleSubmit} disabled={!form.CategoryName}>Add Category</Button>
    </Box>
  );
};

export default AddCategoryPage;
