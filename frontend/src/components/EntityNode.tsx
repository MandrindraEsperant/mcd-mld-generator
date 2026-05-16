"use client";

import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Plus, X } from 'lucide-react';

export default function EntityNode({ data, id, selected }: any) {
  const addProperty = () => {
    data.onChange({
      properties: [...(data.properties || []), { id: `prop_${Date.now()}`, name: 'attribut', type: 'string', isIdentifier: false }]
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
    <div className="group">
      <NodeResizer color="#0ea5e9" isVisible={selected} minWidth={250} minHeight={150} />
      <div className="w-full h-full bg-white border border-slate-300 rounded-sm shadow-xl flex flex-col overflow-hidden">
        <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100" />
        <Handle type="target" position={Position.Left} id="left" className="opacity-0 group-hover:opacity-100" />
        
        <div className="p-3 flex justify-center items-center border-b border-slate-200">
          <input 
            className="bg-transparent text-slate-900 font-bold outline-none w-full text-center uppercase tracking-widest text-sm"
            value={data.name}
            onChange={(e) => data.onChange({ name: e.target.value })}
            placeholder="ENTITÉ"
          />
        </div>

        <div className="p-4 flex-1 flex flex-col gap-2">
          {data.properties?.map((prop: any, i: number) => (
            <div key={prop.id} className="flex items-center gap-2 group/prop text-xs font-mono">
              <input 
                type="checkbox" 
                checked={prop.isIdentifier}
                onChange={(e) => updateProp(i, 'isIdentifier', e.target.checked)}
                className="w-3 h-3 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                title="PK"
              />
              <div className="flex-1 flex items-center">
                <input 
                  value={prop.name}
                  onChange={(e) => updateProp(i, 'name', e.target.value)}
                  className={`bg-transparent outline-none w-full ${prop.isIdentifier ? 'font-bold underline text-slate-900' : 'text-slate-700'}`}
                  placeholder="nom"
                />
                <span className="text-slate-400 mx-1">:</span>
                <select
                  value={prop.type || 'string'}
                  onChange={(e) => updateProp(i, 'type', e.target.value)}
                  className="bg-transparent text-slate-500 outline-none cursor-pointer hover:text-sky-600"
                >
                  <option value="int">int</option>
                  <option value="string">string</option>
                  <option value="date">date</option>
                  <option value="boolean">bool</option>
                </select>
              </div>
              <button onClick={() => removeProp(i)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover/prop:opacity-100 transition-opacity">
                <X size={12} />
              </button>
            </div>
          ))}
          
          <button onClick={addProperty} className="mt-2 text-[10px] text-slate-400 hover:text-sky-600 font-bold underline text-left opacity-0 group-hover:opacity-100 transition-opacity">
            + Ajouter un attribut
          </button>
        </div>

        <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100" />
        <Handle type="source" position={Position.Right} id="right" className="opacity-0 group-hover:opacity-100" />
      </div>
    </div>
  );
}
