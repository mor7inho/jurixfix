'use client';

import React from 'react';
import { Home, BookOpen, Search, User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BookOpen, label: 'Casos', active: false },
    { icon: Search, label: 'Busca Avançada', active: false },
    { icon: User, label: 'Perfil', active: false },
    { icon: Settings, label: 'Configurações', active: false },
  ];

  const modules = [
    { name: 'Fundamentos do Direito Administrativo', count: 16, active: true },
    { name: 'Organização Administrativa', count: 12, upcoming: true },
    { name: 'Atos Administrativos', count: 8, upcoming: true },
    { name: 'Contratos Administrativos', count: 10, upcoming: true },
    { name: 'Serviços Públicos', count: 14, upcoming: true },
  ];

  return (
    <aside className={cn(
      "flex flex-col w-64 h-screen bg-white border-r border-gray-200",
      "overflow-y-auto",
      className
    )}>
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">JurisFix</h1>
            <p className="text-xs text-gray-500">SaaS Jurídico</p>
          </div>
        </div>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                item.active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Módulos */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Módulos
          </h3>
          <div className="space-y-1">
            {modules.map((module) => (
              <div
                key={module.name}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg",
                  module.active
                    ? "bg-emerald-50 border border-emerald-100"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    module.active ? "text-emerald-500 rotate-90" : "text-gray-400"
                  )} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {module.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {module.count} casos
                    </p>
                  </div>
                </div>
                {module.upcoming && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Em breve
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Perfil */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Advogado Usuário</p>
            <p className="text-xs text-gray-500">assinatura premium</p>
          </div>
          <LogOut className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;