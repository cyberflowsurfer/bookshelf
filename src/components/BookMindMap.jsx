import React, { useCallback, useState } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Save, Plus, Trash2 } from 'lucide-react';

const BookMindMap = ({ initialNodes = [], initialEdges = [], onSave }) => {
    // Flow state
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Initial node if empty
    React.useEffect(() => {
        if (initialNodes.length === 0 && nodes.length === 0) {
            setNodes([
                {
                    id: '1',
                    position: { x: 250, y: 250 },
                    data: { label: 'Book Concept' },
                    type: 'input',
                },
            ]);
        }
    }, []);

    // Change handlers wrapper to track dirty state
    const handleNodesChange = useCallback((changes) => {
        onNodesChange(changes);
        setHasUnsavedChanges(true);
    }, [onNodesChange]);

    const handleEdgesChange = useCallback((changes) => {
        onEdgesChange(changes);
        setHasUnsavedChanges(true);
    }, [onEdgesChange]);

    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => addEdge(params, eds));
            setHasUnsavedChanges(true);
        },
        [setEdges],
    );

    // Manual Save
    const handleSave = () => {
        onSave({ nodes, edges });
        setHasUnsavedChanges(false);
    };

    // Add Node
    const handleAddNode = () => {
        const id = `${nodes.length + 1}-${Date.now()}`;
        const newNode = {
            id,
            position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
            data: { label: 'New Concept' },
        };
        setNodes((nds) => nds.concat(newNode));
        setHasUnsavedChanges(true);
    };

    // Edit Node Label (Double Click)
    const onNodeDoubleClick = useCallback((event, node) => {
        const newLabel = window.prompt("Edit label:", node.data.label);
        if (newLabel !== null) {
            setNodes((nds) =>
                nds.map((n) => {
                    if (n.id === node.id) {
                        return { ...n, data: { ...n.data, label: newLabel } };
                    }
                    return n;
                })
            );
            setHasUnsavedChanges(true);
        }
    }, [setNodes]);

    return (
        <div className="w-full h-full border border-gray-200 rounded-lg bg-gray-50 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                onNodeDoubleClick={onNodeDoubleClick}
                fitView
            >
                <Background />
                <Controls />
                <Panel position="top-right" className="flex gap-2">
                    <button
                        onClick={handleAddNode}
                        className="p-2 bg-white rounded shadow hover:bg-gray-50 text-gray-700"
                        title="Add Node"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        className={`p-2 rounded shadow text-white transition-colors ${hasUnsavedChanges ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        title={hasUnsavedChanges ? "Save Changes" : "No Changes"}
                        disabled={!hasUnsavedChanges}
                    >
                        <Save className="h-5 w-5" />
                    </button>
                </Panel>
                <Panel position="top-left" className="bg-white/80 p-2 rounded text-xs text-gray-500">
                    Double-click node to rename. Backspace to delete.
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default BookMindMap;
