"use client";

import { Database, FileCode2, Copy, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function ResultsPanel({ results, onClose }: { results: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'mld' | 'sql'>('mld');
  const [copied, setCopied] = useState(false);

  const copySql = () => {
    navigator.clipboard.writeText(results.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-sky-200 relative shadow-2xl text-slate-800">
      <div className="flex items-center justify-between p-4 border-b border-sky-100 bg-sky-50/50 backdrop-blur-md">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Résultats Générés
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-sky-100 rounded-lg text-slate-500 hover:text-slate-800 transition">
          <X size={20} />
        </button>
      </div>

      <div className="flex border-b border-sky-100 bg-sky-50/30">
        <button 
          className={`flex-1 py-3 px-4 font-medium text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'mld' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-500/5' : 'text-slate-500 hover:text-slate-700 hover:bg-sky-100/50'}`}
          onClick={() => setActiveTab('mld')}
        >
          <Database size={16} /> Modèle Logique (MLD)
        </button>
        <button 
          className={`flex-1 py-3 px-4 font-medium text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'sql' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-500/5' : 'text-slate-500 hover:text-slate-700 hover:bg-sky-100/50'}`}
          onClick={() => setActiveTab('sql')}
        >
          <FileCode2 size={16} /> Code SQL
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'mld' ? (
          <div className="space-y-6">
            {results.mld?.tables?.map((table: any, i: number) => (
              <div key={i} className="bg-white border border-sky-200 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-blue-600 border-b border-sky-100 px-4 py-2 flex items-center gap-2">
                  <Database size={16} className="text-white" />
                  <span className="font-bold text-white">{table.name}</span>
                </div>
                <div className="p-0">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-2 font-medium">Colonne</th>
                        <th className="px-4 py-2 font-medium">Type</th>
                        <th className="px-4 py-2 font-medium">Contraintes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {table.columns.map((col: any, j: number) => (
                        <tr key={j} className="hover:bg-sky-50/50 transition">
                          <td className={`px-4 py-2 font-mono ${col.isPrimaryKey ? 'text-blue-700 font-bold' : 'text-slate-700'}`}>
                            {col.name} {col.isPrimaryKey && '🔑'}
                          </td>
                          <td className="px-4 py-2 text-purple-700 font-mono text-xs">{col.type}</td>
                          <td className="px-4 py-2 text-slate-500 text-xs">
                            <div className="flex gap-1 flex-wrap">
                                {col.isPrimaryKey && <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">PK</span>}
                                {!col.isNullable && !col.isPrimaryKey && <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">NOT NULL</span>}
                                {table.foreignKeys.find((fk:any) => fk.columnName === col.name) && <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200" title={`FK -> ${table.foreignKeys.find((fk:any) => fk.columnName === col.name).targetTable}`}>FK</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {(!results.mld?.tables || results.mld.tables.length === 0) && (
                <div className="text-center text-slate-400 mt-10">
                    Aucune table générée. Ajoutez des entités.
                </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex justify-end mb-2">
              <button 
                onClick={copySql}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg transition"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                {copied ? 'Copié !' : 'Copier SQL'}
              </button>
            </div>
            <pre className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-auto text-sm text-green-400 font-mono custom-scrollbar shadow-inner">
              <code>{results.sql || '-- Aucun SQL généré'}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
