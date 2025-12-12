import { Typography, Paper, Box, Card, CardContent } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Active Sessions',
      value: '89',
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Reports',
      value: '24',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'Admin'}!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Here's what's happening with your admin panel today.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          mt: 2,
        }}
      >
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4">{stat.value}</Typography>
                </Box>
                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recent activity to display.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
