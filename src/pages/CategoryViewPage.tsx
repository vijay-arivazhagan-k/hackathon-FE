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

  const renderDocument = (doc: any, historyId?: number) => {
    if (!doc) return null;

    // If doc is a URL string
    if (typeof doc === 'string' && (doc.startsWith('http') || doc.startsWith('data:')) ) {
      const isPdf = doc.toLowerCase().endsWith('.pdf') || doc.startsWith('data:application/pdf');
      return (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArticleIcon />
            <Typography variant="body2">Uploaded document</Typography>
            <Box sx={{ flex: 1 }} />
            <IconButton onClick={() => openDoc(doc, 'Document Preview')} aria-label="Open document">
              <OpenInNewIcon />
            </IconButton>
            <IconButton href={doc} download aria-label="Download document">
              <DownloadIcon />
            </IconButton>
          </Box>
        </Box>
      );
    }

    // If doc is not a URL, attempt to fetch from backend endpoints
  const catId = category?.ID;
  if (!catId) return null;
  const categoryDocUrl = `${BACKEND_BASE}/api/v1/categories/${catId}/document`;
  const historyDocUrl = historyId ? `${BACKEND_BASE}/api/v1/categories/${catId}/history/${historyId}/document` : null;

    const openUrl = historyDocUrl || categoryDocUrl;

    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArticleIcon />
          <Typography variant="body2">Uploaded document</Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={() => openDoc(openUrl || '', 'Document Preview')} aria-label="Open document">
            <OpenInNewIcon />
          </IconButton>
          <IconButton component="a" href={openUrl || '#'} target="_blank" rel="noopener noreferrer" download aria-label="Download document">
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>
    );
  };

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
      const cat = await fetchCategory(Number(id));
      setCategory(cat);
      const hist = await fetchCategoryHistory(Number(id));
      setHistory(hist);
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
                                <Button
                                  variant="contained"
                                  onClick={() => openDoc(`${BACKEND_BASE}${category.DocumentUrl}`, 'Category Document')}
                                  disabled={!category.HasDocument}
                                >
                                  View Document
                                </Button>
                              </Box>
                            </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">{category.CategoryDescription ?? 'No description provided.'}</Typography>
                {category.HasDocument ? (
                  renderDocument(category.DocumentUrl)
                ) : (
                  <Typography variant="body2" sx={{ mt: 2 }}>No document attached.</Typography>
                )}
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
              {history.map((h, idx) => (
                <Paper key={idx} elevation={2} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#6b46c1' }}>{(h.CreatedBy || 'U').slice(0,1).toUpperCase()}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{h.Comments}</Typography>
                    <Typography variant="body2">{h.CategoryName} • {h.CategoryDescription}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                      <Typography variant="caption">Amount: {h.MaximumAmount ?? '-'}</Typography>
                      <Typography variant="caption">Requests: {h.RequestCount ?? '-'}</Typography>
                      <Typography variant="caption">Status: {h.Status ? 'Enabled' : 'Disabled'}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                    <Box>
                      <Button
                        size="small"
                        onClick={() => openDoc(`${BACKEND_BASE}${h.DocumentUrl}`, `History ${h.ID}`)}
                        disabled={!h.HasDocument}
                      >
                        View
                      </Button>
                    </Box>
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
