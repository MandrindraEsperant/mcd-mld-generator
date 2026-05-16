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
import { Play, Plus, Cpu, Box, Share2, Layers, ChevronRight } from 'lucide-react';
import EntityNode from './EntityNode';
import AssociationNode from './AssociationNode';
import CustomEdge from './CustomEdge';
import ResultsPanel from './ResultsPanel';

const nodeTypes = {
  entity: EntityNode,
  association: AssociationNode,
};

const edgeTypes = {
  custom: CustomEdge,
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

  const updateEdgeData = useCallback((edgeId: string, newData: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, data: { ...edge.data, ...newData } };
        }
        return edge;
      })
    );
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
        ...params, 
        type: 'custom',
        animated: true, 
        style: { stroke: '#64748b', strokeWidth: 2 },
        data: { cardMin: '1', cardMax: 'n', onChange: updateEdgeData }
    }, eds)),
    [updateEdgeData],
  );

  const addEntity = () => {
    const newNode: Node = {
      id: `entity_${Date.now()}`,
      type: 'entity',
      position: { x: 250, y: 150 },
      data: { name: 'NOUVELLE_ENTITE', properties: [] }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addAssociation = () => {
    const newNode: Node = {
      id: `assoc_${Date.now()}`,
      type: 'association',
      position: { x: 500, y: 150 },
      data: { name: 'Avoir', properties: [] }
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
                cardMin: e.data?.cardMin || "1",
                cardMax: e.data?.cardMax || "n",
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
      alert('Erreur lors de la génération. Assurez-vous que le serveur est actif.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200">
      {/* Sidebar Gauche */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-sky-500/20 p-2 rounded-lg text-sky-400">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Studio IDM</h1>
          </div>
        </div>
        
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-8">
          Ingénierie dirigée par les modèles
        </p>

        <div className="space-y-6 flex-1">
          <div>
            <h2 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">Boîte à outils</h2>
            <div className="space-y-2">
              <button onClick={addEntity} className="sidebar-button sidebar-button-inactive">
                <Box size={18} className="text-sky-500" />
                <span>Entité</span>
              </button>
              <button onClick={addAssociation} className="sidebar-button sidebar-button-inactive">
                <Layers size={18} className="text-amber-500" />
                <span>Association</span>
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={generateMld}
          disabled={isGenerating}
          className="mt-auto w-full flex items-center justify-center gap-3 py-4 px-6 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
        >
          {isGenerating ? <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : <Cpu size={20} />}
          Générer MLD & SQL
        </button>
      </aside>

      {/* Zone d'édition */}
      <div className="flex-1 relative h-full">
        <ReactFlow
          nodes={nodes.map(n => ({...n, data: {...n.data, onChange: (d: any) => updateNodeData(n.id, d)}}))}
          edges={edges.map(e => ({...e, data: {...e.data, onChange: updateEdgeData}}))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-[#0f172a]"
        >
          <Background color="#1e293b" gap={20} variant="dots" />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-400 rounded-lg shadow-2xl" />
        </ReactFlow>

        {/* Panneau de résultats flottant */}
        {results && (
          <div className="absolute top-6 right-6 bottom-6 w-[500px] z-50">
            <ResultsPanel results={results} onClose={() => setResults(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
