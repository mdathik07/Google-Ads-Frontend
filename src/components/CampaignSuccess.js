import React from 'react';
import { useNavigate } from 'react-router-dom';

function CampaignSuccess() {
  const navigate = useNavigate();

  const handleBackToChat = () => {
    navigate('/chat');
  };

  return (
    <div style={styles.container}>
      <div style={styles.successCard}>
        <h1 style={styles.title}>Campaign Launched Successfully!</h1>
        <p style={styles.message}>Your campaign has been successfully launched and is now active.</p>
        <button style={styles.backButton} onClick={handleBackToChat}>
          Back to Chat
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%'
  },
  title: {
    fontSize: '24px',
    marginBottom: '1rem',
    color: '#4CAF50'
  },
  message: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '2rem'
  },
  backButton: {
    background: '#2196F3',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  }
};

export default CampaignSuccess; 