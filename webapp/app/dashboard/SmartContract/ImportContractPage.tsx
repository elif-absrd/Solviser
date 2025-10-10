'use client';

import React, { useState, useEffect } from 'react';
import Stepper from './Stepper';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useContractDropdowns, useContractTemplate } from '../../../hooks/useContractDropdowns';
import api from '../../../lib/api';

interface ImportContractPageProps {
  onGoBack: () => void;
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
  supplierGstNumber: string;
  
  // Items with enhanced fields
  items: Item[];
  totalAmount: number;
  amountInWords: string;
  
  // Shipping & Payment
  shippingTerms: string;
  paymentTerms: string;
  paymentPeriod: string;
  paymentPeriodFrom: string;
  
  // Enhanced date fields from HTML
  invoiceDate: string;
  negotiationDate: string;
  latestShipmentDate: string;
  acceptanceDate: string;
  blDate: string;
  lcExpiryDate: string;
  lcExpiryPlace: string;
  presentationDeadline: string;
  
  // Enhanced document checkboxes from HTML
  documents: {
    commercialInvoice: boolean;
    packingList: boolean;
    billOfLanding: boolean;
    certificateOfOrigin: boolean;
    insuranceCertificate: boolean;
    phytosanitaryCertificate: boolean;
    other: boolean;
  };
  otherDocuments: string;
  
  // Enhanced bank details from HTML
  advisingBankName: string;
  advisingBankCity: string;
  advisingBankPin: string;
  advisingBankCountry: string;
  
  // Terms & Conditions
  generalTerms: string;
  shippingTermsText: string;
  paymentTermsText: string;
  deliveryTerms: string;
  disputeTerms: string;
  otherTerms: string;
  
  // Document upload settings
  documentsUploaded: boolean;
  skipDocuments: boolean;
  uploadedFiles: File[];
  
  // Acceptance
  termsAccepted: {
    allTerms: boolean;
  };
}

