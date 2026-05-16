"use client";

import { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Database, FileCode2, Plus } from 'lucide-react';
import EntityNode from './EntityNode';
import AssociationNode from './AssociationNode';
import ResultsPanel from './ResultsPanel';

const nodeTypes = {
  entity: EntityNode,
  association: AssociationNode,
};

export default function McdWorkspace() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [results, setResults] = useState<{mld: any, sql: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }, eds)),
    [],
  );

  const addEntity = () => {
    const newNode: Node = {
      id: `entity_${Date.now()}`,
      type: 'entity',
      position: { x: 100, y: 100 },
      data: { name: 'Nouvelle Entite', properties: [] }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addAssociation = () => {
    const newNode: Node = {
      id: `assoc_${Date.now()}`,
      type: 'association',
      position: { x: 400, y: 100 },
      data: { name: 'Nouvelle Association', properties: [] }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const updateNodeData = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  };

  const generateMld = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        entities: nodes.filter(n => n.type === 'entity').map(n => ({
          id: n.id,
          name: n.data.name,
          properties: n.data.properties
        })),
        associations: nodes.filter(n => n.type === 'association').map(n => ({
          id: n.id,
          name: n.data.name,
          properties: n.data.properties
        })),
        links: edges.map(e => {
            const sourceNode = nodes.find(n => n.id === e.source);
            const targetNode = nodes.find(n => n.id === e.target);
            
            let entityId = sourceNode?.type === 'entity' ? sourceNode?.id : targetNode?.id;
            let associationId = sourceNode?.type === 'association' ? sourceNode?.id : targetNode?.id;

            return {
                id: e.id,
                entityId,
                associationId,
                cardMin: "1",
                cardMax: "n", // Defaulting for visual simplicity. In full app, user selects this on the edge
                relative: false
            };
        }).filter(l => l.entityId && l.associationId)
      };

      const res = await fetch('http://localhost:8080/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la génération. Assurez-vous que le backend est démarré sur le port 8080.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-neutral-950">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes.map(n => ({...n, data: {...n.data, onChange: (d: any) => updateNodeData(n.id, d)}}))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-neutral-950"
        >
          <Background color="#444" gap={16} />
          <Controls className="bg-neutral-800 border-neutral-700 fill-white" />
          <Panel position="top-left" className="bg-neutral-900/80 p-2 rounded-xl backdrop-blur-md border border-neutral-800 flex gap-2 shadow-xl">
            <button onClick={addEntity} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-lg text-sm font-medium">
              <Plus size={16} /> Entité
            </button>
            <button onClick={addAssociation} className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 transition rounded-lg text-sm font-medium">
              <Plus size={16} /> Association
            </button>
          </Panel>
          <Panel position="top-right" className="p-2">
            <button 
                onClick={generateMld}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition rounded-xl font-bold shadow-lg shadow-emerald-900/50 disabled:opacity-50"
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={20} fill="currentColor" />}
              Générer MLD & SQL
            </button>
          </Panel>
        </ReactFlow>
      </div>
      
      {results && (
        <div className="w-1/3 min-w-[450px] border-l border-neutral-800 bg-neutral-900 flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
            <ResultsPanel results={results} onClose={() => setResults(null)} />
        </div>
      )}
    </div>
  );
}
