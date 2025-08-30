import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 4 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              HueDo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A customizable Material 3 todo list app
              <br />
              Built with React Native & Firebase
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              sx={{ textDecoration: 'none' }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              sx={{ textDecoration: 'none' }}
            >
              Terms of Service
            </Link>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Account
            </Typography>
            <Link
              component={RouterLink}
              to="/delete-account"
              color="text.secondary"
              sx={{ textDecoration: 'none' }}
            >
              Delete Account
            </Link>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} HueDo. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;