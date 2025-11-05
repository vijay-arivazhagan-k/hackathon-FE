import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, FormControl, Select, MenuItem } from '@mui/material';
import { fetchCategory, updateCategoryWithFile } from '../api';
import { Category } from '../types';

const UpdateCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Partial<Category>>({});
  const [comments, setComments] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (!id) return;
      const cat = await fetchCategory(Number(id));
      setForm(cat);
    }
    load();
  }, [id]);

  function handleChange(field: keyof Category, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
  }

  async function handleSubmit() {
    if (!id) return;
    const formData = new FormData();
    formData.append('CategoryName', form.CategoryName || '');
    formData.append('CategoryDescription', form.CategoryDescription || '');
    if (form.MaximumAmount !== undefined) formData.append('MaximumAmount', String(form.MaximumAmount));
    formData.append('Status', String(form.Status));
    if (form.RequestCount !== undefined) formData.append('RequestCount', String(form.RequestCount));
    if (file) formData.append('Document', file);
    formData.append('Comments', comments);
    await updateCategoryWithFile(Number(id), formData);
    navigate(`/categories/${id}`);
  }

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Update Category</Typography>
      <TextField label="Category Name" fullWidth sx={{ mb: 2 }} value={form.CategoryName || ''} onChange={e => handleChange('CategoryName', e.target.value)} />
      <TextField label="Description" fullWidth sx={{ mb: 2 }} value={form.CategoryDescription || ''} onChange={e => handleChange('CategoryDescription', e.target.value)} />
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
        {file && <Typography variant="body2" sx={{ mt: 1 }}>{file.name}</Typography>}
      </Box>
      <TextField label="Comments (required)" fullWidth sx={{ mb: 2 }} value={comments} onChange={e => setComments(e.target.value)} required />
      <Button variant="contained" onClick={handleSubmit} disabled={!form.CategoryName || !comments}>Update Category</Button>
    </Box>
  );
};

export default UpdateCategoryPage;
