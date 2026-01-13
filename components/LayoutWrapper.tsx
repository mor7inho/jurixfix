'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Carregar estado salvo ao montar
  useEffect(() => {
    const saved = localStorage.getItem('sidebarHidden');
    if (saved) {
      setSidebarHidden(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  // Salvar estado quando mudar
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebarHidden', JSON.stringify(sidebarHidden));
    }
  }, [sidebarHidden, mounted]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarVisibility = () => {
    setSidebarHidden(!sidebarHidden);
    setSidebarOpen(false);
  };

  return (
    <div className="flex relative min-h-screen bg-white">
      {/* Botão para mostrar sidebar quando oculta no desktop */}
      {sidebarHidden && (
        <button
          onClick={toggleSidebarVisibility}
          className="fixed left-0 top-16 z-30 p-2 bg-emerald-500 hover:bg-emerald-600 rounded-r-lg transition-colors hidden md:block"
          title="Mostrar menu"
          aria-label="Mostrar menu"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Overlay com efeito de blur quando menu está aberto em mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar com estado - oculta quando sidebarHidden é true */}
      {!sidebarHidden && (
        <div
          className={`fixed md:relative z-40 h-screen transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <Sidebar onToggleHide={toggleSidebarVisibility} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen w-full overflow-y-auto">
        {/* Header com botão de toggle */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
          <div className="flex-1 md:flex-none text-center md:text-left">
            <h1 className="text-lg font-semibold text-gray-900">JurisFix</h1>
          </div>
          <div className="w-10" />
        </div>

        {/* Conteúdo da página */}
        {children}
      </main>
    </div>
  );
}
