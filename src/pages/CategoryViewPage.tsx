import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Avatar,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import { fetchCategory, fetchCategoryHistory } from '../api';
import { Category } from '../types';

// Backend base used for document endpoints. Adjust if backend host/port differs in your environment.
const BACKEND_BASE = 'http://127.0.0.1:8201';

const CategoryViewPage: React.FC = () => {
  const { id } = useParams<{ id: string}>();
  const [category, setCategory] = useState<Category | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  const formatDate = (d?: string) => {
    if (!d) return '-';
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch (e) {
      return d;
    }
  };

  // Document view logic removed

  // dialog state for inline preview
  const [docOpen, setDocOpen] = useState(false);
  const [docSrc, setDocSrc] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState<string>('Document Preview');

  const openDoc = (src: string | null, title = 'Document Preview') => {
    if (!src) return;
    setDocSrc(src);
    setDocTitle(title);
    setDocOpen(true);
  };
  const closeDoc = () => {
    setDocOpen(false);
    setDocSrc(null);
    setDocTitle('Document Preview');
  };

  useEffect(() => {
    async function load() {
      if (!id) return;
  const cat: any = await fetchCategory(Number(id));
      // map backend fields to frontend Category shape
      const mapped = {
        ID: cat.id,
        CategoryName: cat.categoryname,
        CategoryDescription: cat.categorydescription,
        MaximumAmount: cat.maximumamount,
        Status: Boolean(cat.status),
        RequestCount: cat.requestcount,
        ApprovalCriteria: cat.approval_criteria,
        CreatedOn: cat.createdon,
        CreatedBy: cat.createdby,
        UpdatedOn: cat.updatedon,
        UpdatedBy: cat.updatedby,
      } as Category;
      setCategory(mapped);

  const hist: any[] = await fetchCategoryHistory(Number(id));
  const mappedHist = (hist || []).map((h: any) => ({
        ID: h.id,
        CATEGORY_ID: h.category_id,
        CategoryName: h.categoryname,
        CategoryDescription: h.categorydescription,
        MaximumAmount: h.maximumamount,
        Status: Boolean(h.status),
        RequestCount: h.requestcount,
        ApprovalCriteria: h.approval_criteria,
        Comments: h.comments,
        CreatedOn: h.createdon,
        CreatedBy: h.createdby,
        // document fields removed or handled separately
      }));
      setHistory(mappedHist);
    }
    load();
  }, [id]);

  if (!category) {
    return (
      <Box p={4}>
        <Typography variant="h5">Category not found</Typography>
        <Button variant="contained" onClick={() => navigate('/categories')}>Back to Categories</Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Box mb={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#24114f' }}>Category Details</Typography>
          </Box>

          <Card sx={{ mb: 3, width: '100%' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ bgcolor: '#24114f', width: 64, height: 64, fontWeight: 700 }}>
                    {category.CategoryName?.slice(0,1).toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{category.CategoryName}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={`Max: ${category.MaximumAmount ?? '-'}`} color="primary" />
                    <Chip label={`Requests: ${category.RequestCount ?? 0}`} />
                    <Chip label={category.Status ? 'Enabled' : 'Disabled'} color={category.Status ? 'success' : 'default'} />
                  </Box>
                </Grid>
                            <Grid item>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" onClick={() => navigate(`/categories/${category.ID}/edit`)}>Edit</Button>
                                {/* View Document button removed */}
                              </Box>
                            </Grid>
              </Grid>

                <Box sx={{ mt: 2 }}>
                <Typography variant="body1">{category.CategoryDescription ?? 'No description provided.'}</Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, minHeight: 80 }}>
                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                    <strong>Approval Criteria:</strong>
                    {' '}
                    {category.ApprovalCriteria || 'N/A'}
                  </Typography>
                </Box>
                {/* Document view logic removed */}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="caption">Created On</Typography>
                  <Typography>{formatDate(category.CreatedOn)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption">Created By</Typography>
                  <Typography>{category.CreatedBy ?? '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption">Updated On</Typography>
                  <Typography>{formatDate(category.UpdatedOn)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption">Updated By</Typography>
                  <Typography>{category.UpdatedBy ?? '-'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box mb={2}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#24114f' }}>History</Typography>
          </Box>

          {history.length === 0 ? (
            <Typography>No history available.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {history.map((h) => (
                <Paper key={h.ID} elevation={2} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#6b46c1' }}>{(h.CreatedBy || 'U').slice(0,1).toUpperCase()}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{h.Comments}</Typography>
                    <Typography variant="body2">{h.CategoryName} • {h.CategoryDescription}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 2, flexDirection: 'column' }}>
                      <Typography variant="caption">Amount: {h.MaximumAmount ?? '-'}</Typography>
                      <Typography variant="caption">Requests: {h.RequestCount ?? '-'}</Typography>
                      <Typography variant="caption">Status: {h.Status ? 'Enabled' : 'Disabled'}</Typography>
                      <Box sx={{ mt: 1, p: 1, bgcolor: '#fafafa', borderRadius: 1, minHeight: 56 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                          <strong>Approval Criteria:</strong>
                          {' '}
                          {h.ApprovalCriteria || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                    {/* Document view removed - Approval criteria shown in details */}
                    <Box>
                      <Typography variant="caption">By: {h.CreatedBy ?? '-'}</Typography>
                      <Typography variant="caption">{formatDate(h.CreatedOn)}</Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Grid>

        {/* Removed right-side quick actions per request - moved actions into main card */}
        </Grid>

        <Dialog open={docOpen} onClose={closeDoc} fullWidth maxWidth="lg">
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {docTitle}
            <IconButton onClick={closeDoc}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, height: '80vh' }}>
            {docSrc ? (
              <iframe src={docSrc} title={docTitle} width="100%" height="100%" style={{ border: 0 }} />
            ) : (
              <Box p={2}><Typography>No document to preview.</Typography></Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  };

  export default CategoryViewPage;
