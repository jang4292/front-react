import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { UploadFile as UploadFileIcon } from "@mui/icons-material";

interface MusicRegisterForm {
  title: string;
  artist: string;
  bgm: File | null;
  url: string;
}

const initialForm: MusicRegisterForm = {
  title: "",
  artist: "",
  bgm: null,
  url: "",
};

const MusicUpload: React.FC = () => {
  const [form, setForm] = useState<MusicRegisterForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange =
    (field: keyof Pick<MusicRegisterForm, "title" | "artist" | "url">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleBgmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, bgm: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.artist || !form.bgm || !form.url) {
      setError("Title, artist, bgm, and url are all required.");
      return;
    }

    // TODO: wire up to the music registration API once server integration is finalized.
    setSuccess(`"${form.title}" is ready to be registered.`);
    setForm(initialForm);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Register Music
      </Typography>
      <Paper sx={{ p: 3, mt: 2, maxWidth: 480 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              label="Title"
              value={form.title}
              onChange={handleChange("title")}
            />
            <TextField
              required
              fullWidth
              label="Artist"
              value={form.artist}
              onChange={handleChange("artist")}
            />
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ justifyContent: "flex-start" }}
            >
              {form.bgm ? form.bgm.name : "Upload BGM file"}
              <input
                type="file"
                accept="audio/*"
                hidden
                onChange={handleBgmChange}
              />
            </Button>
            <TextField
              required
              fullWidth
              label="URL"
              placeholder="https://example.com/music"
              value={form.url}
              onChange={handleChange("url")}
            />
            <Button type="submit" variant="contained">
              Register
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default MusicUpload;
