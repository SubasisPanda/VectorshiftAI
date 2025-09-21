// frontend/src/utils/nodeFactory.js
import { getNodeConfig } from '../config/nodeConfigs';

export class NodeFactory {
  static createNode(nodeType, id, position, initialData = {}) {
    const config = getNodeConfig(nodeType);
    if (!config) {
      throw new Error(`Unknown node type: ${nodeType}`);
    }

    // Generate default data based on config
    const defaultData = {};
    config.fields?.forEach(field => {
      if (field.type === 'select' && field.options?.length > 0) {
        defaultData[field.name] = field.options[0].value;
      } else {
        defaultData[field.name] = '';
      }
    });

    return {
      id,
      type: nodeType,
      position,
      data: {
        ...defaultData,
        ...initialData,
        nodeType,
        config
      }
    };
  }

  static getNodeDisplayName(nodeType) {
    const config = getNodeConfig(nodeType);
    return config?.title || nodeType;
  }

  static getNodeIcon(nodeType) {
    const config = getNodeConfig(nodeType);
    return config?.icon || null;
  }

  static getNodeGradient(nodeType) {
    const config = getNodeConfig(nodeType);
    return config?.gradient || 'gradient-llm';
  }
}
