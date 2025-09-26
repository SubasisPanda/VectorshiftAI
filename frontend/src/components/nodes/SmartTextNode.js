// frontend/src/components/nodes/SmartTextNode.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../../store';

export const SmartTextNode = ({ id, data }) => {
  const { updateNodeField } = useStore();
  const [text, setText] = useState(data?.text || 'Hello {{name}}, welcome to {{platform}}!');
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 280, height: 140 });
  const textareaRef = useRef(null);

  // Extract variables from text using regex
  const extractVariables = useCallback((inputText) => {
    const variableRegex = /\{\{(\w+)\}\}/g;
    const matches = [];
    let match;
    
    while ((match = variableRegex.exec(inputText)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    
    return matches;
  }, []);

  // Update variables when text changes
  useEffect(() => {
    const newVariables = extractVariables(text);
    setVariables(newVariables);
    
    updateNodeField(id, 'text', text);
    updateNodeField(id, 'variables', newVariables);
  }, [text, extractVariables, updateNodeField, id]);

  // Auto-resize 
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate scrollHeight 
    textarea.style.height = 'auto';
    
    // Calculate new dimensions
    const newHeight = Math.max(80, Math.min(200, textarea.scrollHeight));
    const newWidth = Math.max(280, Math.min(400, text.length * 6 + 120));
    
    textarea.style.height = newHeight + 'px';
    
    setDimensions({
      width: newWidth,
      height: newHeight + 100 
    });
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div
      style={{
        width: dimensions.width,
        minHeight: dimensions.height,
        background: 'linear-gradient(135deg, #ca8a04 0%, #ea580c 100%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/*  Input Handles for Variables */}
      {variables.map((variable, index) => (
        <React.Fragment key={`${variable}-${index}`}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${variable}`}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#3b82f6',
              border: '2px solid white',
              top: variables.length === 1 ? '50%' : `${30 + (index * 40)}px`,
              left: '-6px',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
            }}
          />
          {/* Variable Label */}
          <div
            style={{
              position: 'absolute',
              left: '-12px',
              top: variables.length === 1 ? '50%' : `${30 + (index * 40)}px`,
              transform: 'translate(-100%, -50%)',
              background: 'rgba(59, 130, 246, 0.9)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              zIndex: 10
            }}
          >
            {variable}
          </div>
        </React.Fragment>
      ))}

      {/* Header */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '12px' }}>📝</span>
        </div>
        <h3 style={{
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          margin: 0,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Smart Text
        </h3>
        <div style={{
          marginLeft: 'auto',
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '2px 6px',
          borderRadius: '8px',
          fontSize: '10px',
          color: 'white',
          fontWeight: '600'
        }}>
          {variables.length} vars
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '12px' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text with {{variables}} to create dynamic inputs..."
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '8px',
            color: 'white',
            fontSize: '13px',
            fontFamily: 'monospace',
            resize: 'none',
            outline: 'none',
            minHeight: '60px',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* Variable Preview */}
        {variables.length > 0 && (
          <div style={{
            marginTop: '8px',
            padding: '6px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            fontSize: '11px'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
              Detected variables:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {variables.map((variable, index) => (
                <span
                  key={index}
                  style={{
                    background: 'rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#10b981',
          border: '2px solid white',
          top: '50%',
          right: '-6px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
        }}
      />
    </div>
  );
};
