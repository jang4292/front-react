import { useEffect, useRef, useState } from 'react';
import {
  Album as AlbumIcon,
  GraphicEq as GraphicEqIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';

interface Track {
  id: string;
  title: string;
  artist: string;
  mood: string;
  bpm: number;
  duration: number;
  cover: string;
  notes: number[];
}

interface ViewportState {
  width: number;
  height: number;
  device: 'Web' | 'Mobile';
  orientation: 'Landscape' | 'Portrait';
}

const tracks: Track[] = [
  {
    id: 'midnight-grid',
    title: 'Midnight Grid',
    artist: 'Studio Admin',
    mood: 'Focus',
    bpm: 92,
    duration: 96,
    cover: 'linear-gradient(135deg, #101820 0%, #246a73 48%, #f3c969 100%)',
    notes: [220, 277.18, 329.63, 369.99, 329.63, 277.18, 246.94, 220],
  },
  {
    id: 'solar-lobby',
    title: 'Solar Lobby',
    artist: 'Panel Keys',
    mood: 'Bright',
    bpm: 118,
    duration: 84,
    cover: 'linear-gradient(135deg, #f6f1d1 0%, #f48c06 44%, #1d3557 100%)',
    notes: [261.63, 329.63, 392, 523.25, 493.88, 392, 329.63, 293.66],
  },
  {
    id: 'soft-terminal',
    title: 'Soft Terminal',
    artist: 'Route State',
    mood: 'Calm',
    bpm: 76,
    duration: 108,
    cover: 'linear-gradient(135deg, #2f3e46 0%, #84a98c 52%, #cad2c5 100%)',
    notes: [196, 246.94, 293.66, 349.23, 329.63, 293.66, 246.94, 220],
  },
];

const mobileBreakpoint = 900;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const getViewportState = (): ViewportState => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
    device: width < mobileBreakpoint ? 'Mobile' : 'Web',
    orientation: width >= height ? 'Landscape' : 'Portrait',
  };
};

