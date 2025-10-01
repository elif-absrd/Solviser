'use client';

import React, { useState, useEffect } from 'react';
import Stepper from './Stepper';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ImportContractPageProps {
  onGoBack: () => void;
}

interface Item {
  id: number;
  itemName: string;
  origin: string;
  subCategory: string;
  qty: string;
  rate: string;
  amount: number;
  remarks: string;
}

interface ImportFormData {
  // Basic Contract Info
  contractType: string;
  gstin: string;
  firmName: string;
  gstState: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  
  // Items
  items: Item[];
  totalAmount: number;
  amountInWords: string;
  
  // Shipping & Payment
  shippingTerms: string;
  paymentTerms: string;
  paymentPeriod: string;
  paymentPeriodFrom: string;
  
  // Dates
  invoiceDate: string;
  negotiationDate: string;
  acceptanceDate: string;
  blDate: string;
  latestShipmentDate: string;
  lcExpiryDate: string;
  lcExpiryPlace: string;
  presentationDeadline: string;
  
  // Documents
  documents: {
    invoice: boolean;
    packingList: boolean;
    bl: boolean;
    coo: boolean;
    insurance: boolean;
    phytosanitary: boolean;
    other: boolean;
  };
  otherDocuments: string;
  
  // Bank Details
  advisingBank: string;
  advisingCity: string;
  advisingPin: string;
  advisingCountry: string;
  
  // Terms
  generalTerms: string;
  shippingTermsText: string;
  paymentTermsText: string;
  deliveryTerms: string;
  disputeTerms: string;
  otherTerms: string;
  
  // Acceptance
  termsAccepted: {
    general: boolean;
    shipping: boolean;
    payment: boolean;
    delivery: boolean;
    dispute: boolean;
    others: boolean;
  };
}

const itemOptions = ["Pine Wood", "Hardwood", "Teak Wood"];
const pineOrigins = ["Uruguay", "New Zealand", "Australia", "Southern Yellow Pine (SYP)"];
const sypSub = ["Lumbers", "Logs Unedged"];

