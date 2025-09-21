// frontend/src/ui.js 
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { UniversalNode } from './components/base/UniversalNode';
import { getAllNodeTypes } from './config/nodeConfigs';

import 'reactflow/dist/style.css';

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
  </svg>
);

// Generate nodeTypes 
const nodeTypes = {};
getAllNodeTypes().forEach(type => {
  nodeTypes[type] = (props) => <UniversalNode {...props} type={type} />;
});

const gridSize = 15; 
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteNode: state.deleteNode,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode
  } = useStore(selector, shallow);

  // Loading animation 
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  }

  // Handle edge hover for visual feedback
  const onEdgeMouseEnter = useCallback((event, edge) => {
    setHoveredEdge(edge.id);
  }, []);

  const onEdgeMouseLeave = useCallback(() => {
    setHoveredEdge(null);
  }, []);

  // Add node click handler
  const onNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNodes([node.id]);
    setSelectedEdge(null);
  }, []);

  // Handle right-click on edge
  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    setContextMenu({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    setSelectedEdge(edge.id);
  }, []);

  // Handle edge click to show selection
  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge.id);
    setSelectedNodes([]);
  }, []);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Handle delete from context menu
  const handleDeleteEdge = useCallback(() => {
    if (selectedEdge) {
      onEdgesChange([{ id: selectedEdge, type: 'remove' }]);
      closeContextMenu();
      setSelectedEdge(null);
    }
  }, [selectedEdge, onEdgesChange, closeContextMenu]);

  // Enhanced keydown handler for both edge and node deletion
  const onKeyDown = useCallback((event) => {
    if ((event.key === 'Delete' || event.key === 'Backspace')) {
      // Delete selected edge
      if (selectedEdge) {
        onEdgesChange([{ id: selectedEdge, type: 'remove' }]);
        setSelectedEdge(null);
      }
      // Delete selected nodes
      if (selectedNodes.length > 0) {
        selectedNodes.forEach(nodeId => deleteNode(nodeId));
        setSelectedNodes([]);
      }
    }
  }, [selectedEdge, selectedNodes, onEdgesChange, deleteNode]);

  const handleConnect = useCallback((connection) => {
    const newConnection = {
      ...connection,
      style: {
        strokeWidth: 2.5,
        stroke: '#8b5cf6',
        filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.3))'
      },
      type: 'smoothstep'
    };
    onConnect(newConnection);
  }, [onConnect]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;
  
        if (typeof type === 'undefined' || !type) {
          return;
        }
  
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };
  
        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle pane click to close context menu and clear selection
  const onPaneClick = useCallback(() => {
    closeContextMenu();
    setSelectedEdge(null);
    setSelectedNodes([]);
  }, [closeContextMenu]);

  return (
    <div 
      ref={reactFlowWrapper} 
      style={{
        width: '100vw', 
        height: '70vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #0c0a1a 0%, #1a0d2e 25%, #2d1b3d 50%, #1a0d2e 75%, #0c0a1a 100%)',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/*  Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: 'absolute',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 1000,
            background: 'rgba(8, 8, 16, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.1)',
            padding: '6px',
            minWidth: '160px'
          }}
        >
          <button
            onClick={handleDeleteEdge}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.15)';
              e.target.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            <DeleteIcon />
            Delete Connection
          </button>
        </div>
      )}

      {/*  Selection Indicators */}
      {selectedEdge && !contextMenu && (
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(59, 130, 246, 0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
        }}>
          Connection selected • Press Delete or Right-click for options
        </div>
      )}

      {selectedNodes.length > 0 && !contextMenu && (
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(139, 92, 246, 0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: '#a78bfa',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
        }}>
          {selectedNodes.length} node{selectedNodes.length > 1 ? 's' : ''} selected • Press Delete to remove
        </div>
      )}

      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            outline: selectedNodes.includes(node.id) ? '2px solid #60a5fa' : 'none',
            outlineOffset: '2px'
          }
        }))}
        edges={edges.map(edge => {
          const isHovered = hoveredEdge === edge.id;
          const isSelected = selectedEdge === edge.id;
          
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: isHovered ? '#60a5fa' : (isSelected ? '#a78bfa' : '#8b5cf6'),
              strokeWidth: isHovered ? 3.5 : (isSelected ? 3 : 2.5),
              filter: isHovered 
                ? 'drop-shadow(0 0 12px rgba(96, 165, 250, 0.6))' 
                : (isSelected ? 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.4))' : 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.3))'),
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }
          };
        })}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onEdgeContextMenu={onEdgeContextMenu}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        connectionLineStyle={{
          strokeWidth: 3,
          stroke: '#60a5fa',
          strokeDasharray: '6,6',
          filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))'
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: {
            strokeWidth: 2.5,
            stroke: '#8b5cf6'
          }
        }}
      >
        {/*  Background visibility */}
        <Background 
          color="rgba(139, 92, 246, 0.25)" 
          gap={gridSize}
          size={1.5}
          style={{ 
            backgroundColor: 'transparent',
            opacity: 0.6
          }}
        />
        
        {/*  Controls */}
        <Controls 
          style={{
            background: 'rgba(8, 8, 16, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.1)',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s'
          }}
        />
        
        {/*  MiniMap */}
        <MiniMap
          style={{
            background: 'rgba(8, 8, 16, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.1)',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s'
          }}
          nodeColor="#8b5cf6"
          maskColor="rgba(8, 8, 16, 0.8)"
          nodeStrokeWidth={2}
        />
      </ReactFlow>
    </div>
  );
};
