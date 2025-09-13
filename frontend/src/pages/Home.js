import React, { useState, useRef } from 'react';
import { Container, Box, Typography } from '@mui/material';

function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpStep, setHelpStep] = useState(0);
  const [helpTranscript, setHelpTranscript] = useState('');
  const [showSaathi, setShowSaathi] = useState(false);
  const [saathiStep, setSaathiStep] = useState(0);
  const [saathiTranscript, setSaathiTranscript] = useState('');
  const [saathiResponse, setSaathiResponse] = useState('');
  const recognitionRef = useRef(null);

  // Helper: Speak text using browser TTS
  const speak = (text, cb) => {
    const synth = window.speechSynthesis;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-IN';
    // Try to select an Indian voice
    const voices = synth.getVoices();
    const indianVoice = voices.find(v => v.lang === 'en-IN' || (v.name && v.name.toLowerCase().includes('india')));
    if (indianVoice) utter.voice = indianVoice;
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
    recognition.start();
  };

  // Voice safety alert function
  const playSafetyAlert = (text) => {
    speak(text);
  };

  // Emergency assistant flow
  const startHelpFlow = () => {
    setShowHelp(true);
    setHelpStep(0);
    setHelpTranscript('');
    speak('Sahayata mode shuru ho gaya hai. Kripya batayein kya samasya hai?', () => {
      setHelpStep(1);
      let timeoutId;
      const stopListening = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setHelpStep(3); // New step for no speech
        speak('Mujhe kuch sunayi nahi diya. Kripya dobara koshish karein ya button dabayein.', () => {
          setTimeout(() => setShowHelp(false), 4000);
        });
      };
      timeoutId = setTimeout(stopListening, 10000); // 10s timeout
      startListening((transcript) => {
        if (timeoutId) clearTimeout(timeoutId);
        setHelpTranscript(transcript);
        speak('Aapki samasya mil gayi. Hamari team turant madad karegi. Kripya shaant rahein.', () => {
          setHelpStep(2);
          setTimeout(() => setShowHelp(false), 4000);
        });
      }, stopListening);
    });
  };

  // Saathi assistant flow
  const startSaathiFlow = () => {
    setShowSaathi(true);
    setSaathiStep(0);
    setSaathiTranscript('');
    setSaathiResponse('');
    speak('Namaste! Main aapka business manager Saathi hoon. Aap apna sawaal pooch sakte hain, jaise "Aaj ka kharcha kaat ke kitna kamaya?"', () => {
      setSaathiStep(1);
      startListening((transcript) => {
        setSaathiTranscript(transcript);
        // Simple mock responses for demo
        let response = '';
        if (/kharcha|kamaya|earn|expense/i.test(transcript)) {
          response = 'Aapne aaj 1200 rupaye kamaye, kharcha 300 tha, bacha 900 rupaye.';
        } else if (/penalty|reward|late|delay/i.test(transcript)) {
          response = 'Penalty 50 rupaye lagayi gayi kyunki delivery 30 minute late thi.';
        } else if (/business|behtar|better|growth|pichle hafte/i.test(transcript)) {
          response = 'Aapka business pichle hafte se 10% behtar hai.';
        } else {
          response = 'Maaf kijiye, main aapka sawaal samajh nahi paaya. Kripya dobara poochhein.';
        }
        setSaathiResponse(response);
        speak(response, () => {
          setSaathiStep(2);
          setTimeout(() => setShowSaathi(false), 5000);
        });
      }, () => {});
    });
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setResponse('Error connecting to AI backend');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Home</Typography>
      <Typography mb={3}>Welcome to Porter App!</Typography>
      <Box mt={2}>
        <Typography variant="subtitle1" fontWeight={500}>AI Chat Demo</Typography>
        <Box display="flex" gap={1} mt={1}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button onClick={handleSend} disabled={loading || !input} style={{ padding: '12px 20px', borderRadius: '8px', background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500 }}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </Box>
        {response && (
          <Box mt={2} bgcolor="#e3f2fd" p={2} borderRadius={2}>
            <Typography variant="body1">{response}</Typography>
          </Box>
        )}
      </Box>
      {/* Floating Sahayata button */}
      <button
        onClick={startHelpFlow}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          background: '#d32f2f',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          fontSize: '28px',
          fontWeight: 700,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}
        aria-label="Sahayata"
      >
        🛡️
      </button>
      {/* Emergency assistant dialog */}
      {showHelp && (
        <Box position="fixed" top={0} left={0} width="100vw" height="100vh" bgcolor="rgba(0,0,0,0.5)" zIndex={2000} display="flex" alignItems="center" justifyContent="center">
          <Box bgcolor="#fff" p={4} borderRadius={3} minWidth={320} boxShadow={3}>
            <Typography variant="h6" color="error" mb={2}>Sahayata (Help)</Typography>
            {helpStep === 0 && <Typography>AI assistant is starting...</Typography>}
            {helpStep === 1 && <Typography>Listening for your emergency...</Typography>}
            {helpStep === 2 && <Typography>Help is on the way. Stay calm.</Typography>}
            {helpStep === 3 && <Typography color="error">No speech detected. Please try again or press the button for help.</Typography>}
            {helpTranscript && <Typography mt={2} color="primary">You said: {helpTranscript}</Typography>}
          </Box>
        </Box>
      )}
      {/* Floating Saathi button */}
      <button
        onClick={startSaathiFlow}
        style={{
          position: 'fixed',
          bottom: 110,
          right: 32,
          zIndex: 1000,
          background: '#388e3c',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          fontSize: '28px',
          fontWeight: 700,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}
        aria-label="Saathi"
      >
        💼
      </button>
      {/* Saathi assistant dialog */}
      {showSaathi && (
        <Box position="fixed" top={0} left={0} width="100vw" height="100vh" bgcolor="rgba(0,0,0,0.5)" zIndex={2000} display="flex" alignItems="center" justifyContent="center">
          <Box bgcolor="#fff" p={4} borderRadius={3} minWidth={320} boxShadow={3}>
            <Typography variant="h6" color="primary" mb={2}>Saathi (Business Manager)</Typography>
            {saathiStep === 0 && <Typography>Saathi assistant is starting...</Typography>}
            {saathiStep === 1 && <Typography>Listening for your question...</Typography>}
            {saathiStep === 2 && <Typography color="success.main">{saathiResponse}</Typography>}
            {saathiTranscript && <Typography mt={2} color="primary">You said: {saathiTranscript}</Typography>}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default Home;
