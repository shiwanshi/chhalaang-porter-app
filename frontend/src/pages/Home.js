import React, { useState, useRef } from 'react';
import { Container, Box, Typography } from '@mui/material';

// Gemini API endpoint and key (for demo, use env/backend for production)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = '';

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
    let active = true;
    const conversationLoop = () => {
      if (!active) return;
      setHelpStep(1);
      let timeoutId;
      const stopListening = () => {
        if (!active) return;
        if (timeoutId) clearTimeout(timeoutId);
        setHelpStep(3);
        speak('Mujhe kuch sunayi nahi diya. Kripya dobara koshish karein ya button dabayein.', () => {
          setTimeout(() => { setShowHelp(false); active = false; }, 4000);
        });
      };
      timeoutId = setTimeout(stopListening, 10000);
      startListening(async (transcript) => {
        if (!active) return;
        if (timeoutId) clearTimeout(timeoutId);
        setHelpTranscript(transcript);
        speak('Aapne kaha: ' + transcript, async () => {
          try {
            const prompt = `Give to-do for this. Always: short, clear Hindi. Avoid technical words, use simple language. User: ${transcript}`;
            const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const geminiData = await geminiRes.json();
            const geminiReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Madad aa rahi hai, shaant rahiye.';
            speak(geminiReply, () => {
              setHelpStep(2);
              // Continue conversation unless dialog closed
              setTimeout(() => { if (active) conversationLoop(); }, 1000);
            });
          } catch (err) {
            speak('AI se sampark nahi ho paaya. Kripya dobara koshish karein.', () => {
              setHelpStep(3);
              setTimeout(() => { setShowHelp(false); active = false; }, 4000);
            });
          }
        });
      }, stopListening);
    };
    speak('Sahayata mode shuru ho gaya hai. Kripya batayein kya samasya hai?', conversationLoop);
  };

  // Saathi assistant flow
  const startSaathiFlow = () => {
    setShowSaathi(true);
    setSaathiTranscript('');
    setSaathiResponse('');
    setShowSaathi(true);
    setSaathiStep(0);
    setSaathiTranscript('');
    setSaathiResponse('');
    let active = true;
    let listening = false;
    const conversationLoop = () => {
      if (!active || listening) return;
      listening = true;
      setSaathiStep(1);
      setSaathiTranscript(''); // Clear transcript before listening
      setSaathiResponse(''); // Clear response before listening
      startListening(async (transcript) => {
        if (!active) { listening = false; return; }
        listening = false;
        setSaathiStep(1);
        setSaathiTranscript(transcript);
        // Check for empty or unclear transcript
        if (!transcript || transcript.trim().length < 3) {
          const msg = 'Kripya apna sawaal saaf taur par poochhein.';
          setSaathiResponse(msg);
          speak(msg, () => {
            setSaathiStep(2);
            setTimeout(() => { if (active) conversationLoop(); }, 1000);
          });
          return;
        }
        try {
          const contextStr = JSON.stringify(DRIVER_CONTEXT);
          const prompt = `Tum Porter Saathi ho — ek dostana, simple Hindi bolne wala AI assistant. Driver ki madad karo unke business samajhne mein. Always: short, clear Hindi + thoda encouragement. Numbers ko tod kar samjhao (earnings - expenses = net). Avoid technical shabd, use simple language. Use ONLY this CONTEXT for answers: ${contextStr}\nUser: ${transcript}`;
          const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });
          const geminiData = await geminiRes.json();
          const geminiReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf kijiye, main aapka sawaal samajh nahi paaya.';
          setSaathiResponse(geminiReply);
          speak(geminiReply, () => {
            setSaathiStep(2);
            setTimeout(() => { if (active) conversationLoop(); }, 1000);
          });
        } catch (err) {
          setSaathiResponse('AI se sampark nahi ho paaya. Kripya dobara koshish karein.');
          speak('AI se sampark nahi ho paaya. Kripya dobara koshish karein.', () => {
            setSaathiStep(2);
            setTimeout(() => { if (active) conversationLoop(); }, 1000);
          });
        }
      }, () => { listening = false; });
    };
    speak('Namaste! "', conversationLoop);
  };

// Mock driver context for Saathi assistant
const DRIVER_CONTEXT = {
  profile: {
    name: "Ramesh Kumar",
    city: "Bangalore",
    joined_date: "2023-08-15",
    vehicle: { type: "Bike", model: "Honda Shine", registration: "KA-01-AB-1234" },
    rating: 4.78,
    phone: "+91-98xxxxxx45"
  },
  earnings: {
    "2025-09-12": {
      total_earnings: 1800,
      expenses: { fuel: 300, commission: 100, toll: 50 },
      net_earnings: 1350,
      completed_trips: 12,
      cash_collected: 900,
      wallet_balance: 450
    },
    "2025-09-13": {
      total_earnings: 2150,
      expenses: { fuel: 350, commission: 110, parking: 30 },
      net_earnings: 1660,
      completed_trips: 15,
      cash_collected: 1200,
      wallet_balance: 520
    },
    "2025-09-14": {
      total_earnings: 1620,
      expenses: { fuel: 280, commission: 95 },
      net_earnings: 1245,
      completed_trips: 11,
      cash_collected: 700,
      wallet_balance: 420
    }
  },
  penalties: [
    { id: "PEN_01", reason: "Late Delivery", amount: 50, details: "30 min delay" },
    { id: "PEN_02", reason: "Helmet Not Worn", amount: 100, details: "Warned by traffic cam" }
  ],
  rewards: [
    { id: "REW_01", reason: "Weekly Target Achieved", amount: 200, details: "Completed 60 trips this week" },
    { id: "REW_02", reason: "5-Star Streak", amount: 150, details: "10 consecutive 5-star ratings" }
  ],
  shifts: [
    { date: "2025-09-12", start: "08:00", end: "18:00" },
    { date: "2025-09-13", start: "09:00", end: "17:00" }
  ],
  goals: {
    weekly_trips_target: 70,
    weekly_trips_done: 33,
    weekly_earnings_target: 9000
  }
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
