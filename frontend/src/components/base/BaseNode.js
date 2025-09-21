// frontend/src/components/base/BaseNode.js 
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../../store';

const DeleteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

export const BaseNode = ({ 
  id, 
  data, 
  title, 
  icon, 
  inputs = [], 
  outputs = [], 
  children,
  className = "",
  minWidth = 200,
  minHeight = 100,
  gradient = "gradient-llm"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { deleteNode } = useStore();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div 
      className={`node-base ${gradient} ${className}`}
      style={{ 
        minWidth, 
        minHeight, 
        position: 'relative',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <button
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.8)',
            zIndex: 1000,
            transition: 'all 0.2s ease',
            animation: 'fadeInScale 0.2s ease-out'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.6), 0 0 0 2px rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.8)';
          }}
        >
          <DeleteIcon />
        </button>
      )}

      {/*  Input Handles */}
      {inputs.map((input, index) => (
        <Handle 
          key={input.id} 
          type="target" 
          position={Position.Left} 
          id={input.id}
          style={{ 
            width: '12px',
            height: '12px',
            backgroundColor: '#3b82f6',
            border: '2px solid white',
            top: inputs.length === 1 ? '50%' : `${(index + 1) * 100 / (inputs.length + 1)}%` 
          }} 
        />
      ))}
      
      {/* Node Header */}
      <div className="flex items-center gap-2 mb-3">
        <div style={{ flexShrink: 0 }}>
          {icon}
        </div>
        <h3 className="text-white font-semibold text-sm" style={{ 
          color: 'white', 
          fontWeight: '600', 
          fontSize: '14px',
          margin: 0 
        }}>
          {title}
        </h3>
      </div>
      
      {/* Node Content */}
      <div>
        {children}
      </div>
      
      {/*  Output Handles */}
      {outputs.map((output, index) => (
        <Handle 
          key={output.id} 
          type="source" 
          position={Position.Right}
          id={output.id}
          style={{ 
            width: '12px',
            height: '12px',
            backgroundColor: '#10b981',
            border: '2px solid white',
            top: outputs.length === 1 ? '50%' : `${(index + 1) * 100 / (outputs.length + 1)}%` 
          }} 
        />
      ))}

      {/*  animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
