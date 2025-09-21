// frontend/src/hooks/useNodeManagement.js
import { useCallback } from 'react';
import { useStore } from '../store';
import { NodeFactory } from '../utils/nodeFactory';
import { getAllNodeTypes } from '../config/nodeConfigs';

export const useNodeManagement = () => {
  const { nodes, edges } = useStore();

  const getAvailableNodeTypes = useCallback(() => {
    return getAllNodeTypes().map(type => ({
      type,
      label: NodeFactory.getNodeDisplayName(type),
      icon: NodeFactory.getNodeIcon(type)
    }));
  }, []);

  const getNodeStats = useCallback(() => {
    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
    };
  }, [nodes, edges]);

  return {
    getAvailableNodeTypes,
    getNodeStats,
    nodes,
    edges
  };
};
