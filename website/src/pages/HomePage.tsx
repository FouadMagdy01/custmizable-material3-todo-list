import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  CheckCircle as CheckCircleIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  GetApp as GetAppIcon,
} from '@mui/icons-material';

const HomePage = () => {
  const features = [
    {
      icon: <CheckCircleIcon color="primary" sx={{ fontSize: 40 }} />,
      title: 'Task Management',
      description: 'Create, edit, and organize your tasks with priorities, due dates, tags, and categories.',
    },
    {
      icon: <PaletteIcon color="primary" sx={{ fontSize: 40 }} />,
      title: 'Material 3 Design',
      description: 'Beautiful, customizable themes with Material 3 design system and dynamic colors.',
    },
    {
      icon: <CloudIcon color="primary" sx={{ fontSize: 40 }} />,
      title: 'Cloud Sync',
      description: 'Your tasks are securely stored in Firebase and sync across all your devices.',
    },
    {
      icon: <SecurityIcon color="primary" sx={{ fontSize: 40 }} />,
      title: 'Privacy First',
      description: 'Your data is private and secure. Use as guest or create an account for full features.',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
            background: 'linear-gradient(45deg, #6750A4, #625B71)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          HueDo
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          sx={{ 
            mb: 4, 
            maxWidth: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            px: { xs: 1, sm: 0 },
          }}
        >
          A beautiful, customizable todo list app with Material 3 design
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            mb: 6, 
            maxWidth: 800, 
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            px: { xs: 1, sm: 0 },
          }}
        >
          HueDo is a modern React Native todo application that combines the elegance of Material 3 design
          with powerful task management features. Organize your tasks with custom colors, priorities,
          and cloud synchronization.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', px: { xs: 1, sm: 0 } }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<GetAppIcon />}
            sx={{ 
              px: { xs: 3, sm: 4 }, 
              py: 1.5,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
            disabled
          >
            Download App (Coming Soon)
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 1, sm: 0 } }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          sx={{ 
            mb: 6, 
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          Features
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      lineHeight: 1.6,
                      fontSize: { xs: '0.85rem', md: '0.875rem' },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* App Screenshots Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, textAlign: 'center', px: { xs: 1, sm: 0 } }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          Beautiful & Intuitive
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            mb: 6, 
            maxWidth: 600, 
            mx: 'auto', 
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            px: { xs: 1, sm: 0 },
          }}
        >
          HueDo features a clean, modern interface built with Material 3 design principles.
          Customize colors, themes, and organize your tasks exactly how you want.
        </Typography>
        
        {/* Placeholder for app screenshots */}
        <Card
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mb: 4,
            bgcolor: 'grey.100',
            minHeight: { xs: 200, md: 300 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
          >
            App Screenshots Coming Soon
          </Typography>
        </Card>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 4 },
          textAlign: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          mb: 4,
          mx: { xs: 1, sm: 0 },
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          Ready to Get Organized?
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            opacity: 0.9, 
            maxWidth: 600, 
            mx: 'auto',
            fontSize: { xs: '0.95rem', sm: '1rem' },
          }}
        >
          Start managing your tasks with HueDo's beautiful interface and powerful features.
        </Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{
            color: 'white',
            borderColor: 'white',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            px: { xs: 3, sm: 4 },
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
              borderColor: 'white',
            },
          }}
          disabled
        >
          Download HueDo (Coming Soon)
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;