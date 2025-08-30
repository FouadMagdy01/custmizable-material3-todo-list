import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const TermsOfService = () => {
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
          Terms of Service
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
              Acceptance of Terms
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              By downloading, installing, or using the HueDo mobile application ("App"), you agree to be bound by these Terms of Service ("Terms").
              If you do not agree to these Terms, please do not use the App.
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
              Description of Service
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              HueDo is a task management application that allows users to create, organize, and manage their tasks.
              The App includes features such as:
            </Typography>
            <ul>
              <li>Task creation, editing, and deletion</li>
              <li>Task organization with priorities, categories, and tags</li>
              <li>Customizable themes and colors</li>
              <li>Cloud synchronization (for registered users)</li>
              <li>Guest mode usage</li>
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
              User Accounts
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
              Account Creation
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              You may use HueDo as a guest or create an account for additional features. When creating an account:
            </Typography>
            <ul>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must be at least 13 years of age</li>
              <li>One person may not create multiple accounts</li>
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
              Guest Mode
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              Guest mode allows you to use the App without creating an account. In guest mode, your data is stored
              locally and will not sync across devices.
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
              Acceptable Use
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              You agree to use HueDo only for lawful purposes. You may not:
            </Typography>
            <ul>
              <li>Use the App for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to the App or its systems</li>
              <li>Upload or share content that is harmful, offensive, or inappropriate</li>
              <li>Interfere with or disrupt the App's functionality</li>
              <li>Use the App to spam or harass others</li>
              <li>Reverse engineer or attempt to extract source code</li>
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
              User Content
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              You retain ownership of the tasks and content you create in HueDo. By using the App, you grant us
              a limited license to store and process your content to provide the service.
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              You are responsible for the content you create and must ensure it does not violate any laws or
              third-party rights.
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
              Privacy and Data Protection
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect,
              use, and protect your information. By using HueDo, you consent to the collection and use of
              your information as described in our Privacy Policy.
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
              Service Availability
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              We strive to keep HueDo available and functional, but we cannot guarantee:
            </Typography>
            <ul>
              <li>100% uptime or availability</li>
              <li>That the service will be error-free</li>
              <li>That all features will work on all devices</li>
              <li>Compatibility with future operating system updates</li>
            </ul>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              We may temporarily suspend the service for maintenance, updates, or other reasons.
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
              Account Termination
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              You may delete your account at any time through the account deletion feature. We may terminate
              or suspend accounts that violate these Terms.
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              Upon termination:
            </Typography>
            <ul>
              <li>Your access to the App will be revoked</li>
              <li>Your data will be deleted according to our Privacy Policy</li>
              <li>These Terms will remain in effect for any remaining obligations</li>
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
              Intellectual Property
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              HueDo and all related content, features, and functionality are owned by us or our licensors.
              This includes but is not limited to:
            </Typography>
            <ul>
              <li>The App's design, layout, and user interface</li>
              <li>Source code and software</li>
              <li>Trademarks and branding</li>
              <li>Documentation and help materials</li>
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
              Disclaimers and Limitations
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              HueDo is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied,
              including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
              including but not limited to loss of data, revenue, or profits.
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
              Indemnification
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              You agree to indemnify and hold harmless HueDo and its affiliates from any claims, damages, or expenses
              arising from your use of the App or violation of these Terms.
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
              Changes to Terms
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              We may update these Terms from time to time. We will notify users of material changes through the App
              or by email. Continued use of the App after changes constitutes acceptance of the new Terms.
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
              Governing Law
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              These Terms are governed by the laws of [Your Jurisdiction] without regard to conflict of law principles.
              Any disputes will be resolved in the courts of [Your Jurisdiction].
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
              Contact Information
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              If you have questions about these Terms of Service, please contact us at: support@huedo-app.com
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
              Severability
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue
              in full force and effect.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsOfService;