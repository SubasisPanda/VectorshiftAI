// C:\Users\subas\OneDrive\Desktop\VectorShift\frontend\src\App.js
// frontend/src/App.js - Fixed layout
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './styles/globals.css';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0a1aa1 0%rgba(26, 13, 46, 0.57)2e 25%, #2d1b3d9e 50%, #1a0d2eaa 75%, #0c0a1aab 100%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Background Pattern */}
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



// frontend/src/App.js - Complete redesign
// import React from 'react';
// import { motion } from 'framer-motion';
// import { Toaster } from 'react-hot-toast';
// import { PipelineToolbar } from './toolbar';
// import { PipelineUI } from './ui';
// import { SubmitButton } from './submit';
// import './styles/globals.css';

// function App() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
//       {/* Background Pattern */}
//       <div className="fixed inset-0 opacity-30">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
//         <div className="absolute inset-0" style={{
//           backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
//           backgroundSize: '20px 20px'
//         }} />
//       </div>
      
//       {/* Main Content */}
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="relative z-10"
//       >
//         {/* Toolbar */}
//         <PipelineToolbar />
        
//         {/* Main Pipeline Area */}
//         <div className="relative">
//           <PipelineUI />
//         </div>
        
//         {/* Submit Section */}
//         <motion.div 
//           initial={{ y: 100, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.5 }}
//           className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
//         >
//           <SubmitButton />
//         </motion.div>
//       </motion.div>
      
//       {/* Toast Notifications */}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: 'rgba(15, 23, 42, 0.9)',
//             color: 'white',
//             border: '1px solid rgba(255, 255, 255, 0.1)',
//             borderRadius: '12px',
//             backdropFilter: 'blur(8px)',
//           },
//           success: {
//             iconTheme: {
//               primary: '#10b981',
//               secondary: 'white',
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: '#ef4444',
//               secondary: 'white',
//             },
//           },
//         }}
//       />
//     </div>
//   );
// }

// export default App;
