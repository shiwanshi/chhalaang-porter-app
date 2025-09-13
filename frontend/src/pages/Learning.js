import React, { useState, useRef } from "react";
import guidesData from '../guides.json';
import { Container, Typography, Card, CardContent, Box, Button, Chip, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

function findGuide(query) {
  if (!query) return null;
  const text = query.toLowerCase();
  return guidesData.find((g) =>
    g.topic.toLowerCase().split(" ").some((word) => text.includes(word))
  ) || null;
}

function Learning() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);

      const found = findGuide(text);
      setResult(found);

      if (found) {
        // Speak the summary
        const utter = new window.SpeechSynthesisUtterance(found.summary);
        utter.lang = "en-US";
        window.speechSynthesis.speak(utter);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 8, minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)', borderRadius: 6, boxShadow: '0 8px 32px rgba(44,62,80,0.12)', px: { xs: 1, sm: 3 } }}>
      <Box textAlign="center" mb={3}>
        <Chip icon={<SchoolIcon />} label="Saathi - Your Voice Guide" color="primary" sx={{ fontSize: 20, fontWeight: 700, px: 2, py: 2, borderRadius: 2, mb: 2 }} />
        <Typography variant="h5" color="text.secondary" mb={2} sx={{ fontWeight: 500 }}>
          Ask about driving, documents, insurance, and more!
        </Typography>
        <Button
          onClick={startListening}
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: 8, px: 4, py: 1.5, fontSize: 20, boxShadow: 3 }}
          startIcon={<span role="img" aria-label="mic">🎤</span>}
        >
          Speak
        </Button>
      </Box>
      {transcript && (
        <Typography mt={2} fontStyle="italic" textAlign="center" color="#1976d2">
          You said: <b>{transcript}</b>
        </Typography>
      )}
      {result && (
        <Card sx={{ mt: 4, mb: 2, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(255,255,255,0.98)' }}>
          <CardContent>
            <Typography variant="h5" color="primary" fontWeight={700} mb={1}>{result.title}</Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>{result.summary}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" color="success.main" fontWeight={700} mb={1}>Steps:</Typography>
            <ol style={{ paddingLeft: 20 }}>
              {result.steps.map((step, i) => (
                <li key={i} style={{ marginBottom: "8px", fontSize: 16 }}>{step}</li>
              ))}
            </ol>
            <Box mt={3} textAlign="center">
              <iframe
                width="100%"
                height="320"
                src={result.video}
                title="Guide Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "15px" }}
              ></iframe>
            </Box>
          </CardContent>
        </Card>
      )}
      {transcript && !result && (
        <Typography textAlign="center" color="error" mt={4} fontWeight={700}>
          No guide found for your query.
        </Typography>
      )}
    </Container>
  );
}

export default Learning;