const useViewportState = () => {
  const [viewport, setViewport] = useState<ViewportState>(() => getViewportState());

  useEffect(() => {
    const updateViewport = () => {
      setViewport(getViewportState());
    };

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
};

const Musics: React.FC = () => {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0.55);
  const viewport = useViewportState();
  const audioContextRef = useRef<AudioContext | null>(null);
  const sequenceTimerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const sequenceStepRef = useRef(0);
  const gainRef = useRef<GainNode | null>(null);
  const activeTrack = tracks[activeTrackIndex];
  const isMobile = viewport.device === 'Mobile';
  const isLandscape = viewport.orientation === 'Landscape';
  const shouldUseSideBySideLayout = !isMobile || isLandscape;

  const clearTimers = () => {
    if (sequenceTimerRef.current) {
      window.clearInterval(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  };

  const stopPlayback = (resetPosition = false) => {
    clearTimers();
    setIsPlaying(false);
    if (resetPosition) {
      sequenceStepRef.current = 0;
      setPosition(0);
    }
  };

  const playStep = (track: Track) => {
    const audioContext = audioContextRef.current;
    const gain = gainRef.current;
    if (!audioContext || !gain) {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    const frequency = track.notes[sequenceStepRef.current % track.notes.length];

    oscillator.type = sequenceStepRef.current % 4 === 0 ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    envelope.gain.setValueAtTime(0.0001, audioContext.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.38);
    oscillator.connect(envelope).connect(gain);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.42);
    sequenceStepRef.current += 1;
  };

  const startPlayback = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainRef.current = audioContextRef.current.createGain();
      gainRef.current.connect(audioContextRef.current.destination);
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }

    clearTimers();
    playStep(activeTrack);
    sequenceTimerRef.current = window.setInterval(() => playStep(activeTrack), 60000 / activeTrack.bpm);
    elapsedTimerRef.current = window.setInterval(() => {
      setPosition((currentPosition) => {
        if (currentPosition >= activeTrack.duration) {
          stopPlayback(true);
          setActiveTrackIndex((currentIndex) => (currentIndex + 1) % tracks.length);
          return 0;
        }
        return currentPosition + 0.25;
      });
    }, 250);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    void startPlayback();
  };

  const handleTrackChange = (trackIndex: number) => {
    stopPlayback(true);
    setActiveTrackIndex(trackIndex);
  };

  const handlePrevious = () => {
    stopPlayback(true);
    setActiveTrackIndex((currentIndex) => (currentIndex === 0 ? tracks.length - 1 : currentIndex - 1));
  };

  const handleNext = () => {
    stopPlayback(true);
    setActiveTrackIndex((currentIndex) => (currentIndex + 1) % tracks.length);
  };

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      clearTimers();
      void audioContextRef.current?.close();
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        p: isMobile && isLandscape ? 2 : { xs: 2, sm: 3, md: 4 },
        background:
          'radial-gradient(circle at 15% 10%, rgba(243, 201, 105, 0.18), transparent 28%), linear-gradient(135deg, #f8faf9 0%, #edf4f2 48%, #dfe8ee 100%)',
      }}
    >
      <Stack direction={shouldUseSideBySideLayout ? 'row' : 'column'} spacing={3} alignItems="stretch">
        <Paper
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            borderRadius: 2,
            background: '#101820',
            color: 'common.white',
          }}
        >
          <Box
            sx={{
              minHeight: isMobile && isLandscape ? 220 : { xs: 320, md: 360 },
              p: isMobile && isLandscape ? 2.5 : { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: activeTrack.cover,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
              <Chip icon={<GraphicEqIcon />} label={`${activeTrack.bpm} BPM`} color="default" />
              <Chip label={activeTrack.mood} color="default" />
              <Chip label={`${viewport.device} · ${viewport.orientation}`} color="default" />
            </Stack>

            <Box>
              <Typography variant="overline" sx={{ opacity: 0.8 }}>
                Now Playing
              </Typography>
              <Typography
                variant={isMobile && isLandscape ? 'h4' : 'h3'}
                component="h1"
                sx={{ fontWeight: 800, mt: 1 }}
              >
                {activeTrack.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.86 }}>
                {activeTrack.artist}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: isMobile && isLandscape ? 2 : 3, background: '#101820' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2">{formatTime(position)}</Typography>
              <Typography variant="body2">{formatTime(activeTrack.duration)}</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min((position / activeTrack.duration) * 100, 100)}
              sx={{ height: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.18)' }}
            />
            <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
              <IconButton color="inherit" onClick={handlePrevious} aria-label="previous track">
                <SkipPreviousIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'pause track' : 'play track'}
                sx={{
                  width: isMobile && isLandscape ? 56 : 64,
                  height: isMobile && isLandscape ? 56 : 64,
                  backgroundColor: 'rgba(255,255,255,0.16)',
                }}
              >
                {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
              </IconButton>
              <IconButton color="inherit" onClick={handleNext} aria-label="next track">
                <SkipNextIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>

        <Paper
          sx={{
            width: shouldUseSideBySideLayout ? { xs: 300, md: 360 } : '100%',
            flexShrink: 0,
            p: isMobile && isLandscape ? 2 : 3,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <AlbumIcon color="primary" />
            <Typography variant="h5" component="h2" fontWeight={700}>
              Playlist
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            <Chip size="small" label={viewport.device} />
            <Chip size="small" label={viewport.orientation} />
            <Chip size="small" label={`${viewport.width} x ${viewport.height}`} />
          </Stack>
          <Stack spacing={1.5}>
            {tracks.map((track, trackIndex) => (
              <Card
                key={track.id}
                variant={trackIndex === activeTrackIndex ? 'elevation' : 'outlined'}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleTrackChange(trackIndex)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 52, height: 52, borderRadius: 1, background: track.cover, flexShrink: 0 }} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography fontWeight={700} noWrap>
                        {track.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {track.artist} · {formatTime(track.duration)}
                      </Typography>
                    </Box>
                    {trackIndex === activeTrackIndex && isPlaying && <GraphicEqIcon color="primary" />}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Volume
            </Typography>
            <Slider
              value={volume}
              min={0}
              max={1}
              step={0.05}
              onChange={(_, nextVolume) => setVolume(nextVolume as number)}
              aria-label="volume"
            />
          </Box>

          <Button fullWidth variant="contained" size="large" onClick={handlePlayPause} sx={{ mt: 2 }}>
            {isPlaying ? 'Pause Music' : 'Play Music'}
          </Button>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Musics;