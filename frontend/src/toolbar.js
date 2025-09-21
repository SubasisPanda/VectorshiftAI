// frontend/src/toolbar.js 
import React, { useState, useEffect } from 'react';
import { DraggableNode } from './draggableNode';
import { getAllNodeTypes, getNodeConfig } from './config/nodeConfigs';

//  SVG Icons 
const InputIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
    </svg>
);

const OutputIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
    </svg>
);

const BrainIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
);

const TextIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
    </svg>
);

const DatabaseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);

const ApiIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const TransformIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
);

const FilterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const WebhookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

// Icon mapping 
const iconMap = {
    customInput: <InputIcon />,
    customOutput: <OutputIcon />,
    llm: <BrainIcon />,
    text: <TextIcon />,
    database: <DatabaseIcon />,
    api: <ApiIcon />,
    transform: <TransformIcon />,
    filter: <FilterIcon />,
    webhook: <WebhookIcon />
};

export const PipelineToolbar = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const coreComponents = ['customInput', 'text', 'llm', 'customOutput'];
    const advancedComponents = ['database', 'api', 'transform', 'filter', 'webhook'];

    // Loading animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const getDisplayName = (type) => {
        const config = getNodeConfig(type);
        return config?.title || type;
    };

    return (
        <div style={{
            background: 'linear-gradient(180deg, rgba(8, 8, 16, 0.98) 0%, rgba(16, 8, 24, 0.98) 100%)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(139, 92, 246, 0.1)',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            {/* Compact Container */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '32px'
            }}>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px', 
                    flexShrink: 0,
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
                        </svg>
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '19px',
                            fontWeight: '600',
                            color: 'white',
                            margin: 0,
                            letterSpacing: '-0.025em',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            VectorShift AI automation
                        </h1>
                    </div>
                </div>

                {/* Core Components  */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
                }}>
                    <span style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '13px',
                        fontWeight: '500',
                        marginRight: '10px'
                    }}>
                        Core
                    </span>
                    {coreComponents.map((type, index) => (
                        <div
                            key={type}
                            style={{
                                opacity: isLoaded ? 1 : 0,
                                transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                                transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.4 + index * 0.1}s`
                            }}
                        >
                            <DraggableNode
                                type={type}
                                label={getDisplayName(type)}
                                icon={iconMap[type]}
                                compact={true}
                            />
                        </div>
                    ))}
                </div>

                {/* Advanced Components  */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s'
                }}>
                    <span style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '13px',
                        fontWeight: '500',
                        marginRight: '10px'
                    }}>
                        Advanced
                    </span>
                    {advancedComponents.map((type, index) => (
                        <div
                            key={type}
                            style={{
                                opacity: isLoaded ? 1 : 0,
                                transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                                transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.6 + index * 0.1}s`
                            }}
                        >
                            <DraggableNode
                                type={type}
                                label={getDisplayName(type)}
                                icon={iconMap[type]}
                                compact={true}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
