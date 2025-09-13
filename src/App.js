
import React, { useState, useRef } from "react";

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Box, Typography, AppBar, Toolbar, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import guides from "./guides.json";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCnbGnysQtChMhU3s7VSi8VykBfWqLv2bI");
// function Guide() {
//   const [messages, setMessages] = useState([]);
//   const [listening, setListening] = useState(false);
//   const recognitionRef = useRef(null);

//   const startListening = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition not supported in this browser.");
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.lang = "en-IN";
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = false;

//     recognitionRef.current.onstart = () => setListening(true);
//     recognitionRef.current.onend = () => setListening(false);

//     recognitionRef.current.onresult = async (event) => {
//       const transcript = event.results[0][0].transcript;
//       setMessages((prev) => [...prev, { role: "user", text: transcript }]);
//       await getGeminiResponse(transcript);
//     };

//     recognitionRef.current.start();
//   };

//   const getGeminiResponse = async (userInput) => {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-native-audio-dialog" });
//     const result = await model.generateContent(userInput);
//     const text = result.response.text();
//     setMessages((prev) => [...prev, { role: "ai", text }]);
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-6 p-6">
//       {/* Left side: Video */}
//       <div className="flex-1">
//         <h2 className="text-xl font-bold mb-2">
//           📁 How to Upload Documents to DigiLocker
//         </h2>
//         <div className="aspect-video w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
//           <iframe
//   width="100%"
//   height="315"
//   src="https://www.youtube.com/embed/bHFvKToEvj8"
//   title="How to upload documents to DigiLocker"
//   frameBorder="0"
//   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//   allowFullScreen
// ></iframe>

//         </div>
//       </div>

//       {/* Right side: Voice assistant */}
//       <div className="flex-1 bg-gray-50 rounded-xl shadow-md p-4 flex flex-col">
//         <h2 className="text-xl font-bold mb-4">🎙️ Ask Saathi (AI Guru)</h2>

//         <div className="flex-1 overflow-y-auto space-y-3 border rounded p-2 mb-4 bg-white">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`p-2 rounded-lg ${
//                 msg.role === "user"
//                   ? "bg-blue-100 self-end"
//                   : "bg-green-100 self-start"
//               }`}
//             >
//               <strong>{msg.role === "user" ? "You: " : "Saathi: "}</strong>
//               {msg.text}
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={startListening}
//           className={`px-6 py-3 rounded-full text-white font-semibold ${
//             listening ? "bg-red-500 animate-pulse" : "bg-blue-600"
//           }`}
//         >
//           {listening ? "Listening..." : "🎤 Speak"}
//         </button>
//       </div>
//     </div>
//   );
// }


function Guide() {
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

      const found = guides.find((g) =>
        g.topic.toLowerCase().split(" ").some((word) => text.includes(word))
      );
      setResult(found || null);

      if (found) {
        // Speak the summary
        const utter = new SpeechSynthesisUtterance(found.summary);
        utter.lang = "en-US";
        speechSynthesis.speak(utter);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div style={{
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(to bottom, #e0f7fa, #ffffff)",
      minHeight: "100vh"
    }}>
      <h1 style={{ textAlign: "center", color: "#00796b" }}>Saathi - Your Voice Guide</h1>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={startListening}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            background: "#00796b",
            color: "white",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          🎤 Speak
        </button>
      </div>

      {transcript && (
        <p style={{ marginTop: "15px", fontStyle: "italic", textAlign: "center", color: "#004d40" }}>
          You said: <b>{transcript}</b>
        </p>
      )}

      {result && (
        <div style={{
          marginTop: "30px",
          background: "#ffffff",
          borderRadius: "15px",
          padding: "20px",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
        }}>
          <h2 style={{ color: "#00796b" }}>{result.title}</h2>
          <p style={{ fontSize: "16px", marginBottom: "15px" }}>{result.summary}</p>

          <h3 style={{ color: "#004d40" }}>Steps:</h3>
          <ol>
            {result.steps.map((step, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>{step}</li>
            ))}
          </ol>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <iframe
              width="100%"
              height="360"
              src={result.video}
              title="Guide Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: "15px" }}
            ></iframe>
          </div>
        </div>
      )}

      {transcript && !result && (
        <p style={{ textAlign: "center", color: "#d32f2f", marginTop: "20px" }}>
          No guide found for your query.
        </p>
      )}
    </div>
  );
}





function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // 🎙️ Start/stop speech recognition
  function toggleMic() {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.lang = "en-US";
      recog.interimResults = false;
      recog.onresult = async (e) => {
        const text = e.results[0][0].transcript;
        addMessage("user", text);
        await sendToGemini(text);
      };
      recog.onend = () => setListening(false);
      recognitionRef.current = recog;
    }

    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  }

  // 💬 Add message to UI
  function addMessage(role, content) {
    setMessages((prev) => [...prev, { role, content }]);
  }

  // 🤖 Call Gemini API
  async function sendToGemini(userText) {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=AIzaSyCnbGnysQtChMhU3s7VSi8VykBfWqLv2bI",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userText }] }],
        }),
      }
    );
    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I didn’t get that.";
    addMessage("assistant", reply);
    speak(reply); // optional: speak the reply
  }

  // 🔊 Speak out the reply
  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-xl max-w-xs ${
              m.role === "user"
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-center">
        <button
          onClick={toggleMic}
          className={`px-6 py-3 rounded-full text-white text-lg font-semibold transition ${
            listening ? "bg-red-500 animate-pulse" : "bg-indigo-600"
          }`}
        >
          {listening ? "Listening..." : "🎙️ Speak"}
        </button>
      </div>
    </div>
  );
}


function Orders() {
  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Orders</Typography>
      <Typography>Your orders will appear here.</Typography>
    </Container>
  );
}
function Profile() {
  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Profile</Typography>
      <Typography>Manage your profile here.</Typography>
    </Container>
  );
}



function Navigation() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (value === 0) navigate('/');
    if (value === 1) navigate('/orders');
    if (value === 2) navigate('/profile');
    if(value === 3) navigate('/guide')
  }, [value, navigate]);
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Orders" icon={<AssignmentIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
        <BottomNavigationAction label="Guide" icon={<AssignmentIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pb: 7 }}>
        <Box sx={{ width: '100%', bgcolor: '#ffecb3', color: '#795548', textAlign: 'center', py: 1, fontWeight: 600, fontSize: 16, letterSpacing: 1 }}>
          MOBILE PREVIEW
        </Box>
        <AppBar position="fixed" color="primary" sx={{ top: 32, left: 0, right: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Porter App
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ pt: 10 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </Box>
        <Navigation />
      </Box>
    </Router>
  );
}

export default App;
