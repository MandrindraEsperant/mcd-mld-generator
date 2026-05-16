"use client";

import { Handle, Position } from '@xyflow/react';
import { NodeResizer } from '@xyflow/react';
import { Plus, X } from 'lucide-react';

export default function AssociationNode({ data, id, selected }: any) {
  const addProperty = () => {
    data.onChange({
      properties: [...(data.properties || []), { id: `prop_${Date.now()}`, name: 'attribut', type: 'VARCHAR(255)', isIdentifier: false }]
    });
  };

  const updateProp = (index: number, field: string, value: any) => {
    const newProps = [...data.properties];
    newProps[index] = { ...newProps[index], [field]: value };
    data.onChange({ properties: newProps });
  };

  const removeProp = (index: number) => {
    const newProps = data.properties.filter((_: any, i: number) => i !== index);
    data.onChange({ properties: newProps });
  };

  return (
    <>
      <NodeResizer color="#a855f7" isVisible={selected} minWidth={200} minHeight={80} />
      <div className="w-full h-full bg-neutral-900 border-2 border-purple-500/50 rounded-[40px] shadow-[0_0_15px_rgba(168,85,247,0.2)] flex flex-col overflow-hidden p-1">
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
        <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 p-2 flex justify-center items-center rounded-t-[36px] shrink-0">
          <input 
            className="bg-purple-500 text-white font-bold outline-none w-full text-center placeholder-white/60"
            value={data.name}
            onChange={(e) => data.onChange({ name: e.target.value })}
            placeholder="Association"
          />
        </div>
        <div className="p-2 pb-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
          <div className="flex flex-col gap-2 w-full flex-1">
            {data.properties?.map((prop: any, i: number) => (
              <div key={prop.id} className="flex items-center justify-center gap-2 group relative w-full px-2">
                <input 
                  value={prop.name}
                  onChange={(e) => updateProp(i, 'name', e.target.value)}
                  placeholder="nom"
                  className={`bg-neutral-800 px-2 py-1.5 rounded-l-full w-full outline-none focus:ring-1 focus:ring-purple-500 transition text-center text-xs text-white placeholder-neutral-500 min-w-[60px]`}
                />
                <select
                  value={prop.type || 'VARCHAR(255)'}
                  onChange={(e) => updateProp(i, 'type', e.target.value)}
                  className="bg-neutral-800 text-[10px] px-1 py-1.5 rounded-r-full border-l border-neutral-700 text-neutral-300 outline-none focus:ring-1 focus:ring-purple-500 shrink-0"
                >
                  <option value="INT">INT</option>
                  <option value="VARCHAR(255)">VARCHAR</option>
                  <option value="TEXT">TEXT</option>
                  <option value="DATE">DATE</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                  <option value="FLOAT">FLOAT</option>
                </select>
                <button onClick={() => removeProp(i)} className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition absolute right-2 bg-neutral-900 rounded-full shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addProperty} className="mt-2 shrink-0 w-8 h-8 flex items-center justify-center text-purple-400 hover:bg-purple-500/10 border border-purple-500/30 border-dashed rounded-full transition">
            <Plus size={14} />
          </button>
        </div>
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
        <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-purple-500" />
        <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-purple-500" />
      </div>
    </>
  );
}
