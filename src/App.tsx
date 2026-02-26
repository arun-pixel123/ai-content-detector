import React, { useState, useCallback } from 'react';
import { 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  FileText, 
  RefreshCw,
  CheckCircle2,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { analyzeContent, type AnalysisResult } from './services/geminiService';
import { cn } from './lib/utils';

const MAX_CHARS = 5000;

export default function App() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50) {
      setError('Please enter at least 50 characters for a reliable analysis.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeContent(text);
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Veritas AI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="text-indigo-600">Checker</a>
            <a href="#" className="hover:text-gray-900 transition-colors">API</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Enterprise</a>
          </nav>
          <button className="text-sm font-medium px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            Sign In
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className={cn(
            "space-y-6 transition-all duration-500",
            result ? "lg:col-span-5" : "lg:col-span-8 lg:col-start-3"
          )}>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">AI Content Detector</h2>
              <p className="text-gray-500">
                Paste your text below to analyze its origin, quality, and human-like characteristics.
              </p>
            </div>

            <div className="relative group">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Paste your text here (min 50 characters)..."
                className="w-full h-[400px] p-6 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-lg leading-relaxed"
              />
              <div className="absolute bottom-4 right-6 flex items-center gap-4 text-xs font-medium text-gray-400">
                <span>{text.length} / {MAX_CHARS} characters</span>
                {text.length > 0 && (
                  <button 
                    onClick={reset}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <RefreshCw size={12} /> Clear
                  </button>
                )}
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || text.length < 50}
              className={cn(
                "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20",
                isAnalyzing ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
              )}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Analyzing Patterns...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Check Content
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-7 space-y-8"
              >
                {/* Score Overview */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">AI Probability</span>
                      <Sparkles size={16} className="text-indigo-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold tracking-tighter text-indigo-600">{result.aiScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.aiScore}%` }}
                        className="h-full bg-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Human Probability</span>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold tracking-tighter text-emerald-600">{result.humanScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.humanScore}%` }}
                        className="h-full bg-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Detailed Metrics</h3>
                    <div className="flex gap-4 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1"><Info size={12} /> Readability: {result.readability}</span>
                      <span className="flex items-center gap-1"><Info size={12} /> Tone: {result.tone}</span>
                    </div>
                  </div>
                  <div className="p-6 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.detailedMetrics} layout="vertical" margin={{ left: 40, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis 
                          dataKey="label" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fontWeight: 500, fill: '#64748B' }}
                          width={100}
                        />
                        <Tooltip 
                          cursor={{ fill: '#F8FAFC' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                          {result.detailedMetrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 70 ? '#4F46E5' : '#94A3B8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg px-2">Key Observations</h3>
                  <div className="grid gap-3">
                    {result.keyFindings.map((finding, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-white border border-gray-200 rounded-xl flex gap-4 items-start shadow-sm"
                      >
                        <div className="mt-1 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                          <span className="text-[10px] font-bold">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{finding}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="p-6 bg-indigo-900 rounded-2xl text-white space-y-6 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400" />
                    <h3 className="font-bold text-lg">Optimization Tips</h3>
                  </div>
                  <div className="grid gap-6">
                    {result.suggestions.map((suggestion, i) => (
                      <div key={i} className="space-y-1 group cursor-default">
                        <div className="flex items-center gap-2 text-indigo-200 group-hover:text-white transition-colors">
                          <span className="font-bold text-sm uppercase tracking-widest">{suggestion.title}</span>
                          <ChevronRight size={14} />
                        </div>
                        <p className="text-indigo-100/80 text-sm leading-relaxed">{suggestion.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck size={20} />
            <span className="font-bold tracking-tight">Veritas AI</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Contact Support</a>
          </div>
          <p className="text-xs text-gray-400">
            © 2026 Veritas AI Content Checker. Powered by Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
}
