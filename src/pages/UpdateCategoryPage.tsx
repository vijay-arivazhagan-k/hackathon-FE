import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, FormControl, Select, MenuItem } from '@mui/material';
import { fetchCategory, updateCategoryWithFile } from '../api';
import { Category } from '../types';

const UpdateCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Partial<Category>>({});
  const [comments, setComments] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!id) return;
      const cat: any = await fetchCategory(Number(id));
      const mapped = {
        CategoryName: cat.categoryname,
        CategoryDescription: cat.categorydescription,
        MaximumAmount: cat.maximumamount,
        Status: Boolean(cat.status),
        ApprovalCriteria: cat.approval_criteria,
      } as Partial<Category>;
      setForm(mapped);
    }
    load();
  }, [id]);

  function handleChange(field: keyof Category, value: any) {
    // Convert CategoryName to uppercase as user types
    if (field === 'CategoryName') {
      value = value.toUpperCase();
    }
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!id) return;
    const formData = new FormData();
    formData.append('categoryname', form.CategoryName || '');
    formData.append('categorydescription', form.CategoryDescription || '');
    if (form.MaximumAmount !== undefined) formData.append('maximumamount', String(form.MaximumAmount));
    formData.append('status_param', String(form.Status));
    formData.append('approval_criteria', form.ApprovalCriteria || '');
  // Document upload removed
    formData.append('comments', comments);
    await updateCategoryWithFile(Number(id), formData);
    navigate(`/categories/${id}`);
  }

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Update Category</Typography>
      <TextField label="Category Name" fullWidth sx={{ mb: 2 }} value={form.CategoryName || ''} onChange={e => handleChange('CategoryName', e.target.value)} />
      <TextField label="Description" fullWidth sx={{ mb: 2 }} value={form.CategoryDescription || ''} onChange={e => handleChange('CategoryDescription', e.target.value)} />
      <TextField label="Approval Criteria" fullWidth multiline rows={3} sx={{ mb: 2 }} value={form.ApprovalCriteria || ''} onChange={e => handleChange('ApprovalCriteria', e.target.value)} />
      <TextField label="Maximum Amount" type="number" fullWidth sx={{ mb: 2 }} value={form.MaximumAmount ?? ''} onChange={e => handleChange('MaximumAmount', Number(e.target.value))} />
  {/* RequestCount removed from UI */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select value={form.Status ? 'enabled' : 'disabled'} onChange={e => handleChange('Status', e.target.value === 'enabled')}>
          <MenuItem value="enabled">Enabled</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
        </Select>
      </FormControl>
      {/* Document upload UI removed */}
      <TextField label="Comments (required)" fullWidth sx={{ mb: 2 }} value={comments} onChange={e => setComments(e.target.value)} required />
      <Button variant="contained" onClick={handleSubmit} disabled={!form.CategoryName || !comments}>Update Category</Button>
    </Box>
  );
};

export default UpdateCategoryPage;
