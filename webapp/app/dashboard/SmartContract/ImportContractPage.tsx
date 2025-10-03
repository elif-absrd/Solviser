'use client';

import React, { useState, useEffect } from 'react';
import Stepper from './Stepper';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useContractDropdowns, useContractTemplate } from '../../../hooks/useContractDropdowns';

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
  contractId: string;
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
    allTerms: boolean; // Changed to single checkbox
  };
}

const itemOptions = ["Pine Wood", "Hardwood", "Teak Wood"];
const pineOrigins = ["Uruguay", "New Zealand", "Australia", "Southern Yellow Pine (SYP)"];
const sypSub = ["Lumbers", "Logs Unedged"];

export default function ImportContractPage({ onGoBack }: ImportContractPageProps) {
  const { dropdowns, loading: dropdownsLoading } = useContractDropdowns();
  const { template, loading: templateLoading } = useContractTemplate('import');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showPaymentPeriodModal, setShowPaymentPeriodModal] = useState(false);
  const [customPaymentPeriod, setCustomPaymentPeriod] = useState('');
  
  const [formData, setFormData] = useState<ImportFormData>({
    contractId: 'IMP-2025-0001',
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
    
    // Single acceptance for all terms
    termsAccepted: {
      allTerms: false
    }
  });

  // Load template data when available
  useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        generalTerms: template.generalTerms || '',
        shippingTermsText: template.shippingTerms || '',
        paymentTermsText: template.paymentTerms || '',
        deliveryTerms: template.deliveryTerms || '',
        disputeTerms: template.disputeTerms || '',
        otherTerms: template.otherTerms || ''
      }));
    }
  }, [template]);

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

  // Add updateItem as alias for handleItemChange for consistency with render code
  const updateItem = handleItemChange;

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
    const margin = 15;
    const usableWidth = pageWidth - (margin * 2);

    // Helper function to check if we need a new page
    const checkPageBreak = (yPos: number, requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - 20) {
        doc.addPage();
        return 30; // Reset Y position for new page
      }
      return yPos;
    };

    // Header with logo and title
    let yPosition = 20;
    try {
      doc.addImage('/blacklogo.png', 'PNG', margin, yPosition, 40, 10);
    } catch (e) {
      console.warn("Logo not found, using text header");
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('SOLVISER', margin, yPosition + 6);
    }

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORT SMART CONTRACT', pageWidth / 2, yPosition + 5, { align: 'center' });
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Contract ID: ${formData.contractId || 'IMP-2025-0001'}`, pageWidth / 2, yPosition, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition + 5, { align: 'center' });
    
    yPosition += 20;

    // Contract Information Section
    yPosition = checkPageBreak(yPosition, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Contract Information", margin, yPosition);
    yPosition += 10;

    const contractInfo = [
      ['Contract Type', formData.contractType || 'Import'],
      ['GSTIN', formData.gstin || 'Not provided'],
      ['Firm Name', formData.firmName || 'Not provided'],
      ['GST State', formData.gstState || 'Not provided'],
      ['Supplier Name', formData.supplierName || 'Not provided'],
      ['Supplier Email', formData.supplierEmail || 'Not provided'],
      ['Supplier Phone', formData.supplierPhone || 'Not provided']
    ];

    autoTable(doc, {
      startY: yPosition,
      body: contractInfo,
      theme: 'grid',
      tableWidth: usableWidth,
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: usableWidth * 0.3 },
        1: { cellWidth: usableWidth * 0.7 }
      },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Items Section
    if (formData.items.length > 0) {
      yPosition = checkPageBreak(yPosition, 80);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Item Details", margin, yPosition);
      yPosition += 10;

      const itemHeaders = [['Item Name', 'Origin', 'Sub-Category', 'Qty', 'Rate (USD)', 'Amount (USD)']];
      const itemBody = formData.items.map(item => [
        item.itemName || 'Not specified',
        item.origin || 'Not specified',
        item.subCategory || 'Not specified',
        item.qty || '0',
        parseFloat(item.rate || '0').toFixed(2),
        item.amount.toFixed(2)
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: itemHeaders,
        body: itemBody,
        theme: 'grid',
        headStyles: {
          fillColor: [240, 81, 52],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          3: { halign: 'right' },
          4: { halign: 'right' },
          5: { halign: 'right' }
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 3 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;

      // Total Amount
      yPosition = checkPageBreak(yPosition, 30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Amount: $${formData.totalAmount.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Amount in Words: ${formData.amountInWords}`, margin, yPosition);
      yPosition += 15;
    }

    // Shipping & Payment Terms
    yPosition = checkPageBreak(yPosition, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Shipping & Payment Terms", margin, yPosition);
    yPosition += 10;

    const termsData = [
      ['Shipping Terms', formData.shippingTerms || 'Not specified'],
      ['Payment Terms', formData.paymentTerms || 'Not specified'],
      ['Payment Period', formData.paymentPeriod || 'Not specified'],
      ['Payment Period From', formData.paymentPeriodFrom || 'Not specified'],
      ['Latest Shipment Date', formData.latestShipmentDate || 'Not specified'],
      ['LC Expiry Date', formData.lcExpiryDate || 'Not specified'],
      ['LC Expiry Place', formData.lcExpiryPlace || 'Not specified']
    ];

    autoTable(doc, {
      startY: yPosition,
      body: termsData,
      theme: 'grid',
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: usableWidth * 0.35 },
        1: { cellWidth: usableWidth * 0.65 }
      },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Bank Details
    if (formData.advisingBank) {
      yPosition = checkPageBreak(yPosition, 40);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Advising Bank Details", margin, yPosition);
      yPosition += 10;

      const bankData = [
        ['Bank Name', formData.advisingBank || 'Not specified'],
        ['City', formData.advisingCity || 'Not specified'],
        ['PIN/Zip', formData.advisingPin || 'Not specified'],
        ['Country', formData.advisingCountry || 'Not specified']
      ];

      autoTable(doc, {
        startY: yPosition,
        body: bankData,
        theme: 'grid',
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: usableWidth * 0.3 },
          1: { cellWidth: usableWidth * 0.7 }
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 3 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Documents Required
    yPosition = checkPageBreak(yPosition, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Documents Required", margin, yPosition);
    yPosition += 10;

    const selectedDocs = Object.entries(formData.documents)
      .filter(([key, value]) => value)
      .map(([key]) => {
        const docNames: {[key: string]: string} = {
          invoice: 'Commercial Invoice',
          packingList: 'Packing List',
          bl: 'Bill of Lading',
          coo: 'Certificate of Origin',
          insurance: 'Insurance Certificate',
          phytosanitary: 'Phytosanitary Certificate',
          other: 'Other Documents'
        };
        return docNames[key] || key;
      });

    if (selectedDocs.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      selectedDocs.forEach((docName, index) => {
        yPosition = checkPageBreak(yPosition, 8);
        doc.text(`• ${docName}`, margin + 5, yPosition);
        yPosition += 6;
      });
    } else {
      doc.setFontSize(10);
      doc.text('No specific documents specified', margin + 5, yPosition);
    }

    yPosition += 10;

    // Terms & Conditions
    yPosition = checkPageBreak(yPosition, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Terms & Conditions", margin, yPosition);
    yPosition += 10;

    const termsSection = [
      { title: 'General Terms', content: formData.generalTerms },
      { title: 'Shipping Terms', content: formData.shippingTermsText },
      { title: 'Payment Terms', content: formData.paymentTermsText },
      { title: 'Delivery Terms', content: formData.deliveryTerms },
      { title: 'Dispute Resolution', content: formData.disputeTerms },
      { title: 'Other Terms', content: formData.otherTerms }
    ];

    termsSection.forEach(section => {
      if (section.content) {
        yPosition = checkPageBreak(yPosition, 30);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, margin, yPosition);
        yPosition += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(section.content, usableWidth);
        lines.forEach((line: string) => {
          yPosition = checkPageBreak(yPosition, 6);
          doc.text(line, margin, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      }
    });

    // Signature Section
    yPosition = checkPageBreak(yPosition, 40);
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Signatures", margin, yPosition);
    yPosition += 15;

    // Signature lines
    const signatureY = yPosition;
    doc.line(margin, signatureY, margin + 60, signatureY);
    doc.line(pageWidth - margin - 60, signatureY, pageWidth - margin, signatureY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Exporter Signature", margin + 30, signatureY + 8, { align: 'center' });
    doc.text("Importer Signature", pageWidth - margin - 30, signatureY + 8, { align: 'center' });

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Solviser Smart Contract Platform', pageWidth / 2, footerY, { align: 'center' });

    // Save the PDF
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
    if (dropdownsLoading || templateLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contract data...</p>
          </div>
        </div>
      );
    }

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
                  onChange={(e) => setFormData({...formData, contractType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  title="Select the type of contract"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="Enter GST Number"
                  required
                  title="Enter your GSTIN (Goods and Services Tax Identification Number)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                <input 
                  type="text" 
                  value={formData.firmName}
                  onChange={(e) => handleInputChange('firmName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" 
                  placeholder="Auto-fetched from GST" 
                  readOnly
                  title="Firm name will be auto-fetched from GSTIN"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GST State</label>
                <input 
                  type="text" 
                  value={formData.gstState}
                  onChange={(e) => handleInputChange('gstState', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" 
                  placeholder="Auto-fetched from GST" 
                  readOnly
                  title="GST state will be auto-fetched from GSTIN"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Enter the supplier's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={formData.supplierEmail}
                    onChange={(e) => handleInputChange('supplierEmail', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Enter the supplier's email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.supplierPhone}
                    onChange={(e) => handleInputChange('supplierPhone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Enter the supplier's phone number"
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
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Item Details</h2>
              <p className="text-gray-500">Add items to your import contract with quantities and pricing.</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Items</h3>
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Add new item to the contract"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                      <select
                        value={item.itemName}
                        onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        title="Select the type of item"
                      >
                        <option value="">Select Item</option>
                        {dropdowns.item_types?.map(option => (
                          <option key={option.id} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
                      <select
                        value={item.origin}
                        onChange={(e) => updateItem(item.id, 'origin', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        title="Select country of origin"
                      >
                        <option value="">Select Origin</option>
                        {dropdowns.origins?.map(option => (
                          <option key={option.id} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category *</label>
                      <select
                        value={item.subCategory}
                        onChange={(e) => updateItem(item.id, 'subCategory', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        title="Select item sub-category"
                      >
                        <option value="">Select Category</option>
                        {dropdowns.sub_categories?.map(option => (
                          <option key={option.id} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qty (CBM) *</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        title="Enter quantity in cubic meters"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rate (USD) *</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        title="Enter rate per unit in USD"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                      <input
                        type="text"
                        value={item.amount.toFixed(2)}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                        title="Calculated amount (Qty × Rate)"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove this item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-right">
                <div className="text-lg font-semibold text-gray-800">
                  Total Amount: ${formData.totalAmount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {formData.amountInWords}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping & Payment Terms</h2>
              <p className="text-gray-500">Define shipping terms, payment methods, and important dates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Terms (Incoterms) *</label>
                <select
                  value={formData.shippingTerms}
                  onChange={(e) => setFormData({...formData, shippingTerms: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Select international commercial terms"
                >
                  <option value="">Select Incoterm</option>
                  {dropdowns.incoterms?.map(option => (
                    <option key={option.id} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms *</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Select payment method"
                >
                  <option value="">Select Payment Terms</option>
                  {dropdowns.payment_terms?.map(option => (
                    <option key={option.id} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period</label>
                <select
                  value={formData.paymentPeriod}
                  onChange={(e) => setFormData({...formData, paymentPeriod: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Select payment period"
                >
                  <option value="">Select Period</option>
                  {dropdowns.payment_periods?.map(option => (
                    <option key={option.id} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Period From</label>
                <select 
                  value={formData.paymentPeriodFrom}
                  onChange={(e) => handlePaymentPeriodFromChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Negotiation</label>
                  <input 
                    type="date" 
                    value={formData.negotiationDate}
                    onChange={(e) => handleInputChange('negotiationDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latest Date of Shipment *</label>
                  <input 
                    type="date" 
                    value={formData.latestShipmentDate}
                    onChange={(e) => handleInputChange('latestShipmentDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Acceptance</label>
                  <input 
                    type="date" 
                    value={formData.acceptanceDate}
                    onChange={(e) => handleInputChange('acceptanceDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Bill of Lading (B/L)</label>
                  <input 
                    type="date" 
                    value={formData.blDate}
                    onChange={(e) => handleInputChange('blDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date of LC</label>
                  <input 
                    type="date" 
                    value={formData.lcExpiryDate}
                    onChange={(e) => handleInputChange('lcExpiryDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Place (LC)</label>
                <input 
                  type="text" 
                  value={formData.lcExpiryPlace}
                  onChange={(e) => handleInputChange('lcExpiryPlace', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
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
              <p className="text-gray-500">Specify required documents and bank information.</p>
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
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank City</label>
                  <input 
                    type="text" 
                    value={formData.advisingCity}
                    onChange={(e) => handleInputChange('advisingCity', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank PIN / Zip</label>
                  <input 
                    type="text" 
                    value={formData.advisingPin}
                    onChange={(e) => handleInputChange('advisingPin', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank Country</label>
                  <select 
                    value={formData.advisingCountry}
                    onChange={(e) => handleInputChange('advisingCountry', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
              <p className="text-gray-500">Review and accept the contract terms and conditions.</p>
            </div>

            <div className="space-y-6">
              {/* Display all terms in a single scrollable area */}
              <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                {[
                  {
                    title: 'General Terms',
                    content: formData.generalTerms
                  },
                  {
                    title: 'Shipping Terms',
                    content: formData.shippingTermsText
                  }, 
                  {
                    title: 'Payment Terms',
                    content: formData.paymentTermsText
                  },
                  {
                    title: 'Delivery Terms',
                    content: formData.deliveryTerms
                  },
                  {
                    title: 'Dispute Resolution',
                    content: formData.disputeTerms
                  },
                  {
                    title: 'Other Terms',
                    content: formData.otherTerms
                  }
                ].map((section, index) => (
                  section.content && (
                    <div key={index} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">{section.title}</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Single acceptance checkbox */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptAllTerms"
                    checked={formData.termsAccepted.allTerms}
                    onChange={(e) => setFormData({
                      ...formData,
                      termsAccepted: { allTerms: e.target.checked }
                    })}
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptAllTerms" className="text-sm text-gray-700">
                    <span className="font-medium">I accept all terms and conditions</span>
                    <p className="text-gray-500 mt-1">
                      By checking this box, I acknowledge that I have read, understood, and agree to be bound by all the terms and conditions outlined above, including general terms, shipping terms, payment terms, delivery terms, dispute resolution procedures, and any other specified terms.
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={onGoBack} 
            className="px-4 py-2.5 mr-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            title="Go back to Smart Contract dashboard"
          >
            ← Back
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Import Smart Contract</h1>
            <p className="text-gray-500">Contract ID: IMP-2025-0001</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleGeneratePdf}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            title="Download contract as PDF"
          >
            <span>💾</span>
            <span>Save Draft</span>
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            title="Preview contract before finalizing"
          >
            <span>👁️</span>
            <span>Preview</span>
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            title="Send contract to buyer"
          >
            <span>📤</span>
            <span>Send to Buyer</span>
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <Stepper 
          currentStep={currentStep} 
          totalSteps={5}
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!formData.termsAccepted.allTerms}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Contract
          </button>
        )}
      </div>
    </div>
  );
}