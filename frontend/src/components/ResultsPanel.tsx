"use client";

import { useState } from 'react';
import { X, Copy, Check, Database, FileCode2, Terminal } from 'lucide-react';

export default function ResultsPanel({ results, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'mld' | 'sql'>('mld');
  const [copied, setCopied] = useState(false);

  const copySql = () => {
    navigator.clipboard.writeText(results.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-95">
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
            <div className="bg-sky-500/20 p-2 rounded-lg text-sky-400">
                <Terminal size={18} />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">Résultats de génération</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
          <X size={18} />
        </button>
      </div>

      <div className="flex bg-slate-900/50 p-1 mx-4 mt-4 rounded-xl border border-slate-800">
        <button 
          className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${activeTab === 'mld' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          onClick={() => setActiveTab('mld')}
        >
          <Database size={14} /> MLD
        </button>
        <button 
          className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${activeTab === 'sql' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          onClick={() => setActiveTab('sql')}
        >
          <FileCode2 size={14} /> SQL
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {activeTab === 'mld' ? (
          <div className="space-y-6">
            {results.mld?.tables?.map((table: any, i: number) => (
              <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                  <span className="font-bold text-xs text-white tracking-widest uppercase">{table.name}</span>
                </div>
                <div className="p-0">
                  <table className="w-full text-[11px] text-left">
                    <thead className="text-slate-500 bg-slate-900/50 font-bold uppercase tracking-tighter">
                      <tr>
                        <th className="px-4 py-2">Colonne</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2 text-right">Infos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {table.columns.map((col: any, j: number) => (
                        <tr key={j} className="hover:bg-slate-800/20 transition-colors">
                          <td className={`px-4 py-2 font-mono ${col.isPrimaryKey ? 'text-sky-400 font-bold' : 'text-slate-300'}`}>
                            {col.name} {col.isPrimaryKey && '🔑'}
                          </td>
                          <td className="px-4 py-2 text-slate-500 font-mono italic">{col.type}</td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex gap-1 justify-end">
                                {col.isPrimaryKey && <span className="bg-sky-500/10 text-sky-400 px-1 rounded border border-sky-500/20 text-[9px]">PK</span>}
                                {table.foreignKeys.find((fk:any) => fk.columnName === col.name) && <span className="bg-purple-500/10 text-purple-400 px-1 rounded border border-purple-500/20 text-[9px]">FK</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex justify-end mb-3">
              <button 
                onClick={copySql}
                className="flex items-center gap-2 text-[10px] font-bold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-700"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Copié !' : 'Copier SQL'}
              </button>
            </div>
            <div className="flex-1 bg-black/40 border border-slate-800 rounded-xl p-5 overflow-auto custom-scrollbar">
                <code className="text-emerald-500 font-mono text-xs whitespace-pre-wrap leading-relaxed">{results.sql || '-- Aucun SQL généré'}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
