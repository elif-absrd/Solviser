'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Eye, 
  FileText,
  Globe,
  AlertCircle,
  CheckCircle,
  Users,
  Building,
  Calendar,
  DollarSign
} from 'lucide-react';

interface ContractClause {
  id: string;
  type: 'pre_vetted' | 'custom';
  category: 'payment' | 'delivery' | 'penalty' | 'jurisdiction' | 'arbitration' | 'force_majeure' | 'confidentiality' | 'termination' | 'custom';
  title: string;
  content: string;
  language: 'hindi' | 'english' | 'bilingual';
  isRequired: boolean;
  isEditable: boolean;
  position: number;
}

interface ContractBuilder {
  id: string;
  title: string;
  type: string;
  language: 'hindi' | 'english' | 'bilingual';
  template?: any;
  basicInfo: {
    parties: {
      party1: { name: string; email: string; gstin?: string; address: string };
      party2: { name: string; email: string; gstin?: string; address: string };
    };
    contractValue: number;
    currency: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  clauses: ContractClause[];
  customFields: { [key: string]: any };
  autoFillData: any;
  status: 'draft' | 'review' | 'ready';
}

interface ContractBuilderProps {
  template?: any;
  onSave: (contract: ContractBuilder) => void;
  onGoBack: () => void;
}

export default function ContractBuilder({ template, onSave, onGoBack }: ContractBuilderProps) {
  const [contract, setContract] = useState<ContractBuilder>({
    id: `contract_${Date.now()}`,
    title: '',
    type: template?.type || 'general',
    language: template?.language || 'english',
    template,
    basicInfo: {
      parties: {
        party1: { name: '', email: '', gstin: '', address: '' },
        party2: { name: '', email: '', gstin: '', address: '' }
      },
      contractValue: 0,
      currency: 'INR',
      startDate: '',
      endDate: '',
      description: ''
    },
    clauses: [],
    customFields: {},
    autoFillData: null,
    status: 'draft'
  });

  const [activeStep, setActiveStep] = useState(1);
  const [editingClause, setEditingClause] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Pre-vetted clauses library
  const preVettedClauses: ContractClause[] = [
    {
      id: 'clause_payment_001',
      type: 'pre_vetted',
      category: 'payment',
      title: 'भुगतान शर्तें (Payment Terms)',
      content: `भुगतान L/C या D/P नियमों के अनुसार होगा; दस्तावेजों की सटीकता पर ही भुगतान किया जाएगा।
      
Payment shall be made according to L/C or D/P rules; payment only upon accuracy of documents.
      
दस्तावेज प्रस्तुति अवधि और बैंकिंग प्रक्रियाएं लागू होंगी।
Document presentation period and banking procedures shall apply.
      
देर से भुगतान पर ब्याज (यदि लागू हो) लगेगा।
Interest on late payment (if applicable) shall be charged.`,
      language: 'bilingual',
      isRequired: true,
      isEditable: true,
      position: 1
    },
    {
      id: 'clause_delivery_001',
      type: 'pre_vetted',
      category: 'delivery',
      title: 'डिलीवरी शर्तें (Delivery Terms)',
      content: `पैकिंग विनिर्देश, आपूर्ति विंडो, आंशिक डिलीवरी शर्तें।
Packing specifications, supply window, partial deliveries terms.
      
निरीक्षण और अस्वीकृत शिपमेंट प्रक्रियाएं।
Inspection and rejected shipment procedures.
      
जोखिम और बीमा जिम्मेदारी शिपिंग शर्तों के अनुसार निर्धारित।
Risk and insurance responsibility determined according to shipping terms.`,
      language: 'bilingual',
      isRequired: true,
      isEditable: true,
      position: 2
    },
    {
      id: 'clause_penalty_001',
      type: 'pre_vetted',
      category: 'penalty',
      title: 'विलंब दंड (Liquidated Damages)',
      content: `देर से शिपमेंट के लिए दंड/स्थितियां निम्नलिखित होंगी:
Penalty/conditions for late shipment shall be as follows:
      
• प्रति दिन विलंब के लिए कुल मूल्य का 0.5% दंड
• 0.5% of total value per day of delay
      
• अधिकतम दंड कुल मूल्य का 10% तक सीमित
• Maximum penalty limited to 10% of total value
      
• फोर्स मेज्योर स्थितियों में दंड लागू नहीं
• Penalty not applicable in Force Majeure situations`,
      language: 'bilingual',
      isRequired: false,
      isEditable: true,
      position: 3
    },
    {
      id: 'clause_jurisdiction_001',
      type: 'pre_vetted',
      category: 'jurisdiction',
      title: 'न्यायाधिकार (Jurisdiction)',
      content: `इस अनुबंध से संबंधित किसी भी विवाद के मामले में, [शहर] की अदालतों का विशेष न्यायाधिकार होगा।
In case of any disputes related to this contract, courts of [City] shall have exclusive jurisdiction.
      
लागू कानून: भारतीय कानून
Governing Law: Indian Law
      
भाषा: अंग्रेजी/हिंदी में व्याख्या
Language: Interpretation in English/Hindi`,
      language: 'bilingual',
      isRequired: true,
      isEditable: true,
      position: 4
    },
    {
      id: 'clause_arbitration_001',
      type: 'pre_vetted',
      category: 'arbitration',
      title: 'मध्यस्थता (Arbitration)',
      content: `विवादों के मामले में, पहले बातचीत का प्रयास, यदि असफल तो मध्यस्थता [स्थान/नियम] लागू होगी।
In case of disputes, first attempt negotiation, if unresolved then arbitration [location/rules] shall apply.
      
समय सीमा और विशेषज्ञ पैनल प्रावधान।
Time limits and expert panel provisions.
      
मध्यस्थता भारतीय मध्यस्थता और सुलह अधिनियम 2015 के तहत।
Arbitration under Indian Arbitration and Conciliation Act 2015.`,
      language: 'bilingual',
      isRequired: false,
      isEditable: true,
      position: 5
    },
    {
      id: 'clause_force_majeure_001',
      type: 'pre_vetted',
      category: 'force_majeure',
      title: 'फोर्स मेज्योर (Force Majeure)',
      content: `प्राकृतिक आपदा, युद्ध, सरकारी आदेश, महामारी या अन्य अप्रत्याशित परिस्थितियों के कारण अनुबंध की पूर्ति में विफलता को फोर्स मेज्योर माना जाएगा।
Failure to fulfill contract due to natural disasters, war, government orders, pandemic or other unforeseen circumstances shall be considered Force Majeure.
      
फोर्स मेज्योर की स्थिति में 7 दिनों के भीतर सूचना देना आवश्यक।
Notice within 7 days is mandatory in case of Force Majeure.
      
अनुबंध की अवधि तदनुसार बढ़ाई जाएगी।
Contract period shall be extended accordingly.`,
      language: 'bilingual',
      isRequired: false,
      isEditable: true,
      position: 6
    }
  ];

  useEffect(() => {
    if (template && template.preVettedClauses) {
      setContract(prev => ({
        ...prev,
        clauses: template.preVettedClauses.map((clause: any, index: number) => ({
          ...clause,
          position: index + 1
        }))
      }));
    }
  }, [template]);

  const steps = [
    { id: 1, name: 'Basic Information', icon: FileText },
    { id: 2, name: 'Parties & Details', icon: Users },
    { id: 3, name: 'Contract Clauses', icon: Edit3 },
    { id: 4, name: 'Custom Fields', icon: Plus },
    { id: 5, name: 'Review & Finalize', icon: CheckCircle }
  ];

  const addCustomClause = () => {
    const newClause: ContractClause = {
      id: `custom_${Date.now()}`,
      type: 'custom',
      category: 'custom',
      title: 'New Custom Clause',
      content: '',
      language: contract.language,
      isRequired: false,
      isEditable: true,
      position: contract.clauses.length + 1
    };
    setContract(prev => ({
      ...prev,
      clauses: [...prev.clauses, newClause]
    }));
    setEditingClause(newClause.id);
  };

  const updateClause = (clauseId: string, updates: Partial<ContractClause>) => {
    setContract(prev => ({
      ...prev,
      clauses: prev.clauses.map(clause =>
        clause.id === clauseId ? { ...clause, ...updates } : clause
      )
    }));
  };

  const deleteClause = (clauseId: string) => {
    setContract(prev => ({
      ...prev,
      clauses: prev.clauses.filter(clause => clause.id !== clauseId)
    }));
  };

  const addPreVettedClause = (preVettedClause: ContractClause) => {
    const newClause = {
      ...preVettedClause,
      id: `${preVettedClause.id}_${Date.now()}`,
      position: contract.clauses.length + 1
    };
    setContract(prev => ({
      ...prev,
      clauses: [...prev.clauses, newClause]
    }));
  };

  const generatePreview = () => {
    return `
**${contract.title}**

**पार्टी 1 / Party 1:**
${contract.basicInfo.parties.party1.name}
${contract.basicInfo.parties.party1.address}
Email: ${contract.basicInfo.parties.party1.email}
${contract.basicInfo.parties.party1.gstin ? `GSTIN: ${contract.basicInfo.parties.party1.gstin}` : ''}

**पार्टी 2 / Party 2:**
${contract.basicInfo.parties.party2.name}
${contract.basicInfo.parties.party2.address}
Email: ${contract.basicInfo.parties.party2.email}
${contract.basicInfo.parties.party2.gstin ? `GSTIN: ${contract.basicInfo.parties.party2.gstin}` : ''}

**अनुबंध विवरण / Contract Details:**
Value: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: contract.basicInfo.currency }).format(contract.basicInfo.contractValue)}
Start Date: ${contract.basicInfo.startDate}
End Date: ${contract.basicInfo.endDate}
Description: ${contract.basicInfo.description}

**नियम और शर्तें / Terms and Conditions:**

${contract.clauses.map((clause, index) => `
${index + 1}. **${clause.title}**

${clause.content}
`).join('\n')}

---
Generated by Solviser Smart Contract Platform
    `;
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Title
                </label>
                <input
                  type="text"
                  value={contract.title}
                  onChange={(e) => setContract(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter contract title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Type
                </label>
                <select
                  value={contract.type}
                  onChange={(e) => setContract(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  aria-label="Contract Type"
                >
                  <option value="import">Import Agreement</option>
                  <option value="export">Export Agreement</option>
                  <option value="service">Service Agreement</option>
                  <option value="supply">Supply Agreement</option>
                  <option value="partnership">Partnership Agreement</option>
                  <option value="employment">Employment Contract</option>
                  <option value="general">General Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={contract.language}
                  onChange={(e) => setContract(prev => ({ ...prev, language: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  aria-label='Language'
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="bilingual">Bilingual (Hindi + English)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={contract.basicInfo.description}
                  onChange={(e) => setContract(prev => ({ 
                    ...prev, 
                    basicInfo: { ...prev.basicInfo, description: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the contract"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Parties & Contract Details</h3>
            
            {/* Party 1 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Party 1 (Sender)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={contract.basicInfo.parties.party1.name}
                    aria-label='Name'
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        parties: {
                          ...prev.basicInfo.parties,
                          party1: { ...prev.basicInfo.parties.party1, name: e.target.value }
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contract.basicInfo.parties.party1.email}
                    aria-label='Email'
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        parties: {
                          ...prev.basicInfo.parties,
                          party1: { ...prev.basicInfo.parties.party1, email: e.target.value }
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={contract.basicInfo.parties.party1.gstin}
                    aria-label='GSTIN'
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        parties: {
                          ...prev.basicInfo.parties,
                          party1: { ...prev.basicInfo.parties.party1, gstin: e.target.value }
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={contract.basicInfo.parties.party1.address}
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        parties: {
                          ...prev.basicInfo.parties,
                          party1: { ...prev.basicInfo.parties.party1, address: e.target.value }
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={2}
                    placeholder="Enter party 1 address"
                  />
                </div>
              </div>
            </div>

            {/* Party 2 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Party 2 (Receiver)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={contract.basicInfo.parties.party2.name}
                    aria-label='Name'
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        parties: {
                          ...prev.basicInfo.parties,
                          party2: { ...prev.basicInfo.parties.party2, name: e.target.value }
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contract.basicInfo.parties.party2.email}
                    aria-label='Email '
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        parties: {
                          ...prev.basicInfo.parties,
                          party2: { ...prev.basicInfo.parties.party2, email: e.target.value }
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={contract.basicInfo.parties.party2.gstin}
                    aria-label="GSTIN"
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        parties: {
                          ...prev.basicInfo.parties,
                          party2: { ...prev.basicInfo.parties.party2, gstin: e.target.value }
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={contract.basicInfo.parties.party2.address}
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        parties: {
                          ...prev.basicInfo.parties,
                          party2: { ...prev.basicInfo.parties.party2, address: e.target.value }
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={2}
                    aria-label="Party 2 Address"
                    placeholder="Enter party 2 address"
                  />
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Contract Financial Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Value</label>
                  <input
                    type="number"
                    value={contract.basicInfo.contractValue}
                    aria-label='Contract Value'
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, contractValue: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={contract.basicInfo.currency}
                    aria-label='Currency'
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, currency: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={contract.basicInfo.startDate}
                    aria-label='Start Date'
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, startDate: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={contract.basicInfo.endDate}
                    aria-label='End Date'
                    onChange={(e) => setContract(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, endDate: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Contract Clauses</h3>
              <div className="space-x-2">
                <button
                  onClick={addCustomClause}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Custom Clause</span>
                </button>
              </div>
            </div>

            {/* Pre-vetted Clauses Library */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Pre-vetted Clauses Library</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {preVettedClauses.filter(clause => 
                  !contract.clauses.some(contractClause => 
                    contractClause.category === clause.category && contractClause.type === 'pre_vetted'
                  )
                ).map(clause => (
                  <div key={clause.id} className="bg-white rounded border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm text-gray-900">{clause.title}</h5>
                      <button
                        onClick={() => addPreVettedClause(clause)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{clause.content.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Clauses */}
            <div className="space-y-4">
              {contract.clauses.map((clause, index) => (
                <div key={clause.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <h4 className="font-medium text-gray-900">{clause.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        clause.type === 'pre_vetted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {clause.type === 'pre_vetted' ? 'Pre-vetted' : 'Custom'}
                      </span>
                      {clause.isRequired && (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Required</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingClause(editingClause === clause.id ? null : clause.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit clause"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {!clause.isRequired && (
                        <button
                          onClick={() => deleteClause(clause.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Delete clause"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {editingClause === clause.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={clause.title}
                        onChange={(e) => updateClause(clause.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Clause title"
                      />
                      <textarea
                        value={clause.content}
                        onChange={(e) => updateClause(clause.id, { content: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={6}
                        placeholder="Clause content"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={clause.isRequired}
                              onChange={(e) => updateClause(clause.id, { isRequired: e.target.checked })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Required clause</span>
                          </label>
                        </div>
                        <button
                          onClick={() => setEditingClause(null)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{clause.content}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {contract.clauses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No clauses added yet. Add pre-vetted clauses or create custom ones.</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Custom Fields (≥5 Available)</h3>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Add deal-specific custom terms and conditions without compromising legal hygiene.
                </p>
              </div>
            </div>
            
            {/* Custom Fields - This would be dynamically generated based on contract type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Conditions
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Any special conditions specific to this deal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional requirements or specifications"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Standards
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Quality standards or certifications required"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Requirements
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Insurance coverage requirements"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Terms
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Warranty period and terms"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Review & Finalize</h3>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800">
                  Review all contract details before finalizing. You can preview the document and make final adjustments.
                </p>
              </div>
            </div>

            {/* Contract Summary */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Contract Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Title:</p>
                  <p className="text-gray-900">{contract.title || 'Untitled Contract'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Type:</p>
                  <p className="text-gray-900">{contract.type}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Language:</p>
                  <p className="text-gray-900">{contract.language}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Value:</p>
                  <p className="text-gray-900">
                    {new Intl.NumberFormat('en-IN', { 
                      style: 'currency', 
                      currency: contract.basicInfo.currency 
                    }).format(contract.basicInfo.contractValue)}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Parties:</p>
                  <p className="text-gray-900">
                    {contract.basicInfo.parties.party1.name} ↔ {contract.basicInfo.parties.party2.name}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Clauses:</p>
                  <p className="text-gray-900">{contract.clauses.length} clauses added</p>
                </div>
              </div>
            </div>

            {/* Preview Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowPreview(true)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>Preview Contract</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={onGoBack} 
            className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors mr-4"
            title='Go Back'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Contract Builder</h1>
            <p className="text-gray-500">Create custom contracts with pre-vetted clauses</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                activeStep >= step.id ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  activeStep >= step.id ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${
                  activeStep > step.id ? 'bg-red-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {getStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
          disabled={activeStep === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="space-x-3">
          <button
            onClick={() => onSave(contract)}
            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Save Draft
          </button>
          
          {activeStep < steps.length ? (
            <button
              onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => {
                setContract(prev => ({ ...prev, status: 'ready' }));
                onSave({ ...contract, status: 'ready' });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Finalize Contract
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Contract Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {generatePreview()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}