// frontend\src\App.js
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './styles/global.css';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0a1aa1 0%rgba(26, 13, 46, 0.57)2e 25%, #2d1b3d9e 50%, #1a0d2eaa 75%, #0c0a1aab 100%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.3,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
        backgroundSize: '20px 20px',
        pointerEvents: 'none'
      }} />
      
      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <PipelineToolbar />
        <PipelineUI />
        
        {/* Submit Button */}
        <div style={{ 
          position: 'fixed', 
          bottom: '24px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 50 
        }}>
          <SubmitButton />
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
          },
        }}
      />
    </div>
  );
}

export default App;



