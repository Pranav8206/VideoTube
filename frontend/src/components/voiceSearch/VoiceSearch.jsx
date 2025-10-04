import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { AppContext } from "../../context/context";
import { Mic, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VoiceSearchBox = () => {
  const {
    showVoiceSearchBox,
    setShowVoiceSearchBox,
    setSearchQuery,
    setShowingSearchResults,
  } = useContext(AppContext);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setTranscript(text);

      if (event.results[0].isFinal) {
        setSearchQuery(text);
        setShowingSearchResults(true);
        navigate(`/s/${encodeURIComponent(text)}`);
        setShowVoiceSearchBox(false);
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  }, [
    navigate,
    setSearchQuery,
    setShowingSearchResults,
    setShowVoiceSearchBox,
  ]);

  useEffect(() => {
    if (showVoiceSearchBox) {
      startListening();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setTranscript("");
      setListening(false);
    }
  }, [showVoiceSearchBox, startListening]);

  // Close with Escape key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setShowVoiceSearchBox(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowVoiceSearchBox]);

  if (!showVoiceSearchBox) return null;

  return (
    <div className="fixed inset-0 flex z-50 justify-center p-2 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setShowVoiceSearchBox(false)}
        className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm cursor-pointer z-50"
      >
        {/* Popup */}
        <div
          className="relative w-full max-w-md mx-auto p-2 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-xl shadow-xl p-5 sm:p-6 flex flex-col items-center">
            {/* Mic Button */}
            <button
              onClick={startListening}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all cursor-pointer ${
                listening ? "bg-red-500 animate-pulse" : "bg-primary"
              }`}
            >
              <Mic size={28} />
            </button>
            <button
              className="absolute top-1 right-1 p-1 text-gray-400 cursor-pointer"
              onClick={() => setShowVoiceSearchBox(false)}
            >
              <X size={18} />
            </button>
            <p className="text-xs text-gray-600 ">
              {listening ? "" : "Tap the mic to start"}
            </p>

            {/* Transcript Display */}
            <div className="min-h-[48px] w-full text-center text-black font-semibold overflow-hidden text-ellipsis px-2 sm:px-4 pt-3">
              {transcript || (listening ? "Speak now..." : "I'm waiting...")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearchBox;
