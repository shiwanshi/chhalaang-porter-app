import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
// Gemini API endpoint and key (for demo, use env/backend for production)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = '';

function LoginSignup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [signupFinished, setSignupFinished] = useState(false);
  // Only keep form state for Gemini answers
  const [form, setForm] = useState({});
  // Audio recording state
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [transcribing, setTranscribing] = useState(false);
  const questions = [
    { key: 'fullName', label: "What's your name?" },
    { key: 'contact', label: "What's your contact number?" },
    { key: 'email', label: "What's your email?" },
    { key: 'aadhaar', label: "What's your Aadhaar number?" },
    { key: 'pan', label: "What's your PAN number?" },
    { key: 'vehicleType', label: "What's your vehicle type?" },
  ];
  const [qIndex, setQIndex] = useState(0);
  const [callStarted, setCallStarted] = useState(false);
  const [readyConfirmed, setReadyConfirmed] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [typedAnswer, setTypedAnswer] = useState('');

  // Helper: Speak text using browser TTS
  const speak = (text, cb) => {
    const synth = window.speechSynthesis;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.onend = cb;
    synth.speak(utter);
  };

  // Helper: Start speech recognition
  const startListening = (onResult, onEnd) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript.trim();
      onResult(transcript);
    };
    recognition.onend = onEnd;
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  // Helper: Convert spoken numbers to digits
  const wordsToDigits = (str) => {
    const map = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'double': '', 'triple': ''
    };
    let out = '';
    let tokens = str.toLowerCase().split(/\s+/);
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === 'double' && tokens[i+1] && map[tokens[i+1]]) {
        out += map[tokens[i+1]].repeat(2); i++;
      } else if (tokens[i] === 'triple' && tokens[i+1] && map[tokens[i+1]]) {
        out += map[tokens[i+1]].repeat(3); i++;
      } else if (map[tokens[i]]) {
        out += map[tokens[i]];
      } else if (/\d+/.test(tokens[i])) {
        out += tokens[i];
      }
    }
    return out;
  };
  // Helper: Convert spoken email to email format
  const spokenToEmail = (str) => {
    return str
      .replace(/ at /gi, '@')
      .replace(/ dot /gi, '.')
      .replace(/ underscore /gi, '_')
      .replace(/ dash /gi, '-')
      .replace(/ space /gi, '')
      .replace(/ plus /gi, '+')
      .replace(/\s+/g, '')
      .replace(/gmailcom/gi, 'gmail.com')
      .replace(/yahoocom/gi, 'yahoo.com')
      .replace(/rediffmailcom/gi, 'rediffmail.com');
  };

  // On mount, start the call
  useEffect(() => {
    if (!callStarted && showOnboarding) {
      setCallStarted(true);
      speak('Hi, this is the onboarding form. I am going to ask you some things. Are you ready?', () => {
        startListening((transcript) => {
          const confirmWords = /^(yes|haan|ho|ok|okay|ready|sure|yeah|yup|ya|ji|main hoon|i am|i am ready|i am ok|done)$/i;
          if (confirmWords.test(transcript.trim().toLowerCase())) {
            setReadyConfirmed(true);
          } else {
            speak('Please say yes when you are ready.', () => {
              startListening((t) => {
                if (confirmWords.test(t.trim().toLowerCase())) setReadyConfirmed(true);
              }, () => setListening(false));
            });
          }
        }, () => setListening(false));
      });
    }
  }, [callStarted, showOnboarding]);

  // When ready, start Q&A
  useEffect(() => {
    if (readyConfirmed && showOnboarding && !signupFinished) {
      // Ask current question
      speak(questions[qIndex].label, () => {
        startListening((transcript) => {
          // Field-specific extraction
          let answer = '';
          const field = questions[qIndex].key;
          if (field === 'fullName') {
            const lines = transcript.split('\n').map(l => l.trim());
            const nameLine = lines.find(l => l && !l.toLowerCase().startsWith('that sounds like') && /[\p{L}]/u.test(l));
            answer = nameLine || '';
          } else if (field === 'contact') {
            // Try spoken word-to-digit conversion first
            let digits = wordsToDigits(transcript);
            // const match = digits.match(/\d{10,}/);
            //answer = match ? match[0] : transcript.split('\n')[0].trim();
            answer = digits;
          } else if (field === 'email') {
            // Try spoken email conversion first
            let email = spokenToEmail(transcript);
            const match = email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            answer = match ? match[0] : transcript.split('\n')[0].trim();
          } else if (field === 'aadhaar') {
            // Try spoken word-to-digit conversion first
            let digits = wordsToDigits(transcript);
            const match = digits.match(/\d{12}/);
            answer = match ? match[0] : transcript.split('\n')[0].trim();
          } else if (field === 'pan') {
            const match = transcript.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/i);
            answer = match ? match[0].toUpperCase() : transcript.split('\n')[0].trim();
          } else if (field === 'vehicleType') {
            // Extract full alphanumeric vehicle number (e.g., KA1234, MH12AB1234)
            const match = transcript.match(/[A-Z]{2}\d{1,4}[A-Z]{0,2}\d{0,4}/i);
            answer = match ? match[0].toUpperCase() : transcript.split('\n')[0].trim();
          } else {
            answer = transcript.split('\n')[0].trim();
          }
          setForm(f => ({ ...f, [field]: answer }));
          setListening(false);
          setTimeout(() => {
            if (qIndex < questions.length - 1) {
              setQIndex(qIndex + 1);
            } else {
              handleFinishSignup();
            }
          }, 1000);
        }, () => setListening(false));
      });
    }
  }, [readyConfirmed, qIndex, showOnboarding, signupFinished]);

  const handleLogin = () => {
    if (!/^\d{10}$/.test(number)) {
      setError('Enter a valid 10-digit number');
      return;
    }
    setError('');
    navigate('/home');
  };

  const handleSignup = () => {
    if (!/^\d{10}$/.test(number)) {
      setError('Enter a valid 10-digit number');
      return;
    }
    setError('');
    setShowOnboarding(true);
  };

  const handleFinishSignup = () => {
    setSignupFinished(true);
  };

  if (showOnboarding) {
    if (!readyConfirmed) {
      return (
        <Container maxWidth="sm" sx={{ pt: 10, pb: 10 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Typography variant="h5" fontWeight={600}>Onboarding Call</Typography>
            <Typography variant="body1">Hi, this is the onboarding form. I am going to ask you some things. Are you ready?</Typography>
            <Typography variant="body2" color="text.secondary">Please say "yes" to begin.</Typography>
            {listening && <Typography color="primary">Listening...</Typography>}
            <button
              onClick={() => setReadyConfirmed(true)}
              style={{ marginTop: '16px', padding: '12px 32px', borderRadius: '8px', background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: '16px', width: '100%' }}
            >
              I'm ready
            </button>
          </Box>
        </Container>
      );
    }
    if (signupFinished) {
      return (
        <Container maxWidth="sm" sx={{ pt: 10, pb: 10 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Typography variant="h6" color="success.main">Signup Successful!</Typography>
            <Box component="form" width="100%" display="flex" flexDirection="column" gap={2}>
              {questions.map(q => (
                <Box key={q.key}>
                  <Typography variant="body2" fontWeight={500}>{q.label}</Typography>
                  <input
                    type="text"
                    value={form[q.key] || ''}
                    disabled
                    style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px', background: '#f5f5f5' }}
                  />
                </Box>
              ))}
            </Box>
            <button
              onClick={() => { setShowOnboarding(false); setSignupFinished(false); setMode('login'); setNumber(''); setForm({ fullName: '', contact: '', email: '', aadhaar: '', pan: '', vehicleType: '' }); setQIndex(0); }}
              style={{ marginTop: '16px', padding: '12px 32px', borderRadius: '8px', background: '#43a047', color: '#fff', border: 'none', fontWeight: 600, fontSize: '16px', width: '100%' }}
            >
              Go to Login/Signup
            </button>
          </Box>
        </Container>
      );
    }
    // Q&A in progress
    const handleTypedSubmit = (e) => {
      e.preventDefault();
      const field = questions[qIndex].key;
      setForm(f => ({ ...f, [field]: typedAnswer }));
      setTypedAnswer('');
      setTimeout(() => {
        if (qIndex < questions.length - 1) {
          setQIndex(qIndex + 1);
        } else {
          handleFinishSignup();
        }
      }, 300);
    };
    return (
      <Container maxWidth="sm" sx={{ pt: 10, pb: 10 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Typography variant="h5" fontWeight={600}>Onboarding Call</Typography>
          <Typography variant="body1" fontWeight={500}>{questions[qIndex].label}</Typography>
          <Typography variant="body2" color="text.secondary">Please answer after the beep or type below.</Typography>
          {listening && <Typography color="primary">Listening...</Typography>}
          {form[questions[qIndex].key] && (
            <Typography variant="body1" color="success.main" sx={{ mb: 1 }}>
              Answer: {form[questions[qIndex].key]}
            </Typography>
          )}
          <form onSubmit={handleTypedSubmit} style={{ width: '100%' }}>
            <input
              type="text"
              value={typedAnswer}
              onChange={e => setTypedAnswer(e.target.value)}
              placeholder="Type your answer here"
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px', background: '#f5f5f5' }}
            />
            <button type="submit" style={{ marginTop: '8px', padding: '8px 16px', borderRadius: '6px', background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600 }}>
              Submit
            </button>
          </form>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pt: 10, pb: 10 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h5" fontWeight={600}>Login / Signup</Typography>
        <input
          type="tel"
          value={number}
          onChange={e => setNumber(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="Mobile Number"
          style={{ width: '100%', padding: '14px', fontSize: '18px', borderRadius: '8px', border: '1px solid #ccc', textAlign: 'center' }}
          maxLength={10}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" gap={2} mt={2}>
          <button onClick={handleLogin} style={{ background: mode === 'login' ? '#1976d2' : '#eee', color: mode === 'login' ? '#fff' : '#333', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 600 }}>Login</button>
          <button onClick={handleSignup} style={{ background: mode === 'signup' ? '#1976d2' : '#eee', color: mode === 'signup' ? '#fff' : '#333', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 600 }}>Signup</button>
        </Box>
      </Box>
    </Container>
  );
}
export default LoginSignup;
