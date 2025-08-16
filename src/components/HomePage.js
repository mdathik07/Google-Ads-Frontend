import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import "../HomePage.css";

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");
    if (token && sessionId) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    const endpoint = isSignup
      ? API_ENDPOINTS.AUTH.SIGNUP
      : API_ENDPOINTS.AUTH.LOGIN;

    const payload = isSignup
      ? { username, email, password }
      : { email, password };

    console.log(`🔐 ${isSignup ? 'Signup' : 'Login'} attempt for: ${email}`);
    console.log(`📡 Endpoint: ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      console.log(`📥 Response status: ${response.status}`);
      console.log(`📥 Response headers:`, response.headers);

      const data = await response.json();
      console.log(`📥 Response data:`, data);

      if (response.ok) {
        if (isSignup) {
          setIsSignup(false);
          alert("Signup successful! Please login with your credentials.");
          setEmail("");
          setPassword("");
          setUsername("");
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("sessionId", data.sessionId);
          localStorage.setItem("userId", data.userId);
          
          console.log("✅ Login successful, creating chat session...");
          
          try {
            const sessionResponse = await fetch(API_ENDPOINTS.CHAT.SESSION, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
              },
              body: JSON.stringify({
                sessionId: data.sessionId,
                userId: data.userId
              })
            });

            if (!sessionResponse.ok) {
              throw new Error("Failed to create chat session");
            }

            navigate("/chat");
          } catch (error) {
            console.error("Error creating chat session:", error);
            navigate("/chat");
          }
        }
      } else {
        setErrorMessage(data.error || "Authentication failed!");
        console.error("❌ Authentication failed:", data.error);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      
      if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        setErrorMessage("Request blocked by browser extension or firewall. Please disable ad blockers and try again.");
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage("Cannot connect to server. Please check if the backend is running on localhost:5000");
      } else {
        setErrorMessage("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-homepage">
      <div className="ai-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
          alt="AI Logo"
          className="ai-logo"
        />
        <h1>AdNova AI</h1>
        <p className="ai-subtext">
          {isSignup
            ? "Create your account and start generating high-performing ad campaigns"
            : "Login to your AI ad assistant dashboard"}
        </p>
        
        {/* Error Message Display */}
        {errorMessage && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {errorMessage}
            <br />
            <small>
              💡 Try disabling ad blockers or check if the server is running on localhost:5000
            </small>
          </div>
        )}
        
        <form onSubmit={handleAuth}>
          {isSignup && (
            <input
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "🔄 Processing..." : (isSignup ? "Sign Up" : "Login")}
          </button>
        </form>
        
        <p className="toggle-auth">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <span onClick={() => {
            if (!isLoading) {
              setIsSignup(!isSignup);
              setErrorMessage("");
            }
          }}>
            {isSignup ? "Login" : "Create Account"}
          </span>
        </p>
        
        {/* Debug Information */}
        <div className="debug-info">
          <small>
            🔧 Debug: Server should be running on localhost:5000
            <br />
            📡 API Endpoint: {isSignup ? API_ENDPOINTS.AUTH.SIGNUP : API_ENDPOINTS.AUTH.LOGIN}
          </small>
        </div>
      </div>

      <div className="ai-illustration">
        <img
          src="https://cdn.dribbble.com/users/1615584/screenshots/15701736/media/0eae1d496dd5d589151594ee51ea3ae1.png"
          alt="AI Ad Assistant"
        />
        <p className="tagline">Your Smart Partner in Ad Campaign Generation</p>
      </div>
    </div>
  );
};

export default HomePage;
