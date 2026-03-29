import { useState } from 'react';
import axios from 'axios';
import { Wand2, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function TextWorkflow() {
  const [prompt, setPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setError('');
    setEnhancedPrompt('');
    setGeneratedImage(null);
    try {
      const res = await axios.post(`${API_BASE}/text/enhance`, { prompt });
      setEnhancedPrompt(res.data.enhancedPrompt);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enhance prompt. Please check your API key.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApproveAndGenerate = async () => {
    if (!enhancedPrompt) return;
    setIsGenerating(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/text/generate-image`, { prompt: enhancedPrompt });
      setGeneratedImage(res.data.image);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate image. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Original Prompt</label>
        <textarea
          rows={3}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
          placeholder="e.g. A futuristic city..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleEnhance}
            disabled={!prompt.trim() || isEnhancing}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
          >
            {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Step 2: Review Enhanced Prompt */}
      {enhancedPrompt && (
        <div className="p-5 bg-slate-800/80 rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)] animate-fade-in">
          <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
            <SparkleIcon className="w-4 h-4" /> AI Enhanced Prompt
          </label>
          <div className="text-slate-200 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            {enhancedPrompt}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleApproveAndGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {isGenerating ? 'Generating Image...' : 'Approve & Generate Image'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Result Image */}
      {generatedImage && (
        <div className="mt-8 pt-6 border-t border-slate-700 animate-fade-in">
          <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" /> Generated Visual
          </label>
          <div className="bg-slate-900/50 rounded-2xl p-2 border border-slate-700/50 overflow-hidden shadow-2xl relative group">
            <img src={generatedImage} alt="Generated" className="w-full h-auto rounded-xl object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-slate-200 text-sm font-medium backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-md">
                Generated with SDXL
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SparkleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