export default function ImportContractPage({ onGoBack }: ImportContractPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('general');
  const [showPaymentPeriodModal, setShowPaymentPeriodModal] = useState(false);
  const [customPaymentPeriod, setCustomPaymentPeriod] = useState('');
  
  const [formData, setFormData] = useState<ImportFormData>({
    contractType: 'Import',
    gstin: '',
    firmName: '',
    gstState: '',
    supplierName: '',
    supplierEmail: '',
    supplierPhone: '',
    
    items: [{
      id: Date.now(),
      itemName: '',
      origin: '',
      subCategory: '',
      qty: '',
      rate: '',
      amount: 0,
      remarks: ''
    }],
    totalAmount: 0,
    amountInWords: '',
    
    shippingTerms: 'CIF',
    paymentTerms: 'Letter of Credit (L/C)',
    paymentPeriod: '90 Days',
    paymentPeriodFrom: '',
    
    invoiceDate: '',
    negotiationDate: '',
    acceptanceDate: '',
    blDate: '',
    latestShipmentDate: '',
    lcExpiryDate: '',
    lcExpiryPlace: '',
    presentationDeadline: '21 Days from LSD',
    
    documents: {
      invoice: false,
      packingList: false,
      bl: false,
      coo: false,
      insurance: false,
      phytosanitary: false,
      other: false
    },
    otherDocuments: '',
    
    advisingBank: '',
    advisingCity: '',
    advisingPin: '',
    advisingCountry: '',
    
    generalTerms: `This contract shall be valid between two parties.
Any modifications shall be made in writing and with mutual consent.
Relevant Indian/International laws shall apply.
Tax/Duty responsibilities of supplier/buyer shall be clearly specified.`,
    shippingTermsText: `Risk and insurance responsibility determined according to shipping terms (CIF/CFR/CNF).
Delivery port/port of discharge shall be specified.
Penalty/conditions for late shipment.`,
    paymentTermsText: `L/C or D/P rules; payment only upon accuracy of documents.
Document presentation period and banking procedures.
Interest on late payment (if applicable).`,
    deliveryTerms: `Packing specifications, supply window, partial deliveries terms.
Inspection and rejected shipment procedures.`,
    disputeTerms: `In case of disputes, first attempt negotiation, if unresolved then arbitration [location/rules] shall apply.
Time limits and expert panel provisions.`,
    otherTerms: `Force Majeure clause.
Confidentiality, IP policies.
Cancellations and termination clauses.`,
    
    termsAccepted: {
      general: false,
      shipping: false,
      payment: false,
      delivery: false,
      dispute: false,
      others: false
    }
  });

  // Auto-calculate totals when items change
  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const words = numberToWords(total) + ' USD';
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      amountInWords: words
    }));
  }, [formData.items]);

  // Auto-fetch firm name when GSTIN changes (simulated)
  useEffect(() => {
    if (formData.gstin && formData.gstin.length >= 10) {
      // Simulate API call to fetch firm details
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          firmName: 'Auto-fetched Company Name',
          gstState: 'Maharashtra'
        }));
      }, 1000);
    }
  }, [formData.gstin]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Calculate amount if qty or rate changes
          if (field === 'qty' || field === 'rate') {
            const qty = parseFloat(field === 'qty' ? value : item.qty) || 0;
            const rate = parseFloat(field === 'rate' ? value : item.rate) || 0;
            updatedItem.amount = qty * rate;
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    const newItem: Item = {
      id: Date.now(),
      itemName: '',
      origin: '',
      subCategory: '',
      qty: '',
      rate: '',
      amount: 0,
      remarks: ''
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const handleDocumentChange = (docType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: checked
      }
    }));
  };

  const handleTermsAcceptance = (termType: string, accepted: boolean) => {
    setFormData(prev => ({
      ...prev,
      termsAccepted: {
        ...prev.termsAccepted,
        [termType]: accepted
      }
    }));
  };

  const handlePaymentPeriodFromChange = (value: string) => {
    if (value === 'others') {
      setShowPaymentPeriodModal(true);
    } else {
      handleInputChange('paymentPeriodFrom', value);
    }
  };

  const saveCustomPaymentPeriod = () => {
    if (customPaymentPeriod.trim()) {
      handleInputChange('paymentPeriodFrom', customPaymentPeriod);
      setShowPaymentPeriodModal(false);
      setCustomPaymentPeriod('');
    }
  };

  const numberToWords = (num: number): string => {
    if (num === 0) return "Zero";
    if (num < 0) return "Negative " + numberToWords(-num);
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    
    const convertHundreds = (n: number): string => {
      let result = '';
      
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result.trim();
      }
      
      if (n > 0) {
        result += ones[n] + ' ';
      }
      
      return result.trim();
    };
    
    const parts = num.toString().split('.');
    let integerPart = parseInt(parts[0]);
    const decimalPart = parts[1] ? parseInt(parts[1].padEnd(2, '0').substring(0, 2)) : 0;
    
    let result = '';
    let groupIndex = 0;
    
    if (integerPart === 0) {
      result = 'Zero';
    } else {
      while (integerPart > 0) {
        const group = integerPart % 1000;
        if (group !== 0) {
          const groupWords = convertHundreds(group);
          result = groupWords + (thousands[groupIndex] ? ' ' + thousands[groupIndex] : '') + (result ? ' ' + result : '');
        }
        integerPart = Math.floor(integerPart / 1000);
        groupIndex++;
      }
    }
    
    if (decimalPart > 0) {
      result += ' and ' + convertHundreds(decimalPart) + ' Cents';
    }
    
    return result.trim();
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add logo
    try {
      doc.addImage('/blacklogo.png', 'PNG', 15, 15, 40, 10);
    } catch (e) {
      console.error("Could not add logo. Make sure it's in your /public folder.", e);
      doc.setFontSize(20);
      doc.text("Solviser", 15, 25);
    }

    // Header
    doc.setFontSize(18);
    doc.text("Import Smart Contract", pageWidth - 15, 25, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`Contract ID: IMP-2025-0001`, pageWidth - 15, 32, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, 37, { align: 'right' });

    doc.line(15, 45, pageWidth - 15, 45);

    let yPosition = 55;

    // Basic Information Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Contract Information", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const basicInfo = [
      ['Contract Type', formData.contractType],
      ['GSTIN', formData.gstin],
      ['Firm Name', formData.firmName],
      ['GST State', formData.gstState],
      ['Supplier Name', formData.supplierName],
      ['Supplier Email', formData.supplierEmail],
      ['Supplier Phone', formData.supplierPhone]
    ];

    autoTable(doc, {
      startY: yPosition,
      body: basicInfo,
      theme: 'grid',
      tableWidth: 'wrap',
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 80 }
      },
      margin: { left: 15 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Items Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Item Details", 15, yPosition);
    yPosition += 10;

    const itemHeaders = [['Item Name', 'Origin', 'Sub-Category', 'Quantity', 'Rate (USD)', 'Amount (USD)']];
    const itemBody = formData.items.map(item => [
      item.itemName,
      item.origin,
      item.subCategory,
      item.qty,
      parseFloat(item.rate).toFixed(2),
      item.amount.toFixed(2)
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: itemHeaders,
      body: itemBody,
      theme: 'grid',
      headStyles: {
        fillColor: [35, 31, 32]
      },
      margin: { left: 15, right: 15 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Total Amount
    const totalData = [
      ['Total Amount', `${formData.totalAmount.toFixed(2)} USD`],
      ['Amount in Words', formData.amountInWords]
    ];

    autoTable(doc, {
      startY: yPosition,
      body: totalData,
      theme: 'plain',
      tableWidth: 'wrap',
      margin: { left: pageWidth / 2 },
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'right' },
        1: { halign: 'right' }
      },
      didParseCell: (data) => {
        if (data.row.index === 0) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 12;
        }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 30;
    }

    // Shipping & Payment Terms
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Shipping & Payment Terms", 15, yPosition);
    yPosition += 10;

    const termsData = [
      ['Shipping Terms', formData.shippingTerms],
      ['Payment Terms', formData.paymentTerms],
      ['Payment Period', formData.paymentPeriod],
      ['Payment Period From', formData.paymentPeriodFrom],
      ['Latest Shipment Date', formData.latestShipmentDate],
      ['LC Expiry Date', formData.lcExpiryDate],
      ['LC Expiry Place', formData.lcExpiryPlace]
    ];

    autoTable(doc, {
      startY: yPosition,
      body: termsData,
      theme: 'grid',
      tableWidth: 'wrap',
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 80 }
      },
      margin: { left: 15 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 30;
    }

    // Bank Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Bank Details", 15, yPosition);
    yPosition += 10;

    const bankData = [
      ['Advising Bank', formData.advisingBank],
      ['City', formData.advisingCity],
      ['PIN', formData.advisingPin],
      ['Country', formData.advisingCountry]
    ];

    autoTable(doc, {
      startY: yPosition,
      body: bankData,
      theme: 'grid',
      tableWidth: 'wrap',
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 80 }
      },
      margin: { left: 15 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 30;
    }

    // Documents Required
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Documents Required", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const documents = [];
    if (formData.documents.invoice) documents.push('Invoice');
    if (formData.documents.packingList) documents.push('Packing List');
    if (formData.documents.bl) documents.push('Bill of Lading');
    if (formData.documents.coo) documents.push('Certificate of Origin');
    if (formData.documents.insurance) documents.push('Insurance Certificate');
    if (formData.documents.phytosanitary) documents.push('Phytosanitary Certificate');
    if (formData.documents.other) documents.push(formData.otherDocuments);

    documents.forEach((doc_name, index) => {
      doc.text(`• ${doc_name}`, 20, yPosition + (index * 5));
    });

    yPosition += (documents.length * 5) + 15;

    // Signature section
    const signatureY = Math.max(yPosition, pageHeight - 40);
    
    if (signatureY > pageHeight - 40) {
      doc.addPage();
    }

    const finalSignatureY = signatureY > pageHeight - 40 ? 40 : signatureY;
    
    doc.line(15, finalSignatureY, 80, finalSignatureY);
    doc.text("Exporter Signature", 47.5, finalSignatureY + 5, { align: 'center' });
    
    doc.line(pageWidth - 80, finalSignatureY, pageWidth - 15, finalSignatureY);
    doc.text("Importer Signature", pageWidth - 47.5, finalSignatureY + 5, { align: 'center' });

    // Download the PDF
    doc.save(`Import_Contract_Draft_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Validate that all required terms are accepted
    const allTermsAccepted = Object.values(formData.termsAccepted).every(accepted => accepted);
    
    if (!allTermsAccepted) {
      alert('Please accept all terms and conditions before submitting.');
      return;
    }
    
    // Here you would typically submit to your API
    console.log('Submitting import contract:', formData);
    alert('Import contract created successfully!');
    onGoBack();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Basic Contract Information</h2>
              <p className="text-gray-500">Enter the basic details for your import contract.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type *</label>
                <select 
                  value={formData.contractType}
                  onChange={(e) => handleInputChange('contractType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Import">Import</option>
                  <option value="Export">Export</option>
                  <option value="Clearing">Clearing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Goods Supply">Goods Supply</option>
                  <option value="Services">Services</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN / GST Number *</label>
                <input 
                  type="text" 
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="Enter GST Number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                <input 
                  type="text" 
                  value={formData.firmName}
                  onChange={(e) => handleInputChange('firmName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                  placeholder="Auto-fetched from GST" 
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GST State</label>
                <input 
                  type="text" 
                  value={formData.gstState}
                  onChange={(e) => handleInputChange('gstState', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                  placeholder="Auto-fetched from GST" 
                  readOnly
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Supplier Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={formData.supplierName}
                    onChange={(e) => handleInputChange('supplierName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={formData.supplierEmail}
                    onChange={(e) => handleInputChange('supplierEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.supplierPhone}
                    onChange={(e) => handleInputChange('supplierPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Item Details</h2>
                  <p className="text-gray-500">Add the items to be imported with their specifications.</p>
                </div>
                <button 
                  onClick={addItem}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  + Add Item
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Item Name *</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Origin *</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Sub-Category *</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Qty (CBM) *</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Rate (USD) *</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Amount (USD)</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 px-2">
                          <select 
                            value={item.itemName}
                            onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                            title="Select item name"
                          >
                            <option value="">Select Item</option>
                            {itemOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <select 
                            value={item.origin}
                            onChange={(e) => handleItemChange(item.id, 'origin', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                            title="Select origin country"
                          >
                            <option value="">Select Origin</option>
                            {pineOrigins.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <select 
                            value={item.subCategory}
                            onChange={(e) => handleItemChange(item.id, 'subCategory', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                            title="Select sub-category"
                          >
                            <option value="">Select Sub-Category</option>
                            {sypSub.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <input 
                            type="number" 
                            value={item.qty}
                            onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500" 
                            placeholder="0"
                            title="Quantity in CBM"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input 
                            type="number" 
                            value={item.rate}
                            onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500" 
                            placeholder="0.00" 
                            step="0.01"
                            title="Rate in USD"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input 
                            type="text" 
                            value={item.amount.toFixed(2)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50" 
                            readOnly
                            title="Calculated amount"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-white hover:bg-red-600 p-1 rounded transition-colors"
                            disabled={formData.items.length <= 1}
                            title="Remove item"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <div className="text-lg font-semibold text-gray-800">
                  Total Amount (USD): <span className="text-red-600">${formData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount in Words</label>
                <input 
                  type="text" 
                  value={formData.amountInWords}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" 
                  placeholder="Auto-generated" 
                  readOnly
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping & Payment Terms</h2>
              <p className="text-gray-500">Configure the shipping and payment terms for the contract.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Terms (Incoterms) *</label>
                <select 
                  value={formData.shippingTerms}
                  onChange={(e) => handleInputChange('shippingTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Select shipping terms"
                >
                  <option value="CIF">CIF</option>
                  <option value="CFR">CFR</option>
                  <option value="CNF">CNF</option>
                  <option value="FOB">FOB</option>
                  <option value="EXW">EXW</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms *</label>
                <select 
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Select payment terms"
                >
                  <option value="Letter of Credit (L/C)">Letter of Credit (L/C)</option>
                  <option value="Document against Payment (D/P)">Document against Payment (D/P)</option>
                  <option value="Document against Acceptance (D/A)">Document against Acceptance (D/A)</option>
                  <option value="Wire Transfer">Wire Transfer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period</label>
                <select 
                  value={formData.paymentPeriod}
                  onChange={(e) => handleInputChange('paymentPeriod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Select payment period"
                >
                  <option value="90 Days">90 Days</option>
                  <option value="120 Days">120 Days</option>
                  <option value="150 Days">150 Days</option>
                  <option value="180 Days">180 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period From</label>
                <select 
                  value={formData.paymentPeriodFrom}
                  onChange={(e) => handlePaymentPeriodFromChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Select payment period reference date"
                >
                  <option value="">Select Reference Date</option>
                  <option value="invoice">From Date of Invoice</option>
                  <option value="bill-of-lading">Date Of Bill Of Lading</option>
                  <option value="negotiation">Date of Negotiation</option>
                  <option value="acceptance">Date of Acceptance</option>
                  <option value="contract-sign">Date of Sign of the contract</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Important Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date *</label>
                  <input 
                    type="date" 
                    value={formData.invoiceDate}
                    onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Negotiation</label>
                  <input 
                    type="date" 
                    value={formData.negotiationDate}
                    onChange={(e) => handleInputChange('negotiationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latest Date of Shipment *</label>
                  <input 
                    type="date" 
                    value={formData.latestShipmentDate}
                    onChange={(e) => handleInputChange('latestShipmentDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Acceptance</label>
                  <input 
                    type="date" 
                    value={formData.acceptanceDate}
                    onChange={(e) => handleInputChange('acceptanceDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Bill of Lading (B/L)</label>
                  <input 
                    type="date" 
                    value={formData.blDate}
                    onChange={(e) => handleInputChange('blDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date of LC</label>
                  <input 
                    type="date" 
                    value={formData.lcExpiryDate}
                    onChange={(e) => handleInputChange('lcExpiryDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Place (LC)</label>
                <input 
                  type="text" 
                  value={formData.lcExpiryPlace}
                  onChange={(e) => handleInputChange('lcExpiryPlace', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="Enter expiry place"
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Documents & Bank Details</h2>
              <p className="text-gray-500">Specify required documents and banking information.</p>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Documents of Presentation</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.invoice}
                    onChange={(e) => handleDocumentChange('invoice', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Commercial Invoice</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.packingList}
                    onChange={(e) => handleDocumentChange('packingList', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Packing List</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.bl}
                    onChange={(e) => handleDocumentChange('bl', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Bill of Lading</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.coo}
                    onChange={(e) => handleDocumentChange('coo', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Certificate of Origin</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.insurance}
                    onChange={(e) => handleDocumentChange('insurance', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Insurance Certificate</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.phytosanitary}
                    onChange={(e) => handleDocumentChange('phytosanitary', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Phytosanitary Certificate</span>
                </label>
              </div>
              <div className="mt-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.other}
                    onChange={(e) => handleDocumentChange('other', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Other (specify):</span>
                </label>
                <input 
                  type="text" 
                  value={formData.otherDocuments}
                  onChange={(e) => handleInputChange('otherDocuments', e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="Specify other documents"
                />
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Advising Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank Name</label>
                  <input 
                    type="text" 
                    value={formData.advisingBank}
                    onChange={(e) => handleInputChange('advisingBank', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank City</label>
                  <input 
                    type="text" 
                    value={formData.advisingCity}
                    onChange={(e) => handleInputChange('advisingCity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank PIN / Zip</label>
                  <input 
                    type="text" 
                    value={formData.advisingPin}
                    onChange={(e) => handleInputChange('advisingPin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank Country</label>
                  <select 
                    value={formData.advisingCountry}
                    onChange={(e) => handleInputChange('advisingCountry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Select advising bank country"
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Terms & Conditions</h2>
              <p className="text-gray-500">Review and accept all contract terms and conditions.</p>
            </div>
            
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'general', label: 'General Terms' },
                  { id: 'shipping', label: 'Shipping Terms' },
                  { id: 'payment', label: 'Payment Terms' },
                  { id: 'delivery', label: 'Delivery Terms' },
                  { id: 'dispute', label: 'Dispute Resolution' },
                  { id: 'others', label: 'Other Terms' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 text-sm ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="mt-6">
              {activeTab === 'general' && (
                <div>
                  <div className="min-h-[200px] p-4 border border-gray-300 rounded-md">
                    <textarea 
                      value={formData.generalTerms}
                      onChange={(e) => handleInputChange('generalTerms', e.target.value)}
                      className="w-full h-48 resize-none border-none outline-none"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.termsAccepted.general}
                        onChange={(e) => handleTermsAcceptance('general', e.target.checked)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">I accept these terms</span>
                    </label>
                  </div>
                </div>
              )}
              
              {activeTab === 'shipping' && (
                <div>
                  <div className="min-h-[200px] p-4 border border-gray-300 rounded-md">
                    <textarea 
                      value={formData.shippingTermsText}
                      onChange={(e) => handleInputChange('shippingTermsText', e.target.value)}
                      className="w-full h-48 resize-none border-none outline-none"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.termsAccepted.shipping}
                        onChange={(e) => handleTermsAcceptance('shipping', e.target.checked)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">I accept these terms</span>
                    </label>
                  </div>
                </div>
              )}
              
              {activeTab === 'payment' && (
                <div>
                  <div className="min-h-[200px] p-4 border border-gray-300 rounded-md">
                    <textarea 
                      value={formData.paymentTermsText}
                      onChange={(e) => handleInputChange('paymentTermsText', e.target.value)}
                      className="w-full h-48 resize-none border-none outline-none"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.termsAccepted.payment}
                        onChange={(e) => handleTermsAcceptance('payment', e.target.checked)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">I accept these terms</span>
                    </label>
                  </div>
                </div>
              )}
              
              {activeTab === 'delivery' && (
                <div>
                  <div className="min-h-[200px] p-4 border border-gray-300 rounded-md">
                    <textarea 
                      value={formData.deliveryTerms}
                      onChange={(e) => handleInputChange('deliveryTerms', e.target.value)}
                      className="w-full h-48 resize-none border-none outline-none"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.termsAccepted.delivery}
                        onChange={(e) => handleTermsAcceptance('delivery', e.target.checked)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">I accept these terms</span>
                    </label>
                  </div>
                </div>
              )}
              
              {activeTab === 'dispute' && (
                <div>
                  <div className="min-h-[200px] p-4 border border-gray-300 rounded-md">
                    <textarea 
                      value={formData.disputeTerms}
                      onChange={(e) => handleInputChange('disputeTerms', e.target.value)}
                      className="w-full h-48 resize-none border-none outline-none"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.termsAccepted.dispute}
                        onChange={(e) => handleTermsAcceptance('dispute', e.target.checked)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">I accept these terms</span>
                    </label>
                  </div>
                </div>
              )}
              
              {activeTab === 'others' && (
                <div>
                  <div className="min-h-[200px] p-4 border border-gray-300 rounded-md">
                    <textarea 
                      value={formData.otherTerms}
                      onChange={(e) => handleInputChange('otherTerms', e.target.value)}
                      className="w-full h-48 resize-none border-none outline-none"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={formData.termsAccepted.others}
                        onChange={(e) => handleTermsAcceptance('others', e.target.checked)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">I accept these terms</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={onGoBack} 
            className="px-4 py-2.5 mr-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Import Smart Contract</h1>
            <div className="text-sm text-gray-500 mt-1">Contract ID: IMP-2025-0001</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleGeneratePdf}
            className="px-4 py-2 bg-red-600 text-white border border-red-600 rounded-md hover:bg-white hover:text-red-600 transition-colors"
            title="Save contract draft as PDF"
          >
            💾 Save Draft
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white border border-red-600 rounded-md hover:bg-white hover:text-red-600 transition-colors"
            title="Preview contract"
          >
            👁️ Preview
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white border border-red-600 rounded-md hover:bg-white hover:text-red-600 transition-colors"
            title="Send contract to buyer"
          >
            📧 Send to Buyer
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <Stepper currentStep={currentStep} totalSteps={5} />
        
        {/* Render the current step's content */}
        {renderStepContent()}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full text-white transition-colors ml-auto bg-red-600 hover:bg-red-700"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={!Object.values(formData.termsAccepted).every(accepted => accepted)}
              className="px-6 py-2.5 rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Import Contract
            </button>
          )}
        </div>
      </div>

      {/* Payment Period Modal */}
      {showPaymentPeriodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Payment Period From - Others</h3>
              <button 
                onClick={() => setShowPaymentPeriodModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specify Payment Period Reference</label>
                <textarea 
                  value={customPaymentPeriod}
                  onChange={(e) => setCustomPaymentPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-24" 
                  placeholder="Enter custom payment period reference date..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowPaymentPeriodModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveCustomPaymentPeriod}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}