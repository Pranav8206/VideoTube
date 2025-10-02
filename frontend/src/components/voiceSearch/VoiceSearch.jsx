import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../context/context";
import { Mic } from "lucide-react";
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

  const startListening = () => {
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
        setSearchQuery(text); // save to context
        setShowingSearchResults(true);
        navigate(`/s/${encodeURIComponent(text)}`); // go to search page
        setShowVoiceSearchBox(false); // close popup
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Auto start when popup opens
  useEffect(() => {
    if (showVoiceSearchBox) {
      startListening();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setTranscript("");
      setListening(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVoiceSearchBox]);

  // Close with Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowVoiceSearchBox(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowVoiceSearchBox]);

  if (!showVoiceSearchBox) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowVoiceSearchBox(false)}
        className="fixed inset-0 bg-black/30 z-30 cursor-pointer "
      />

      {/* Popup */}
      <div
        className="fixed top-2 
      left-1/12 w-10/12 right-1/12 
      sm:left-1/5 sm:w-3/5 sm:right-1/5 
      md:left-1/4 md:w-1/2 md:right-1/4
      lg:left-1/3 lg:w-1/3 lg:right-1/3
      border flex items-start my-2 justify-center z-30"
      >
        <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col items-center">
            <button
              onClick={startListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition cursor-pointer ${
                listening ? "bg-red-500 animate-pulse" : "bg-primary"
              }`}
            >
              <Mic size={28} />
            </button>
            <p className="text-xs mt-0">
              {listening ? "" : "Tap the mic to try again"}
            </p>
          </div>
          <div className="min-h-[48px] w-full text-center text-black font-semibold overflow-hidden text-ellipsis">
            {transcript || (listening ? "Speak now..." : "I'm waiting...")}
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceSearchBox;