interface Item {
  id: number;
  itemName: string;
  origin: string;
  length: string;
  grade: string;
  qty: string;
  rate: string;
  amount: number;
}

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
    supplierGstNumber: '',
    
    items: [{
      id: Date.now(),
      itemName: '',
      origin: '',
      length: '',
      grade: '',
      qty: '',
      rate: '',
      amount: 0
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
      commercialInvoice: false,
      packingList: false,
      billOfLanding: false,
      certificateOfOrigin: false,
      insuranceCertificate: false,
      phytosanitaryCertificate: false,
      other: false
    },
    otherDocuments: '',
    
    advisingBankName: '',
    advisingBankCity: '',
    advisingBankPin: '',
    advisingBankCountry: '',
    
    documentsUploaded: false,
    skipDocuments: false,
    uploadedFiles: [],
    
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
      length: '',
      grade: '',
      qty: '',
      rate: '',
      amount: 0
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
          doc.addImage('/blacklogo.png', 'PNG', 15, 15, 40, 10);
        } catch (e) {
          console.error("Could not add logo. Make sure it's in your /public folder.", e);
          doc.setFontSize(20);
          doc.text("Solviser", 15, 25);
        }

    doc.setFontSize(18);
    doc.text("IMPORT SMART CONTRACT", pageWidth - 15, 25, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, 32, { align: 'right' });
    doc.text(`Reference #: ${Date.now()}`, pageWidth - 15, 37, { align: 'right' });
    
    doc.line(15, 45, pageWidth - 15, 45);

    yPosition += 15;
    // doc.setFontSize(10);
    // doc.setFont('helvetica', 'normal');
    // doc.text(`Contract ID: ${formData.contractId || 'IMP-2025-0001'}`, pageWidth / 2, yPosition, { align: 'right' });
    // doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition + 5, { align: 'right' });
    
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

      const itemHeaders = [['Item Name', 'Origin', 'Length', 'Grade', 'Qty (CBM)', 'Rate (USD)', 'Amount (USD)']];
      const itemBody = formData.items.map(item => [
        item.itemName || 'Not specified',
        item.origin || 'Not specified',
        item.length || 'Not specified',
        item.grade || 'Not specified',
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
    if (formData.advisingBankName) {
      yPosition = checkPageBreak(yPosition, 40);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Advising Bank Details", margin, yPosition);
      yPosition += 10;

      const bankData = [
        ['Bank Name', formData.advisingBankName || 'Not specified'],
        ['City', formData.advisingBankCity || 'Not specified'],
        ['PIN/Zip', formData.advisingBankPin || 'Not specified'],
        ['Country', formData.advisingBankCountry || 'Not specified']
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

  const handleSubmit = async () => {
    // Validate that all required terms are accepted
    const allTermsAccepted = Object.values(formData.termsAccepted).every(accepted => accepted);
    
    if (!allTermsAccepted) {
      alert('Please accept all terms and conditions before submitting.');
      return;
    }
    
    try {
      // Submit import contract to API
      const response = await api.post('/contracts', {
        contractTitle: `Import Contract - ${formData.contractId}`,
        contractType: 'import',
        buyerName: formData.supplierName,
        registeredAddress: formData.firmName,
        buyerContactPerson: formData.supplierName,
        buyerEmail: formData.supplierEmail,
        buyerPhone: formData.supplierPhone,
        contractValue: formData.totalAmount,
        currency: 'USD', // Assuming USD for import contracts
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
        termsAndClauses: `${formData.generalTerms}\n\nShipping Terms:\n${formData.shippingTermsText}\n\nPayment Terms:\n${formData.paymentTermsText}\n\nDelivery Terms:\n${formData.deliveryTerms}\n\nDispute Terms:\n${formData.disputeTerms}\n\nOther Terms:\n${formData.otherTerms}`,
        industry: 'Import/Export',
        priority: 'medium',
        documentPath: null, // Will be updated when PDF is uploaded
        notes: `Import Contract - Generated from template on ${new Date().toLocaleDateString()}`,
        
        // Import-specific fields
        isImportContract: true,
        documentsSkipped: formData.skipDocuments,
        presentationDeadline: formData.skipDocuments ? formData.presentationDeadline : null,
        
        // Document flags
        hasCommercialInvoice: formData.documents.commercialInvoice,
        hasPackingList: formData.documents.packingList,
        hasBillOfLanding: formData.documents.billOfLanding,
        hasCertificateOfOrigin: formData.documents.certificateOfOrigin,
        hasInsuranceCertificate: formData.documents.insuranceCertificate,
        hasPhytosanitaryCertificate: formData.documents.phytosanitaryCertificate
      });
      
      console.log('Import contract created:', response.data);
      alert('Import contract created successfully!');
      onGoBack();
    } catch (error: any) {
      console.error('Failed to create import contract:', error);
      alert('Failed to create import contract: ' + (error.response?.data?.error || error.message));
    }
  };

  const handlePreview = async () => {
    try {
      // Create a preview of the contract data
      const previewData = {
        contractTitle: `Import Contract - ${formData.contractId}`,
        contractType: 'import',
        buyerName: formData.supplierName,
        registeredAddress: formData.firmName,
        buyerContactPerson: formData.supplierName,
        buyerEmail: formData.supplierEmail,
        buyerPhone: formData.supplierPhone,
        contractValue: formData.totalAmount,
        currency: 'USD',
        termsAndClauses: `${formData.generalTerms}\n\nShipping Terms:\n${formData.shippingTermsText}\n\nPayment Terms:\n${formData.paymentTermsText}\n\nDelivery Terms:\n${formData.deliveryTerms}\n\nDispute Terms:\n${formData.disputeTerms}\n\nOther Terms:\n${formData.otherTerms}`,
        industry: 'Import/Export',
        documentsSkipped: formData.skipDocuments,
        presentationDeadline: formData.skipDocuments ? formData.presentationDeadline : null
      };
      
      // Open preview in a new window
      const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head>
              <title>Contract Preview - ${formData.contractId}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                .label { font-weight: bold; color: #333; }
                .value { margin-left: 10px; }
                .terms { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; }
                .document-status { color: ${formData.skipDocuments ? '#d32f2f' : '#2e7d32'}; }
                .print-btn { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
                .close-btn { padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Import Contract Preview</h1>
                <p><strong>Contract ID:</strong> ${formData.contractId}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div class="section">
                <h2>Parties Information</h2>
                <p><span class="label">Supplier/Buyer:</span><span class="value">${formData.supplierName}</span></p>
                <p><span class="label">Firm Name:</span><span class="value">${formData.firmName}</span></p>
                <p><span class="label">Email:</span><span class="value">${formData.supplierEmail}</span></p>
                <p><span class="label">Phone:</span><span class="value">${formData.supplierPhone}</span></p>
              </div>
              
              <div class="section">
                <h2>Contract Details</h2>
                <p><span class="label">Contract Value:</span><span class="value">$${formData.totalAmount}</span></p>
                <p><span class="label">Currency:</span><span class="value">USD</span></p>
                <p><span class="label">Industry:</span><span class="value">Import/Export</span></p>
              </div>
              
              <div class="section">
                <h2>Document Status</h2>
                <p class="document-status">
                  <span class="label">Status:</span>
                  <span class="value">
                    ${formData.skipDocuments ? 
                      `Documents skipped - Must be uploaded by ${formData.presentationDeadline}` : 
                      'Documents will be uploaded with this contract'
                    }
                  </span>
                </p>
                ${formData.skipDocuments ? '' : `
                  <div style="margin-top: 10px;">
                    <p><span class="label">Required Documents:</span></p>
                    <ul>
                      ${formData.documents.commercialInvoice ? '<li>Commercial Invoice</li>' : ''}
                      ${formData.documents.packingList ? '<li>Packing List</li>' : ''}
                      ${formData.documents.billOfLanding ? '<li>Bill of Landing</li>' : ''}
                      ${formData.documents.certificateOfOrigin ? '<li>Certificate of Origin</li>' : ''}
                      ${formData.documents.insuranceCertificate ? '<li>Insurance Certificate</li>' : ''}
                      ${formData.documents.phytosanitaryCertificate ? '<li>Phytosanitary Certificate</li>' : ''}
                    </ul>
                  </div>
                `}
              </div>
              
              <div class="section">
                <h2>Terms and Conditions</h2>
                <div class="terms">
                  <h3>General Terms</h3>
                  <p>${formData.generalTerms || 'No general terms specified'}</p>
                  
                  <h3>Shipping Terms</h3>
                  <p>${formData.shippingTermsText || 'No shipping terms specified'}</p>
                  
                  <h3>Payment Terms</h3>
                  <p>${formData.paymentTermsText || 'No payment terms specified'}</p>
                  
                  <h3>Delivery Terms</h3>
                  <p>${formData.deliveryTerms || 'No delivery terms specified'}</p>
                  
                  <h3>Dispute Resolution</h3>
                  <p>${formData.disputeTerms || 'No dispute terms specified'}</p>
                  
                  <h3>Other Terms</h3>
                  <p>${formData.otherTerms || 'No other terms specified'}</p>
                </div>
              </div>
              
              <div style="margin-top: 40px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
                <button onclick="window.print()" class="print-btn">Print Contract</button>
                <button onclick="window.close()" class="close-btn">Close Preview</button>
              </div>
            </body>
          </html>
        `);
        previewWindow.document.close();
      }
    } catch (error: any) {
      console.error('Error generating preview:', error);
      alert('Failed to generate contract preview. Please try again.');
    }
  };

  const handleSendToBuyer = async () => {
    // Validate that all required terms are accepted
    const allTermsAccepted = Object.values(formData.termsAccepted).every(accepted => accepted);
    
    if (!allTermsAccepted) {
      alert('Please accept all terms and conditions before sending to buyer.');
      return;
    }

    if (!formData.supplierEmail) {
      alert('Buyer email is required to send the contract.');
      return;
    }

    try {
      // First create the contract
      const contractResponse = await api.post('/contracts', {
        contractTitle: `Import Contract - ${formData.contractId}`,
        contractType: 'import',
        buyerName: formData.supplierName,
        registeredAddress: formData.firmName,
        buyerContactPerson: formData.supplierName,
        buyerEmail: formData.supplierEmail,
        buyerPhone: formData.supplierPhone,
        contractValue: formData.totalAmount,
        currency: 'USD',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        termsAndClauses: `${formData.generalTerms}\n\nShipping Terms:\n${formData.shippingTermsText}\n\nPayment Terms:\n${formData.paymentTermsText}\n\nDelivery Terms:\n${formData.deliveryTerms}\n\nDispute Terms:\n${formData.disputeTerms}\n\nOther Terms:\n${formData.otherTerms}`,
        industry: 'Import/Export',
        priority: 'medium',
        documentPath: null,
        notes: `Import Contract - Generated and sent to buyer on ${new Date().toLocaleDateString()}`,
        status: 'ACTIVE', // Set as active when sending to buyer
        
        // Import-specific fields
        isImportContract: true,
        documentsSkipped: formData.skipDocuments,
        presentationDeadline: formData.skipDocuments ? formData.presentationDeadline : null,
        hasCommercialInvoice: formData.documents.commercialInvoice,
        hasPackingList: formData.documents.packingList,
        hasBillOfLanding: formData.documents.billOfLanding,
        hasCertificateOfOrigin: formData.documents.certificateOfOrigin,
        hasInsuranceCertificate: formData.documents.insuranceCertificate,
        hasPhytosanitaryCertificate: formData.documents.phytosanitaryCertificate
      });
      
      if (contractResponse.data.success) {
        const contractId = contractResponse.data.contract.id;
        
        // Send notification to buyer
        try {
          const notifyResponse = await api.post('/contracts/notify-buyer', {
            contractId: contractId,
            gstNumber: formData.supplierGstNumber || 'N/A', // Use GST if available
            message: `A new import contract (${formData.contractId}) has been created and is ready for your review. Please check your email and log in to the portal to view the contract details and proceed with the necessary actions.`,
            notificationType: 'contract_created'
          });
          
          if (notifyResponse.data.success) {
            alert('Contract created and sent to buyer successfully! The buyer will receive a notification email.');
          } else {
            alert('Contract created but failed to send notification to buyer. You can notify them manually.');
          }
        } catch (notifyError) {
          console.error('Failed to notify buyer:', notifyError);
          alert('Contract created successfully, but failed to send notification to buyer. You can notify them manually.');
        }
        
        // Redirect to previous contracts page
        onGoBack();
      }
    } catch (error: any) {
      console.error('Failed to send contract to buyer:', error);
      alert('Failed to send contract to buyer: ' + (error.response?.data?.error || error.message));
    }
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Number (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.supplierGstNumber}
                    onChange={(e) => handleInputChange('supplierGstNumber', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Enter the supplier's GST number if available"
                    placeholder="Enter GST number (optional)"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Length *</label>
                      <input
                        type="text"
                        value={item.length}
                        onChange={(e) => updateItem(item.id, 'length', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Enter length"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
                      <input
                        type="text"
                        value={item.grade}
                        onChange={(e) => updateItem(item.id, 'grade', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Enter grade"
                      />
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
                    title='Select the invoice date'
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
                    title='Select the negotiation date'
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latest Date of Shipment *</label>
                  <input 
                    type="date" 
                    value={formData.latestShipmentDate}
                    onChange={(e) => handleInputChange('latestShipmentDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title='Select the latest shipment date'
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
                    title='Select the acceptance date'
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Bill of Lading (B/L)</label>
                  <input 
                    type="date" 
                    value={formData.blDate}
                    onChange={(e) => handleInputChange('blDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title='Select the Bill of Lading date'
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date of LC</label>
                  <input 
                    type="date" 
                    value={formData.lcExpiryDate}
                    onChange={(e) => handleInputChange('lcExpiryDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title='Select the LC expiry date'
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
                    checked={formData.documents.commercialInvoice}
                    onChange={(e) => handleDocumentChange('commercialInvoice', e.target.checked)}
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
                    checked={formData.documents.billOfLanding}
                    onChange={(e) => handleDocumentChange('billOfLanding', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Bill of Lading</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.certificateOfOrigin}
                    onChange={(e) => handleDocumentChange('certificateOfOrigin', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Certificate of Origin</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.insuranceCertificate}
                    onChange={(e) => handleDocumentChange('insuranceCertificate', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Insurance Certificate</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.documents.phytosanitaryCertificate}
                    onChange={(e) => handleDocumentChange('phytosanitaryCertificate', e.target.checked)}
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
                  title="Enter any additional documents required for the contract"
                  aria-label="Specify other documents required for the contract"
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
                    value={formData.advisingBankName}
                    onChange={(e) => handleInputChange('advisingBankName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Enter the name of the advising bank"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank City</label>
                  <input 
                    type="text" 
                    value={formData.advisingBankCity}
                    onChange={(e) => handleInputChange('advisingBankCity', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title='Enter the city where the advising bank is located'
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank PIN / Zip</label>
                  <input 
                    type="text" 
                    value={formData.advisingBankPin}
                    onChange={(e) => handleInputChange('advisingBankPin', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    title='Enter the PIN or Zip code of the advising bank'
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advising Bank Country</label>
                  <select 
                    value={formData.advisingBankCountry}
                    onChange={(e) => handleInputChange('advisingBankCountry', e.target.value)}
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
              <p className="text-gray-500">Review and customize the contract terms and conditions.</p>
            </div>

            <div className="space-y-6">
              {/* General Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Terms
                </label>
                <textarea
                  value={formData.generalTerms}
                  onChange={(e) => handleInputChange('generalTerms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Enter general terms and conditions"
                />
              </div>

              {/* Shipping Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Terms
                </label>
                <textarea
                  value={formData.shippingTermsText}
                  onChange={(e) => handleInputChange('shippingTermsText', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Enter shipping terms and conditions"
                />
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <textarea
                  value={formData.paymentTermsText}
                  onChange={(e) => handleInputChange('paymentTermsText', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Enter payment terms and conditions"
                />
              </div>

              {/* Delivery Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Terms
                </label>
                <textarea
                  value={formData.deliveryTerms}
                  onChange={(e) => handleInputChange('deliveryTerms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Enter delivery terms and conditions"
                />
              </div>

              {/* Dispute Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispute Resolution Terms
                </label>
                <textarea
                  value={formData.disputeTerms}
                  onChange={(e) => handleInputChange('disputeTerms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Enter dispute resolution terms"
                />
              </div>

              {/* Other Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Terms
                </label>
                <textarea
                  value={formData.otherTerms}
                  onChange={(e) => handleInputChange('otherTerms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Enter any additional terms and conditions"
                />
              </div>

              {/* Terms Acceptance */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agreement</h3>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptAllTerms"
                    checked={formData.termsAccepted.allTerms}
                    onChange={(e) => handleTermsAcceptance('allTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptAllTerms" className="text-sm text-gray-700">
                    I acknowledge that I have read, understood, and agree to all the terms and conditions stated above. 
                    I confirm that all information provided is accurate and complete.
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Document Upload</h2>
              <p className="text-gray-500">Upload contract documents or skip this step to finalize later.</p>
            </div>

            <div className="space-y-6">
              {/* Skip Documents Option */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="skipDocuments"
                    checked={formData.skipDocuments}
                    onChange={(e) => handleInputChange('skipDocuments', e.target.checked)}
                    className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="skipDocuments" className="text-sm font-medium text-yellow-800">
                      Skip document upload for now
                    </label>
                    <p className="text-xs text-yellow-700 mt-1">
                      You can upload documents later. The system will remind you daily until the presentation deadline.
                    </p>
                  </div>
                </div>
                
                {formData.skipDocuments && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <label className="block text-sm font-medium text-yellow-800 mb-2">
                      Presentation Deadline *
                    </label>
                    <input
                      type="date"
                      value={formData.presentationDeadline}
                      onChange={(e) => handleInputChange('presentationDeadline', e.target.value)}
                      className="w-full max-w-xs p-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required={formData.skipDocuments}
                      title="Select when documents must be presented"
                    />
                    <p className="text-xs text-yellow-600 mt-1">
                      Daily reminders will be sent until this date
                    </p>
                  </div>
                )}
              </div>

              {/* Document Upload Section */}
              {!formData.skipDocuments && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h3>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg text-gray-600">
                          Drop files here or <span className="text-red-500 underline cursor-pointer">browse</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          PDF, DOC, DOCX files up to 10MB each
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setFormData(prev => ({
                            ...prev,
                            uploadedFiles: [...prev.uploadedFiles, ...files]
                          }));
                        }}
                        className="hidden"
                        id="fileUpload"
                      />
                      <label
                        htmlFor="fileUpload"
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition-colors"
                      >
                        Choose Files
                      </label>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {formData.uploadedFiles.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3">Uploaded Files</h4>
                      <div className="space-y-2">
                        {formData.uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Remove file"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Document Requirements Reminder */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Required Documents (Selected)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-blue-700">
                      {Object.entries(formData.documents)
                        .filter(([key, value]) => value && key !== 'other')
                        .map(([key, _]) => (
                          <div key={key} className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          </div>
                        ))}
                      {formData.documents.other && formData.otherDocuments && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{formData.otherDocuments}</span>
                        </div>
                      )}
                    </div>
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
            onClick={handlePreview}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            title="Preview contract before finalizing"
          >
            <span>👁️</span>
            <span>Preview</span>
          </button>
          <button
            onClick={handleSendToBuyer}
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
          totalSteps={6}
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
        
        {currentStep < 5 ? (
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