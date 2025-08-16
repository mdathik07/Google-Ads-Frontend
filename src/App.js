import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatPage from './components/ChatPage';
import CampaignPage from './components/CampaignPage';
import CampaignSuccess from './components/CampaignSuccess';

function App() {
  const isAuthenticated = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/" />} />
        <Route path="/create-campaign" element={isAuthenticated ? <CampaignPage /> : <Navigate to="/" />} />
        <Route path="/campaign-success" element={isAuthenticated ? <CampaignSuccess /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
