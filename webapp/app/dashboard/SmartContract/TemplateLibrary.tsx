'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Edit3, Copy, Download, Search, Filter, Globe, Star } from 'lucide-react';

interface ContractTemplate {
  id: string;
  name: string;
  type: string;
  language: 'hindi' | 'english' | 'bilingual';
  category: string;
  description: string;
  preVettedClauses: PreVettedClause[];
  customFieldsCount: number;
  isStandard: boolean;
  isDefault: boolean;
  rating: number;
  usageCount: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
}

interface PreVettedClause {
  id: string;
  type: 'payment' | 'delivery' | 'penalty' | 'jurisdiction' | 'arbitration' | 'force_majeure' | 'confidentiality';
  title: string;
  content: string;
  language: 'hindi' | 'english' | 'bilingual';
  isRequired: boolean;
  category: string;
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: ContractTemplate) => void;
  onGoBack: () => void;
}

export default function TemplateLibrary({ onSelectTemplate, onGoBack }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ContractTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'hindi' | 'english' | 'bilingual'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockTemplates: ContractTemplate[] = [
    {
      id: 'temp_001',
      name: 'मानक आयात अनुबंध (Standard Import Contract)',
      type: 'import',
      language: 'bilingual',
      category: 'Trade & Commerce',
      description: 'Comprehensive import contract template with bilingual support for MSMEs',
      preVettedClauses: [
        {
          id: 'clause_001',
          type: 'payment',
          title: 'भुगतान शर्तें (Payment Terms)',
          content: 'L/C या D/P नियम; दस्तावेजों की सटीकता पर ही भुगतान। / L/C or D/P rules; payment only upon accuracy of documents.',
          language: 'bilingual',
          isRequired: true,
          category: 'financial'
        },
        {
          id: 'clause_002',
          type: 'delivery',
          title: 'डिलीवरी शर्तें (Delivery Terms)',
          content: 'पैकिंग विनिर्देश, आपूर्ति विंडो, आंशिक डिलीवरी शर्तें। / Packing specifications, supply window, partial deliveries terms.',
          language: 'bilingual',
          isRequired: true,
          category: 'logistics'
        },
        {
          id: 'clause_003',
          type: 'penalty',
          title: 'विलंब दंड (Delay Penalty)',
          content: 'देर से शिपमेंट के लिए दंड/स्थितियां। / Penalty/conditions for late shipment.',
          language: 'bilingual',
          isRequired: false,
          category: 'risk'
        }
      ],
      customFieldsCount: 8,
      isStandard: true,
      isDefault: true,
      rating: 4.8,
      usageCount: 245,
      lastUpdated: '2025-10-01',
      createdBy: 'Solviser Legal Team',
      tags: ['import', 'trade', 'bilingual', 'msme', 'standard']
    },
    {
      id: 'temp_002',
      name: 'Service Agreement Template',
      type: 'service',
      language: 'english',
      category: 'Professional Services',
      description: 'Professional services contract with comprehensive terms',
      preVettedClauses: [
        {
          id: 'clause_004',
          type: 'payment',
          title: 'Payment Schedule',
          content: 'Payment shall be made within 30 days of invoice receipt. Late payment charges of 1.5% per month.',
          language: 'english',
          isRequired: true,
          category: 'financial'
        },
        {
          id: 'clause_005',
          type: 'confidentiality',
          title: 'Non-Disclosure',
          content: 'All confidential information shall remain proprietary and not be disclosed to third parties.',
          language: 'english',
          isRequired: true,
          category: 'legal'
        }
      ],
      customFieldsCount: 6,
      isStandard: true,
      isDefault: false,
      rating: 4.6,
      usageCount: 189,
      lastUpdated: '2025-09-28',
      createdBy: 'Solviser Legal Team',
      tags: ['service', 'professional', 'consulting', 'english']
    },
    {
      id: 'temp_003',
      name: 'आपूर्ति समझौता (Supply Agreement)',
      type: 'supply',
      language: 'hindi',
      category: 'Manufacturing',
      description: 'विनिर्माण और आपूर्ति के लिए व्यापक समझौता टेम्प्लेट',
      preVettedClauses: [
        {
          id: 'clause_006',
          type: 'jurisdiction',
          title: 'न्यायाधिकार (Jurisdiction)',
          content: 'किसी भी विवाद के मामले में, दिल्ली की अदालतों का विशेष न्यायाधिकार होगा।',
          language: 'hindi',
          isRequired: true,
          category: 'legal'
        },
        {
          id: 'clause_007',
          type: 'arbitration',
          title: 'मध्यस्थता (Arbitration)',
          content: 'विवादों का समाधान भारतीय मध्यस्थता और सुलह अधिनियम 2015 के तहत होगा।',
          language: 'hindi',
          isRequired: false,
          category: 'legal'
        }
      ],
      customFieldsCount: 7,
      isStandard: true,
      isDefault: false,
      rating: 4.7,
      usageCount: 167,
      lastUpdated: '2025-09-25',
      createdBy: 'Solviser Legal Team',
      tags: ['supply', 'manufacturing', 'hindi', 'domestic']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTemplates(mockTemplates);
      setFilteredTemplates(mockTemplates);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(template => template.language === selectedLanguage);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, selectedLanguage, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'hindi': return '🇮🇳';
      case 'english': return '🇺🇸';
      case 'bilingual': return '🌐';
      default: return '📄';
    }
  };

  const getClauseTypeColor = (type: string) => {
    const colors = {
      payment: 'bg-green-100 text-green-800',
      delivery: 'bg-blue-100 text-blue-800',
      penalty: 'bg-red-100 text-red-800',
      jurisdiction: 'bg-purple-100 text-purple-800',
      arbitration: 'bg-yellow-100 text-yellow-800',
      force_majeure: 'bg-gray-100 text-gray-800',
      confidentiality: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={onGoBack} 
            title='Go Back'
            className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Template Library</h1>
            <p className="text-gray-500">Pre-vetted contract templates with standard clauses</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            title="Filter by language"
          >
            <option value="all">All Languages</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="bilingual">Bilingual</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            title="Filter by category"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            {/* Template Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 mr-2">{getLanguageIcon(template.language)}</span>
                    <span className="text-xs text-gray-500">{template.category}</span>
                  </div>
                </div>
              </div>
              {template.isDefault && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            {/* Pre-vetted Clauses */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Pre-vetted Clauses:</h4>
              <div className="flex flex-wrap gap-1">
                {template.preVettedClauses.slice(0, 3).map(clause => (
                  <span 
                    key={clause.id} 
                    className={`px-2 py-1 rounded-full text-xs ${getClauseTypeColor(clause.type)}`}
                  >
                    {clause.type.replace('_', ' ')}
                  </span>
                ))}
                {template.preVettedClauses.length > 3 && (
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    +{template.preVettedClauses.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{template.customFieldsCount} custom fields</span>
              <span>★ {template.rating}</span>
              <span>{template.usageCount} uses</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onSelectTemplate(template)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Use Template
              </button>
              <button 
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copy template"
              >
                <Copy className="h-4 w-4 text-gray-600" />
              </button>
              <button 
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Download template"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}