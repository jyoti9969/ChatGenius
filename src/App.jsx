import { useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "./App.css";
const apiKey = import.meta.env.VITE_USER_API;

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateAnswer = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setError("");
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{ role: "user", parts: [{ text: question }] }],
        }
      );
      setAnswer(
        response.data.candidates[0].content.parts[0].text.trim() ||
          "No response generated."
      );
      setQuestion("");
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>ChatGenius</h1>
        <p>Your AI-powered companion</p>
      </header>
      <main className="main-content">
        <form className="input-section" onSubmit={generateAnswer}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="question-input"
            required
          />
          <button
            type="submit"
            className="generate-button"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader color="#ffffff" size={20} />
            ) : (
              "Get Answer"
            )}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {answer && (
          <div className="answer-section">
            <h2>AI's Response:</h2>
            <p>{answer}</p>
          </div>
        )}
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ChatGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
