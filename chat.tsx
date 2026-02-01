import React, { useState, useRef } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ArrowUp, 
  Settings, 
  X, 
  File as FileIcon,
  Zap,
  Brain,
  Bot,
  Layers,
  Globe,
  Telescope,
  Search,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Configuration for Models
const MODELS = [
  { id: 'instant', name: 'R2 Instant', description: 'Fast Responses, Good Quality', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'thinking', name: 'R2 Thinking', description: 'Extended Capabilities Than Instant', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'agent', name: 'R2 Agent', description: 'Access to pro features.', icon: Bot, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'matrix', name: 'R2 Agent Matrix', description: 'Agent with higher token limits.', icon: Layers, color: 'text-rose-500', bg: 'bg-rose-50' },
];

const MODIFIERS = [
  { id: 'web_search', label: 'Web Search', icon: Search, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'deep_research', label: 'Deep Research', icon: Telescope, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'website_generation', label: 'Website Generation', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [files, setFiles] = useState<Array<{ name: string; type: string; url?: string }>>([]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedModifier, setSelectedModifier] = useState<string | null>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isModifierMenuOpen, setIsModifierMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const showModelSelector = !['deep_research', 'website_generation'].includes(selectedModifier || '');
  const isActive = inputValue.trim().length > 0 || files.length > 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const toggleModifier = (id: string) => {
    setSelectedModifier(prev => prev === id ? null : id);
    setIsModifierMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-white border-r border-gray-200 flex flex-col relative z-30"
      >
        <div className="p-4 flex flex-col h-full min-w-[280px]">
          <button className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors mb-6 group text-left">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gray-900 rounded-lg text-white">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm text-gray-700">New Chat</span>
            </div>
            <MessageSquare className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <div className="flex-1 overflow-y-auto">
            <div className="px-2 mb-4 flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Clock className="w-3 h-3" /> Recent
            </div>
            <div className="px-2 text-sm text-gray-400 italic">
              No recent chats
            </div>
          </div>

          <div className="pt-4 mt-auto border-t border-gray-100">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">
                  JD
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-900 transition-colors z-40"
        >
          {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>

        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-semibold text-gray-900 mb-12 tracking-tight text-center"
          >
            What will you create today?
          </motion.h1>

          <div className="w-full max-w-2xl bg-white rounded-[26px] border border-gray-300 shadow-sm p-3 relative transition-all focus-within:shadow-md focus-within:border-gray-400">
            {files.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3 px-1">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="h-16 w-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {file.url ? <img src={file.url} className="h-full w-full object-cover" alt="preview" /> : <FileIcon className="w-8 h-8 text-gray-400" />}
                    </div>
                    <button onClick={() => setFiles(f => f.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Anything..."
              className="w-full h-12 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-500 text-lg font-normal leading-relaxed overflow-hidden py-2 px-1"
              style={{ minHeight: '48px' }}
            />

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                <button onClick={() => fileInputRef.current?.click()} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
                
                <div className="relative">
                  <button onClick={() => setIsModifierMenuOpen(!isModifierMenuOpen)} className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 ${selectedModifier ? 'bg-gray-100' : ''}`}>
                    <Settings className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {isModifierMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-12 left-0 w-64 bg-white rounded-2xl border border-gray-200 shadow-lg py-2 z-50">
                        {MODIFIERS.filter(mod => mod.id !== selectedModifier).map(mod => (
                          <button key={mod.id} onClick={() => toggleModifier(mod.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                            <mod.icon className={`w-4 h-4 ${mod.color}`} /> {mod.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {selectedModifier && (
                  <div className={`inline-flex items-center gap-2 ${MODIFIERS.find(m => m.id === selectedModifier)?.bg} px-2.5 py-1 rounded-lg border`}>
                    <button onClick={() => setSelectedModifier(null)} className="p-0.5 rounded-full hover:bg-white"><X className="w-3 h-3 stroke-[3]" /></button>
                    <span className="text-xs font-medium">{MODIFIERS.find(m => m.id === selectedModifier)?.label}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {showModelSelector && (
                  <button onClick={() => setIsModelMenuOpen(!isModelMenuOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <selectedModel.icon className={`w-4 h-4 ${selectedModel.color}`} /> {selectedModel.name} <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <button disabled={!isActive} className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isActive ? 'bg-black text-white' : 'bg-gray-200 text-white'}`}>
                  <ArrowUp className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Overlays */}
      <AnimatePresence>
        {isModelMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsModelMenuOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-[120px] right-[calc(50%-336px)] w-72 bg-white rounded-2xl border border-gray-200 shadow-xl p-1.5 z-50">
              {MODELS.map(model => (
                <button key={model.id} onClick={() => { setSelectedModel(model); setIsModelMenuOpen(false); }} className={`w-full text-left p-3 rounded-xl flex gap-3 ${selectedModel.id === model.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                  <model.icon className={`w-4 h-4 mt-1 ${model.color}`} />
                  <div>
                    <div className="text-sm font-semibold">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.description}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
