import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AccountDeletion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'form' | 'confirmation' | 'processing' | 'complete'>('form');

  const handleDeleteAccount = async () => {
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Sign in the user to verify credentials
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error('Authentication failed');
      }

      setStep('confirmation');
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      
      let errorMessage = 'Failed to authenticate. Please check your credentials.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      }
      
      setError(errorMessage);
    }
  };

  const confirmDeletion = async () => {
    setStep('processing');
    setLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Step 1: Delete all user's tasks from Firestore
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      
      // Delete all tasks
      const deletePromises = tasksSnapshot.docs.map(taskDoc => 
        deleteDoc(doc(db, 'tasks', taskDoc.id))
      );
      await Promise.all(deletePromises);

      // Step 2: Delete user profile from Firestore (if exists)
      try {
        await deleteDoc(doc(db, 'users', user.uid));
      } catch (profileErr) {
        // Profile might not exist, continue with account deletion
        console.warn('User profile not found in Firestore');
      }

      // Step 3: Delete the user account from Firebase Auth
      await deleteUser(user);

      setStep('complete');
      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setStep('confirmation');
      
      let errorMessage = 'Failed to delete account. Please try again.';
      
      if (err.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign out and sign in again, then try deleting your account.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      setError(errorMessage);
    }
  };

  const resetForm = () => {
    setStep('form');
    setEmail('');
    setPassword('');
    setError('');
    setSuccess(false);
    setLoading(false);
  };

  if (step === 'complete') {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: { xs: 48, md: 60 }, color: 'success.main', mb: 2 }} />
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'success.main',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
            }}
          >
            Account Deleted Successfully
          </Typography>
          <Typography 
            variant="body1" 
            paragraph
            sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
          >
            Your HueDo account and all associated data have been permanently deleted.
            This action cannot be undone.
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            paragraph
            sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
          >
            Thank you for using HueDo. If you decide to use our app again in the future,
            you can create a new account.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/'}
            sx={{ 
              mt: 2,
              fontSize: { xs: '0.9rem', md: '1rem' },
              px: { xs: 3, md: 4 },
            }}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <DeleteIcon sx={{ fontSize: { xs: 48, md: 60 }, color: 'error.main', mb: 2 }} />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
            }}
          >
            Delete HueDo Account
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
          >
            Permanently delete your account and all associated data
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            ⚠️ This action is irreversible
          </Typography>
          <Typography variant="body2">
            Deleting your account will permanently remove:
          </Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>All your tasks and todos</li>
            <li>Your profile information</li>
            <li>App preferences and settings</li>
            <li>All data cannot be recovered</li>
          </ul>
        </Alert>

        {step === 'form' && (
          <Box sx={{ px: { xs: 1, sm: 0 } }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Verify Your Identity
            </Typography>
            <Typography variant="body1" paragraph>
              To delete your account, please enter your email address and password to verify your identity.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" sx={{ '& > *': { mb: 3 }, mt: 2 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 }, 
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                mt: 3,
                pt: 1,
              }}>
                <Button
                  variant="outlined"
                  onClick={() => window.location.href = '/'}
                  sx={{ 
                    fontSize: { xs: '0.85rem', md: '0.875rem' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                  sx={{ 
                    fontSize: { xs: '0.85rem', md: '0.875rem' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {step === 'confirmation' && (
          <Box sx={{ px: { xs: 1, sm: 0 } }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'error.main' }}>
              Final Confirmation
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Card sx={{ mb: 3, border: '2px solid', borderColor: 'error.main' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ color: 'error.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    You are about to permanently delete your account
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Account: <strong>{email}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This will immediately and permanently delete all your data. There is no way to recover
                  your account or data after this action is completed.
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 }, 
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              mt: 3,
              pt: 1,
            }}>
              <Button
                variant="outlined"
                onClick={resetForm}
                sx={{ 
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmDeletion}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                }}
              >
                {loading ? 'Deleting Account...' : 'DELETE MY ACCOUNT'}
              </Button>
            </Box>
          </Box>
        )}

        {step === 'processing' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Deleting Your Account...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we permanently delete your account and all associated data.
              This may take a few moments.
            </Typography>
          </Box>
        )}
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          If you're having trouble deleting your account or have questions about data deletion,
          please contact our support team at support@huedo-app.com
        </Typography>
      </Box>
    </Container>
  );
};

export default AccountDeletion;