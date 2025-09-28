// frontend/src/submit.js 
import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from './store';
import toast from 'react-hot-toast';

export const SubmitButton = () => {
  const { nodes, edges } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const getApiUrl = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    
    if (process.env.NODE_ENV === 'development') {
      return 'http://127.0.0.1:8000';
    }
    
    return 'https://vectorshiftai.onrender.com';
  };

  const API_BASE_URL = getApiUrl();

  const handleSubmit = async () => {
    // Validation checks
    if (nodes.length === 0) {
      toast.error(' Please add some nodes to your pipeline first!', {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          fontWeight: '600',
        },
      });
      return;
    }

    setIsLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading(' Analyzing your pipeline architecture...', {
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: 'white',
        fontWeight: '600',
      },
    });

    try {
      // Prepare data in the format expected by backend
      const pipelineData = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data || {}
        })),
        edges: edges.map(edge => ({
          id: edge.id || `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null
        }))
      };

      console.log(' Sending to:', `${API_BASE_URL}/pipelines/parse`);
      console.log(' Pipeline data:', pipelineData);

      // Send to backend - UPDATED URL connected
      const response = await axios.post(`${API_BASE_URL}/pipelines/parse`, pipelineData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // Increased timeout for production
      });

      const result = response.data;
      setLastResult(result);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Create alert as specified
      const alertMessage = 
        `Pipeline Analysis Results:\n\n` +
        `Number of Nodes: ${result.num_nodes}\n` +
        `Number of Edges: ${result.num_edges}\n` +
        `Is DAG: ${result.is_dag ? 'Yes' : 'No'}`;
      
      alert(alertMessage);

      const dagStatus = result.is_dag ? '✅ Valid DAG' : '❌ Contains Cycles';
      
      toast.success(
        ` Pipeline Analysis Complete!\n\n` +
        ` Nodes: ${result.num_nodes}\n` +
        ` Connections: ${result.num_edges}\n` +
        `${dagStatus}`,
        { 
          duration: 8000,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            maxWidth: '400px',
          },
        }
      );

      // Show additional insights if available
      if (result.cycle_info && result.cycle_info.length > 0) {
        setTimeout(() => {
          toast.error(
            `⚠️ Cycle Detection:\n${result.cycle_info.join('\n')}`,
            { 
              duration: 6000,
              style: {
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                fontWeight: '600',
                fontSize: '13px',
                maxWidth: '450px',
              },
            }
          );
        }, 1500);
      }

      // Log detailed results 
      console.log('✅ Pipeline analysis results:', result);

    } catch (error) {
      console.error('❌ Pipeline analysis failed:', error);
      
      toast.dismiss(loadingToast);

      // Determine error type and show appropriate message
      let errorMessage = '❌ Pipeline analysis failed';
      let errorDetails = '';

      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = '🔌 Cannot connect to backend server';
        errorDetails = `Backend URL: ${API_BASE_URL}\nPlease check if the backend is running.`;
      } else if (error.response) {
        errorMessage = `❌ Server Error (${error.response.status})`;
        errorDetails = error.response.data?.detail?.message || error.response.data?.detail || 'Unknown server error';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = '⏱️ Request timeout';
        errorDetails = 'The analysis is taking too long. Try with a smaller pipeline.';
      } else {
        errorDetails = error.message || 'Please check your connection and try again.';
      }

      // Show alert for error as well 
      alert(`${errorMessage}\n${errorDetails}`);

      toast.error(
        `${errorMessage}\n${errorDetails}`,
        { 
          duration: 15000,
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            maxWidth: '400px',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      
      {/* API Connection Status */}
      <div style={{
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginBottom: '8px'
      }}>
        Analyze your pipeline here
      </div>
          
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          background: isLoading 
            ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' 
            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '16px 32px',
          color: 'white',
          fontWeight: '600',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isLoading 
            ? '0 4px 12px rgba(107, 114, 128, 0.3)'
            : '0 4px 20px rgba(59, 130, 246, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '200px',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.6)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
          }
        }}
      >
        {isLoading ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Analyzing...
          </>
        ) : (
          <>
             Analyze Pipeline
          </>
        )}
      </button>

      {/* Pipeline Stats */}
      {(nodes.length > 0 || edges.length > 0) && (
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: '#60a5fa',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            📊 {nodes.length} Nodes
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: '#34d399',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            🔗 {edges.length} Connections
          </div>
        </div>
      )}

      {/* Last Results Summary */}
      {lastResult && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          maxWidth: '300px',
          textAlign: 'center'
        }}>
          <div style={{
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            Last Analysis
          </div>
          <div style={{
            color: lastResult.is_dag ? '#34d399' : '#f87171',
            fontSize: '11px'
          }}>
            {lastResult.is_dag ? '✅ Valid Pipeline' : '❌ Contains Cycles'}
          </div>
        </div>
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
