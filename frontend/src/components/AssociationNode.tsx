"use client";

import { Handle, Position } from '@xyflow/react';
import { Plus, X } from 'lucide-react';

export default function AssociationNode({ data, id }: any) {
  const addProperty = () => {
    data.onChange({
      properties: [...(data.properties || []), { id: `prop_${Date.now()}`, name: 'attr', type: 'string', isIdentifier: false }]
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
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100" />
      <div className="w-32 h-16 bg-white border-[3px] border-amber-400 rounded-[100%] shadow-[0_0_20px_rgba(251,191,36,0.4)] flex flex-col items-center justify-center p-2">
        <input 
          className="bg-transparent text-slate-800 font-medium outline-none w-full text-center text-xs italic"
          value={data.name}
          onChange={(e) => data.onChange({ name: e.target.value })}
          placeholder="Association"
        />
        
        {/* Properties popover or simplified list */}
        <div className="absolute top-full mt-2 bg-slate-800 rounded-lg p-2 border border-slate-700 hidden group-hover:block z-50 shadow-2xl min-w-[150px]">
          <div className="text-[10px] text-slate-500 font-bold mb-2 px-1 uppercase tracking-tighter">Propriétés</div>
          {data.properties?.map((prop: any, i: number) => (
             <div key={prop.id} className="flex items-center gap-1 mb-1">
                <input 
                  value={prop.name}
                  onChange={(e) => updateProp(i, 'name', e.target.value)}
                  className="bg-slate-900 text-[10px] p-1 rounded outline-none w-full text-slate-300"
                />
                <button onClick={() => removeProp(i)} className="text-slate-600 hover:text-red-500">
                  <X size={10} />
                </button>
             </div>
          ))}
          <button onClick={addProperty} className="text-[10px] text-sky-400 font-bold px-1">+ Ajouter</button>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100" />
      <Handle type="target" position={Position.Left} id="left" className="opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} id="right" className="opacity-0 group-hover:opacity-100" />
    </div>
  );
}
