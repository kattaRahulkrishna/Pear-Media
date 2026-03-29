import { useState } from 'react';
import { Sparkles, Image as ImageIcon, FileText, Zap } from 'lucide-react';
import TextWorkflow from './components/TextWorkflow';
import ImageWorkflow from './components/ImageWorkflow';

function App() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <Sparkles className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-3">
          Pear <span className="gradient-text">Media</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          AI-powered creative workflows. Enhance your ideas and generate stunning visuals in seconds.
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl">
        {/* Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl backdrop-blur-sm border border-slate-700/50 mb-8 w-fit mx-auto shadow-lg">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'text'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md transform scale-105'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Text to Image
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'image'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-md transform scale-105'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image Variations
          </button>
        </div>

        {/* Workflow Container */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 transition-all duration-500">
          {activeTab === 'text' ? <TextWorkflow /> : <ImageWorkflow />}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-20 text-slate-500 text-sm flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" /> Powered by models on Hugging Face
      </footer>
    </div>
  );
}

export default App;
