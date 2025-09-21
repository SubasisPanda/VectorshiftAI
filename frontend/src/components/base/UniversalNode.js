// frontend/src/components/base/UniversalNode.js
import React, { useState } from 'react';
import { BaseNode } from './BaseNode';
import { getNodeConfig } from '../../config/nodeConfigs';
import { useStore } from '../../store';
import { SmartTextNode } from '../nodes/SmartTextNode';

export const UniversalNode = ({ id, data, type }) => {
  const { updateNodeField } = useStore();
  const config = getNodeConfig(type);
  const [localData, setLocalData] = useState(data || {});

  // Special handling for SmartTextNode
  if (type === 'text') {
    return <SmartTextNode id={id} data={data} />;
  }

  if (!config) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        border: '1px solid #ef4444',
        borderRadius: '12px',
        padding: '16px',
        minWidth: '200px',
        minHeight: '100px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ color: '#fca5a5', fontSize: '14px', textAlign: 'center' }}>
          Unknown node type: {type}
        </div>
      </div>
    );
  }

  const handleFieldChange = (fieldName, value) => {
    const newData = { ...localData, [fieldName]: value };
    setLocalData(newData);
    updateNodeField(id, fieldName, value);
  };

  const renderField = (field) => {
    const value = localData[field.name] || '';

    const inputStyle = {
      width: '100%',
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      padding: '8px 12px',
      color: 'white',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      outline: 'none'
    };

    const focusHandler = (e) => {
      e.target.style.borderColor = '#3b82f6';
      e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
    };

    const blurHandler = (e) => {
      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      e.target.style.boxShadow = 'none';
    };

    switch (field.type) {
      case 'text':
      case 'password':
      case 'number':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={inputStyle}
            onFocus={focusHandler}
            onBlur={blurHandler}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            style={{
              ...inputStyle,
              resize: 'vertical',
              fontFamily: 'inherit',
              minHeight: '60px'
            }}
            onFocus={focusHandler}
            onBlur={blurHandler}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={inputStyle}
            onFocus={focusHandler}
            onBlur={blurHandler}
          >
            {field.options?.map(option => (
              <option 
                key={option.value} 
                value={option.value}
                style={{ 
                  background: '#1e293b', 
                  color: 'white' 
                }}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <div style={{ 
            color: '#fca5a5', 
            fontSize: '12px',
            padding: '4px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '4px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            Unknown field type: {field.type}
          </div>
        );
    }
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title={config.title}
      icon={config.icon}
      inputs={config.inputs}
      outputs={config.outputs}
      gradient={config.gradient}
      minWidth={250}
      minHeight={120}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
      }}>
        {config.fields?.map(field => (
          <div key={field.name} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px' 
          }}>
            <label style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '12px', 
              fontWeight: '500',
              marginBottom: '2px'
            }}>
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
        
        {config.fields?.length === 0 && (
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '14px', 
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            border: '1px dashed rgba(255, 255, 255, 0.2)'
          }}>
            {config.title === 'LLM' 
              ? '🤖 Large Language Model processor' 
              : '⚙️ No configuration needed'
            }
          </div>
        )}
      </div>
    </BaseNode>
  );
};
