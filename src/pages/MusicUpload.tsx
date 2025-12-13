import { Typography, Paper, Box } from "@mui/material";

const MusicUpload: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Music Upload
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Application MusicUpload
        </Typography>
        <Typography variant="body2" color="text.secondary">
          MusicUpload configuration will be available here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default MusicUpload;
