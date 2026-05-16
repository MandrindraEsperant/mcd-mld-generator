"use client";

import { Handle, Position } from '@xyflow/react';
import { Settings2, Plus, X } from 'lucide-react';

export default function EntityNode({ data, id }: any) {
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
    <div className="bg-neutral-900 border-2 border-blue-500/50 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)] min-w-[250px] overflow-hidden">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border-b border-blue-500/30 p-3 flex justify-between items-center">
        <input 
          className="bg-transparent text-white font-bold outline-none w-full"
          value={data.name}
          onChange={(e) => data.onChange({ name: e.target.value })}
          placeholder="Nom Entité"
        />
        <Settings2 size={16} className="text-blue-400" />
      </div>
      <div className="p-3">
        <div className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Propriétés</div>
        <div className="flex flex-col gap-2">
          {data.properties?.map((prop: any, i: number) => (
            <div key={prop.id} className="flex items-center gap-2 group">
              <input 
                type="checkbox" 
                checked={prop.isIdentifier}
                onChange={(e) => updateProp(i, 'isIdentifier', e.target.checked)}
                className="w-3 h-3 text-blue-500 bg-neutral-800 rounded border-neutral-700 cursor-pointer"
                title="Identifiant"
              />
              <input 
                value={prop.name}
                onChange={(e) => updateProp(i, 'name', e.target.value)}
                className={`bg-neutral-800 text-sm px-2 py-1 rounded w-full outline-none focus:ring-1 focus:ring-blue-500 transition ${prop.isIdentifier ? 'text-blue-300 underline decoration-blue-500/50 font-semibold' : 'text-neutral-300'}`}
              />
              <button onClick={() => removeProp(i)} className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addProperty} className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-blue-400 hover:bg-blue-500/10 py-1.5 border border-blue-500/30 border-dashed rounded transition font-medium">
          <Plus size={14} /> Ajouter un attribut
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-blue-500" />
    </div>
  );
}
