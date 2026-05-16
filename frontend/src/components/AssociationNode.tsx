"use client";

import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Plus, X } from 'lucide-react';

export default function AssociationNode({ data, id, selected }: any) {
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
      <NodeResizer color="#f59e0b" isVisible={selected} minWidth={140} minHeight={80} />
      <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100" />
      
      <div className="w-full h-full bg-white border-[3px] border-amber-400 rounded-[50%_50%] shadow-[0_0_20px_rgba(251,191,36,0.4)] flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="w-full flex justify-center pb-1">
          <input 
            className="bg-transparent text-slate-800 font-bold outline-none w-full text-center text-[11px] italic"
            value={data.name}
            onChange={(e) => data.onChange({ name: e.target.value })}
            placeholder="Association"
          />
        </div>
        
        {/* Separator line */}
        <div className="w-2/3 border-t border-amber-200 my-1" />

        <div className="flex flex-col items-center gap-1 w-full max-h-[80%] overflow-y-auto custom-scrollbar px-2">
          {data.properties?.map((prop: any, i: number) => (
             <div key={prop.id} className="flex items-center justify-center gap-1 group/prop text-[9px] font-mono w-full">
                <input 
                  value={prop.name}
                  onChange={(e) => updateProp(i, 'name', e.target.value)}
                  className="bg-transparent outline-none text-slate-700 w-1/2 text-right"
                  placeholder="nom"
                />
                <span className="text-slate-400">:</span>
                <select
                  value={prop.type || 'string'}
                  onChange={(e) => updateProp(i, 'type', e.target.value)}
                  className="bg-transparent text-slate-500 outline-none cursor-pointer w-1/2 text-left"
                >
                  <option value="int">int</option>
                  <option value="string">string</option>
                  <option value="date">date</option>
                  <option value="boolean">bool</option>
                </select>
                <button onClick={() => removeProp(i)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover/prop:opacity-100 absolute right-1">
                  <X size={10} />
                </button>
             </div>
          ))}
          <button onClick={addProperty} className="text-[9px] text-amber-600 font-bold hover:underline mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            + Ajouter
          </button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100" />
      <Handle type="target" position={Position.Left} id="left" className="opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} id="right" className="opacity-0 group-hover:opacity-100" />
    </div>
  );
}
