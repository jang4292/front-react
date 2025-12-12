import { Typography, Paper, Box } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Application Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Settings configuration will be available here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
