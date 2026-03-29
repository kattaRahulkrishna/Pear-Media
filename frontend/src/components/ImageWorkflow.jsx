import { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Search, ImageIcon, Loader2, X } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function ImageWorkflow() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [variationImage, setVariationImage] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // reset states
      setCaption('');
      setVariationImage(null);
      setError('');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCaption('');
    setVariationImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError('');
    setCaption('');
    setVariationImage(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post(`${API_BASE}/image/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCaption(res.data.caption);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image. Please check your API key.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVariation = async () => {
    if (!caption) return;
    setIsGenerating(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/image/variations`, { caption });
      setVariationImage(res.data.image);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate variation. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Upload Source Image</label>
        
        {!previewUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-600 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
          >
            <div className="bg-slate-800 p-4 rounded-full group-hover:scale-110 transition-transform mb-4 shadow-lg">
              <UploadCloud className="w-8 h-8 text-blue-400" />
            </div>
            <p className="font-medium text-slate-300">Click to upload or drag and drop</p>
            <p className="text-sm mt-1 opacity-70">PNG, JPG up to 10MB</p>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group">
            <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-[400px] object-contain" />
            <button 
              onClick={clearFile}
              className="absolute top-4 right-4 bg-black/50 hover:bg-red-500/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {previewUrl && !caption && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {isAnalyzing ? 'Analyzing Image...' : 'Analyze Image'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Step 2: Show Analysis & Generate Variation */}
      {caption && (
        <div className="p-5 bg-slate-800/80 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] animate-fade-in">
          <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
            <Search className="w-4 h-4" /> Extracted Subject & Style
          </label>
          <div className="text-slate-200 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700 capitalize font-medium">
            "{caption}"
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerateVariation}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {isGenerating ? 'Generating Variation...' : 'Generate New Variation'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Result Image */}
      {variationImage && (
        <div className="mt-8 pt-6 border-t border-slate-700 animate-fade-in">
          <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" /> Generated Variation
          </label>
          <div className="bg-slate-900/50 rounded-2xl p-2 border border-slate-700/50 overflow-hidden shadow-2xl">
            <img src={variationImage} alt="Variation" className="w-full h-auto rounded-xl object-cover" />
          </div>
        </div>
      )}
    </div>
  );
}
