import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
          }}
        >
          Privacy Policy
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
        >
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ '& > *': { mb: { xs: 2, md: 3 } } }}>
          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Introduction
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              HueDo ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our mobile application HueDo and related services.
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Information We Collect
            </Typography>
            
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                mt: 2,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Personal Information
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              When you create an account, we may collect:
            </Typography>
            <ul>
              <li>Email address</li>
              <li>Display name</li>
              <li>Profile information you choose to provide</li>
            </ul>

            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                mt: 2,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Task Data
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              We store the tasks and information you create in the app:
            </Typography>
            <ul>
              <li>Task titles and descriptions</li>
              <li>Task priorities, due dates, and categories</li>
              <li>Tags and custom organization data</li>
              <li>Task completion status</li>
            </ul>

            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                mt: 2,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Preferences and Settings
            </Typography>
            <ul>
              <li>App theme and color preferences</li>
              <li>Notification settings</li>
              <li>Default task priorities and sorting preferences</li>
            </ul>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              How We Use Your Information
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              We use the information we collect to:
            </Typography>
            <ul>
              <li>Provide and maintain the HueDo service</li>
              <li>Sync your tasks across devices</li>
              <li>Personalize your app experience</li>
              <li>Send important service notifications</li>
              <li>Improve our services and develop new features</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Guest Mode
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              HueDo offers a guest mode where you can use the app without creating an account. In guest mode:
            </Typography>
            <ul>
              <li>Your tasks are stored locally on your device</li>
              <li>No personal information is collected</li>
              <li>Tasks are not synced to the cloud</li>
              <li>Data may be lost when you uninstall the app</li>
            </ul>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Data Storage and Security
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              Your data is stored securely using Google Firebase services:
            </Typography>
            <ul>
              <li>All data is encrypted in transit and at rest</li>
              <li>We use industry-standard security measures</li>
              <li>Access to your data is limited to essential operations</li>
              <li>We do not sell or rent your personal information</li>
            </ul>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Your Rights
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              You have the right to:
            </Typography>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your task data</li>
              <li>Control notification settings</li>
            </ul>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Account Deletion
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              You can delete your account at any time through our account deletion page. When you delete your account:
            </Typography>
            <ul>
              <li>All your tasks and personal data will be permanently deleted</li>
              <li>Your account cannot be recovered</li>
              <li>The deletion process may take up to 30 days to complete</li>
            </ul>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Third-Party Services
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              HueDo uses Google Firebase for backend services. Firebase's privacy policy applies to data processed by their services.
              We do not share your personal information with other third parties except as necessary to provide the service.
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Children's Privacy
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information
              from children under 13.
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Changes to This Privacy Policy
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              We may update this Privacy Policy from time to time. We will notify users of any material changes through
              the app or by email.
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
              }}
            >
              Contact Us
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              If you have questions about this Privacy Policy or our data practices, please contact us at:
              support@huedo-app.com
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;