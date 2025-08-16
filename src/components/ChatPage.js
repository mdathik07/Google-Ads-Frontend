import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css"; // Import the CSS file

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      axios
        .get(`http://localhost:5000/api/chatbot/sessionId/${sessionId}`)
        .then((response) => {
          setConversation(response.data.conversation);
        })
        .catch((error) => {
          console.error("Error fetching conversation:", error);
        });
    }
  }, [sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { sender: "user", message };
    setConversation((prev) => [...prev, newMessage]);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot/conversation", {
        message,
        sessionId,
      });

      setSessionId(response.data.sessionId);
      localStorage.setItem("sessionId", response.data.sessionId);

      const botResponse = { sender: "bot", message: response.data.reply };
      setConversation((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    setSessionId(null);
    setConversation([]);
    navigate("/");
  };

  const handleCreateCampaign = () => {
    navigate("/create-campaign");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Chat Assistant</h2>
        <div>
          <button className="btn campaign-btn" onClick={handleCreateCampaign}>Create Campaign</button>
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Chat Box */}
      <div className="chat-box-container">
        <div className="chat-box">
          {conversation.map((msg, index) => (
            <div key={index} className={msg.sender === "user" ? "message user" : "message bot"}>
              <strong>{msg.sender === "user" ? "You:" : "AI:"}</strong>
              {msg.sender === "bot" ? (
                msg.message.split('\n').map((line, lineIndex) => (
                  <p key={lineIndex}>{line}</p>
                ))
              ) : (
                <p>{msg.message}</p>
              )}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* Input Field */}
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
