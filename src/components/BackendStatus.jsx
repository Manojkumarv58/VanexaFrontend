import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BackendStatus() {
  const [status, setStatus] = useState({ loading: true, connected: false, message: '' });

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
        console.log('🔗 Checking backend at:', API_URL);
        
        // Try health endpoint first, fallback to products endpoint
        let response;
        try {
          response = await axios.get(`${API_URL}/api/health`);
        } catch (healthError) {
          // If health endpoint doesn't exist, try products endpoint
          console.log('⚠️ Health endpoint not found, trying products endpoint...');
          response = await axios.get(`${API_URL}/api/v1/product?limit=1`);
        }
        
        setStatus({ 
          loading: false, 
          connected: true, 
          message: response.data.message || 'Backend is reachable',
          url: API_URL
        });
        console.log('✅ Backend connected:', response.data);
      } catch (error) {
        setStatus({ 
          loading: false, 
          connected: false, 
          message: error.response?.status === 401 ? 'Connected (Auth required)' : error.message,
          url: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
        });
        console.error('❌ Backend connection failed:', error);
      }
    };

    checkBackend();
  }, []);

  if (status.loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 shadow-lg z-50">
        <p className="text-sm text-yellow-700">🔄 Checking backend...</p>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 border rounded-lg px-4 py-2 shadow-lg z-50 ${
      status.connected 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <p className={`text-sm font-semibold ${
        status.connected ? 'text-green-700' : 'text-red-700'
      }`}>
        {status.connected ? '✅' : '❌'} Backend: {status.connected ? 'Connected' : 'Disconnected'}
      </p>
      <p className="text-xs text-gray-600 mt-1 max-w-xs truncate" title={status.url}>
        {status.url}
      </p>
      {status.message && (
        <p className="text-xs text-gray-500 mt-1">{status.message}</p>
      )}
    </div>
  );
}
