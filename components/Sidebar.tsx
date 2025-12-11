import React from 'react';
import { TenancyTopic } from '../types';
import { Box, Database, Shield, Globe, Terminal, Server, Layout } from 'lucide-react';

interface SidebarProps {
  topics: TenancyTopic[];
  onSelectTopic: (prompt: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const IconMap: Record<string, React.ReactNode> = {
  Box: <Box size={18} />,
  Database: <Database size={18} />,
  Shield: <Shield size={18} />,
  Globe: <Globe size={18} />,
};

const Sidebar: React.FC<SidebarProps> = ({ topics, onSelectTopic, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />
      
      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <Server className="text-sky-400" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 tracking-tight">TenancyArchitect</h1>
              <p className="text-xs text-sky-500 font-medium">Laravel Edition</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Quick Start</h3>
              <div className="space-y-1">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      onSelectTopic(topic.prompt);
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all group"
                  >
                    <span className="text-slate-500 group-hover:text-sky-400 transition-colors">
                      {IconMap[topic.icon] || <Terminal size={18} />}
                    </span>
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Resources</h3>
              <div className="space-y-1">
                <a href="https://tenancyforlaravel.com/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-all">
                   <Layout size={18} />
                   Tenancy for Laravel
                </a>
                <a href="https://spatie.be/docs/laravel-multitenancy" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-all">
                   <Layout size={18} />
                   Spatie Multitenancy
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
               <p className="text-xs text-slate-400 leading-relaxed">
                 <span className="text-sky-400 font-semibold">Pro Tip:</span> Ask about "Bootstrappers" to learn how to isolate cache and sessions per tenant.
               </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;