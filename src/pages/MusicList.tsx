import { Typography, Paper, Box } from "@mui/material";

const MusicList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Music List
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Application MusicList
        </Typography>
        <Typography variant="body2" color="text.secondary">
          MusicList configuration will be available here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default MusicList;
