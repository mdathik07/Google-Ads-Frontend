import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

function CampaignPage() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("sessionId");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.post(API_ENDPOINTS.CAMPAIGN.GENERATE, { sessionId });
        setCampaign(res.data.campaign);
      } catch (err) {
        console.error("Error generating campaign:", err);
        setError("Failed to generate campaign.");
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) fetchCampaign();
  }, [sessionId]);

  const handleLaunchCampaign = async () => {
    if (!campaign) return;
    try {
      const res = await axios.post(API_ENDPOINTS.CAMPAIGN.LAUNCH, {
        campaign: campaign
      });
      setCampaign(res.data.campaign);
      navigate('/campaign-success');
    } catch (err) {
      console.error("Error launching campaign:", err);
      setError("Failed to launch campaign.");
    }
  };

  const handleBackToChat = () => {
    navigate("/chat");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Generated Campaign</h1>
      {loading ? (
        <p style={styles.loadingText}>Loading campaign details...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : campaign ? (
        <div style={styles.jsonContainer}>
          <pre style={styles.jsonContent}>
            {JSON.stringify(campaign, null, 2)}
          </pre>
          <div style={styles.buttonContainer}>
            <button style={styles.launchButton} onClick={handleLaunchCampaign}>
              Launch Campaign
            </button>
            <button style={styles.backButton} onClick={handleBackToChat}>
              Back to Chat
            </button>
          </div>
        </div>
      ) : (
        <p style={styles.errorText}>No campaign data available.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  title: {
    fontSize: "24px",
    marginBottom: "1rem",
    color: "#333"
  },
  loadingText: {
    fontSize: "18px",
    color: "#666"
  },
  errorText: {
    color: "red",
    fontSize: "18px"
  },
  jsonContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px"
  },
  jsonContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflowX: "auto",
    fontSize: "14px",
    lineHeight: "1.5",
    textAlign: "left",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    border: "1px solid #ddd",
    marginBottom: "20px",
    color: "#333",
    fontFamily: "monospace"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px"
  },
  launchButton: {
    background: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s"
  },
  backButton: {
    background: "#2196F3",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s"
  }
};

export default CampaignPage;
