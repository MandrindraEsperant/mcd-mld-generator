"use client";

import { Handle, Position } from '@xyflow/react';
import { Plus, X } from 'lucide-react';

export default function AssociationNode({ data, id }: any) {
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
    <div className="bg-neutral-900 border-2 border-purple-500/50 rounded-[40px] shadow-[0_0_15px_rgba(168,85,247,0.2)] min-w-[220px] max-w-[280px] overflow-hidden p-1">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
      <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 p-3 flex justify-between items-center rounded-t-[36px]">
        <input 
          className="bg-transparent text-white font-bold outline-none w-full text-center"
          value={data.name}
          onChange={(e) => data.onChange({ name: e.target.value })}
          placeholder="Association"
        />
      </div>
      <div className="p-3 pb-4 relative">
        <div className="flex flex-col gap-2">
          {data.properties?.map((prop: any, i: number) => (
            <div key={prop.id} className="flex items-center gap-2 group relative">
              <input 
                value={prop.name}
                onChange={(e) => updateProp(i, 'name', e.target.value)}
                className={`bg-neutral-800 text-sm px-2 py-1 rounded-full w-full outline-none focus:ring-1 focus:ring-purple-500 transition text-center text-neutral-300`}
              />
              <button onClick={() => removeProp(i)} className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition absolute right-2">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addProperty} className="mt-2 mx-auto w-8 h-8 flex items-center justify-center text-purple-400 hover:bg-purple-500/10 border border-purple-500/30 border-dashed rounded-full transition">
          <Plus size={14} />
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-purple-500" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-purple-500" />
    </div>
  );
}
