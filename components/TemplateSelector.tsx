'use client';

import { useState } from 'react';
import { templates, getCategories, getTemplatesByCategory, Template } from '../lib/templates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export default function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = getCategories();
  const filteredTemplates = getTemplatesByCategory(selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-primary">Choose a Template</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="border-2 border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-primary hover:shadow-xl transition-all duration-300 group"
              >
                {/* Template Preview */}
                <div 
                  className="aspect-[9/16] relative"
                  style={{ backgroundColor: template.colors.background }}
                >
                  {/* Mini Preview */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 space-y-2">
                    {/* Title Preview */}
                    <div
                      className="w-full rounded-lg p-3 text-center font-bold shadow-lg"
                      style={{
                        backgroundColor: template.colors.titleBg,
                        color: template.colors.titleText,
                        fontSize: '14px',
                      }}
                    >
                      Your Title Here
                    </div>

                    {/* Item Previews */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-full rounded-lg p-2 text-center font-semibold shadow"
                        style={{
                          backgroundColor: template.colors.itemBg,
                          color: template.colors.itemText,
                          fontSize: '11px',
                        }}
                      >
                        {i}. List item example
                      </div>
                    ))}
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                      <h3 className="text-white text-xl font-bold mb-2">
                        {template.name}
                      </h3>
                      <p className="text-white text-sm mb-3">
                        {template.description}
                      </p>
                      <div className="inline-block bg-white text-primary font-bold px-4 py-2 rounded-lg">
                        Use Template
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-3 bg-white">
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-600">{template.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Click any template to apply it to your video
          </p>
        </div>
      </div>
    </div>
  );
}
