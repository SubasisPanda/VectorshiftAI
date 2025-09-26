// frontend/src/config/nodeConfigs.js
import React from 'react';

const ArrowRightIcon = () => <div style={{ width: 16, height: 16, background: '#60a5fa', borderRadius: '50%' }} />;
const CpuChipIcon = () => <div style={{ width: 16, height: 16, background: '#a855f7', borderRadius: '4px' }} />;
const ArrowLeftIcon = () => <div style={{ width: 16, height: 16, background: '#10b981', borderRadius: '50%' }} />;
const DocumentTextIcon = () => <div style={{ width: 16, height: 16, background: '#f59e0b', borderRadius: '4px' }} />;
const CircleStackIcon = () => <div style={{ width: 16, height: 16, background: '#6366f1', borderRadius: '4px' }} />;
const GlobeAltIcon = () => <div style={{ width: 16, height: 16, background: '#06b6d4', borderRadius: '50%' }} />;
const ArrowsRightLeftIcon = () => <div style={{ width: 16, height: 16, background: '#ec4899', borderRadius: '4px' }} />;
const FunnelIcon = () => <div style={{ width: 16, height: 16, background: '#ef4444', borderRadius: '4px' }} />;
const BoltIcon = () => <div style={{ width: 16, height: 16, background: '#f97316', borderRadius: '4px' }} />;

export const NODE_CONFIGS = {
    // Existing nodes
    customInput: {
        title: "Input",
        icon: <ArrowRightIcon />,
        gradient: "gradient-input",
        outputs: [{ id: "value", label: "Output" }],
        inputs: [],
        fields: [
            { name: "inputName", type: "text", label: "Name", placeholder: "Enter input name" },
            {
                name: "inputType", type: "select", label: "Type", options: [
                    { value: "Text", label: "Text" },
                    { value: "File", label: "File" },
                    { value: "Number", label: "Number" },
                    { value: "Boolean", label: "Boolean" }
                ]
            }
        ]
    },

    llm: {
        title: "LLM",
        icon: <CpuChipIcon />,
        gradient: "gradient-llm",
        inputs: [
            { id: "system", label: "System" },
            { id: "prompt", label: "Prompt" }
        ],
        outputs: [{ id: "response", label: "Response" }],
        fields: []
    },

    customOutput: {
        title: "Output",
        icon: <ArrowLeftIcon />,
        gradient: "gradient-output",
        inputs: [{ id: "value", label: "Input" }],
        outputs: [],
        fields: [
            { name: "outputName", type: "text", label: "Name", placeholder: "Enter output name" },
            {
                name: "outputType", type: "select", label: "Type", options: [
                    { value: "Text", label: "Text" },
                    { value: "Image", label: "Image" },
                    { value: "File", label: "File" }
                ]
            }
        ]
    },

    text: {
        title: "Smart Text",
        icon: <DocumentTextIcon className="w-4 h-4 text-yellow-400" />,
        gradient: "from-yellow-600 to-orange-600",
        inputs: [], // Dynamic inputs based on variables
        outputs: [{ id: "output", label: "Output" }],
        fields: [], // No static fields
        component: 'SmartTextNode' //  marker 
    },

    // New custom nodes
    database: {
        title: "Database",
        icon: <CircleStackIcon />,
        gradient: "gradient-database",
        inputs: [
            { id: "query", label: "Query" },
            { id: "connection", label: "Connection" }
        ],
        outputs: [
            { id: "result", label: "Result" },
            { id: "error", label: "Error" }
        ],
        fields: [
            {
                name: "dbType", type: "select", label: "Database Type", options: [
                    { value: "postgresql", label: "PostgreSQL" },
                    { value: "mysql", label: "MySQL" },
                    { value: "sqlite", label: "SQLite" },
                    { value: "mongodb", label: "MongoDB" }
                ]
            },
            { name: "connectionString", type: "text", label: "Connection String", placeholder: "Enter connection string" }
        ]
    },

    api: {
        title: "API Request",
        icon: <GlobeAltIcon />,
        gradient: "gradient-api",
        inputs: [
            { id: "url", label: "URL" },
            { id: "headers", label: "Headers" },
            { id: "body", label: "Body" }
        ],
        outputs: [
            { id: "response", label: "Response" },
            { id: "status", label: "Status" },
            { id: "error", label: "Error" }
        ],
        fields: [
            {
                name: "method", type: "select", label: "Method", options: [
                    { value: "GET", label: "GET" },
                    { value: "POST", label: "POST" },
                    { value: "PUT", label: "PUT" },
                    { value: "DELETE", label: "DELETE" }
                ]
            },
            { name: "timeout", type: "number", label: "Timeout (ms)", placeholder: "5000" }
        ]
    },

    transform: {
        title: "Transform",
        icon: <ArrowsRightLeftIcon />,
        gradient: "gradient-transform",
        inputs: [{ id: "input", label: "Input" }],
        outputs: [{ id: "output", label: "Output" }],
        fields: [
            {
                name: "transformType", type: "select", label: "Transform Type", options: [
                    { value: "json", label: "JSON Parse/Stringify" },
                    { value: "uppercase", label: "Uppercase" },
                    { value: "lowercase", label: "Lowercase" },
                    { value: "trim", label: "Trim Whitespace" },
                    { value: "custom", label: "Custom JavaScript" }
                ]
            },
            { name: "customCode", type: "textarea", label: "Custom Code", placeholder: "// JavaScript transformation code\nreturn input.toUpperCase();" }
        ]
    },

    filter: {
        title: "Filter",
        icon: <FunnelIcon />,
        gradient: "gradient-filter",
        inputs: [{ id: "input", label: "Input" }],
        outputs: [
            { id: "passed", label: "Passed" },
            { id: "failed", label: "Failed" }
        ],
        fields: [
            {
                name: "condition", type: "select", label: "Condition", options: [
                    { value: "contains", label: "Contains" },
                    { value: "equals", label: "Equals" },
                    { value: "greater", label: "Greater Than" },
                    { value: "less", label: "Less Than" },
                    { value: "regex", label: "Regex Match" },
                    { value: "custom", label: "Custom JavaScript" }
                ]
            },
            { name: "value", type: "text", label: "Value", placeholder: "Comparison value" },
            { name: "customCondition", type: "textarea", label: "Custom Condition", placeholder: "// JavaScript condition\nreturn input.length > 10;" }
        ]
    },

    webhook: {
        title: "Webhook",
        icon: <BoltIcon />,
        gradient: "gradient-webhook",
        inputs: [
            { id: "payload", label: "Payload" },
            { id: "headers", label: "Headers" }
        ],
        outputs: [{ id: "received", label: "Received Data" }],
        fields: [
            { name: "webhookUrl", type: "text", label: "Webhook URL", placeholder: "https://your-webhook-url.com" },
            { name: "secret", type: "password", label: "Secret Key", placeholder: "Optional webhook secret" },
            {
                name: "method", type: "select", label: "HTTP Method", options: [
                    { value: "POST", label: "POST" },
                    { value: "PUT", label: "PUT" },
                    { value: "PATCH", label: "PATCH" }
                ]
            }
        ]
    }
};

export const getNodeConfig = (nodeType) => {
    return NODE_CONFIGS[nodeType] || null;
};

export const getAllNodeTypes = () => {
    return Object.keys(NODE_CONFIGS);
};
