import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link,
} from '@mui/material';

interface RegisterForm {
  username: string;
  password: string;
  nickname: string;
}

const initialForm: RegisterForm = {
  username: '',
  password: '',
  nickname: '',
};

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange =
    (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.username || !form.password || !form.nickname) {
      setError('아이디, 비밀번호, 닉네임을 모두 입력해주세요.');
      return;
    }

    // TODO: wire up to the sign-up API once server integration is finalized.
    setSuccess('회원가입 준비가 완료되었습니다.');
    setForm(initialForm);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            회원 가입
          </Typography>
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="아이디"
              name="username"
              autoComplete="username"
              autoFocus
              value={form.username}
              onChange={handleChange('username')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange('password')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="nickname"
              label="닉네임"
              id="nickname"
              value={form.nickname}
              onChange={handleChange('nickname')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              가입하기
            </Button>
            <Typography variant="body2" align="center">
              이미 계정이 있으신가요?{' '}
              <Link component={RouterLink} to="/login">
                로그인
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
