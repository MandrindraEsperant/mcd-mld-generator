import McdWorkspace from '@/components/McdWorkspace';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                M
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            IDM Generator
            </h1>
        </div>
        <div className="text-sm font-medium px-3 py-1 rounded-full bg-neutral-800 text-neutral-300">
          MCD → MLD → SQL
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <McdWorkspace />
      </div>
    </main>
  );
}
