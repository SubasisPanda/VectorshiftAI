// frontend/src/draggableNode.js - N8N-Style Square Compact Cards
import React, { useState } from 'react';

export const DraggableNode = ({ type, label, icon, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Color mapping for different node types
  const colorMap = {
    customInput: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', hover: 'rgba(59, 130, 246, 0.2)' },
    customOutput: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', hover: 'rgba(16, 185, 129, 0.2)' },
    llm: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', hover: 'rgba(139, 92, 246, 0.2)' },
    text: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', hover: 'rgba(245, 158, 11, 0.2)' },
    database: { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)', hover: 'rgba(99, 102, 241, 0.2)' },
    api: { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)', hover: 'rgba(6, 182, 212, 0.2)' },
    transform: { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.3)', hover: 'rgba(236, 72, 153, 0.2)' },
    filter: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', hover: 'rgba(239, 68, 68, 0.2)' },
    webhook: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', hover: 'rgba(249, 115, 22, 0.2)' }
  };

  const colors = colorMap[type] || { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', hover: 'rgba(107, 114, 128, 0.2)' };

  if (compact) {
    return (
      <div
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        draggable
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: isHovered ? colors.hover : colors.bg,
          border: `1px solid ${isHovered ? colors.border : 'rgba(255, 255, 255, 0.08)'}`,
          cursor: 'grab',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          overflow: 'hidden',
          transform: isHovered ? 'translateY(-1px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered 
            ? '0 8px 16px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.05)' 
            : '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        title={label} // Tooltip
      >
        {/* Icon */}
        <div style={{
          color: isHovered ? 'white' : 'rgba(255, 255, 255, 0.8)',
          transition: 'color 0.2s ease'
        }}>
          {icon}
        </div>
        
        {/* Subtle glow effect on hover */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at center, ${colors.border}40 0%, transparent 70%)`,
            borderRadius: '10px'
          }} />
        )}
      </div>
    );
  }

  // Fallback to original card design for non-compact mode
  return (
    <div
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '16px',
        cursor: 'grab',
        transition: 'all 0.2s ease',
        minWidth: '140px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textAlign: 'center'
      }}
    >
      {icon}
      <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
        {label}
      </span>
    </div>
  );
};
