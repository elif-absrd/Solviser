'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChevronDown, Printer } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Define a type for our input state
type CalculatorInputs = {
  logType: string;
  purchasePrice: string;
  exchangeRate: string;
  conversionFactor: string;
  wastage: string;
  operationalCost: string;
  profitMargin: string;
};

// Define a type for the calculated results
type CalculationResults = {
  inrPerCbm: number;
  inrPerCftRaw: number;
  effectiveRawCost: number;
  totalCost: number;
  finalPrice: number;
};

const SalesCalculatorPage = () => {
  // State for all the input fields
  const [inputs, setInputs] = useState<CalculatorInputs>({
    logType: 'new-zealand',
    purchasePrice: '200',
    exchangeRate: '88',
    conversionFactor: '27.74',
    wastage: '20',
    operationalCost: '105',
    profitMargin: '10',
  });

  // State to hold the calculated results
  const [results, setResults] = useState<CalculationResults>({
    inrPerCbm: 0,
    inrPerCftRaw: 0,
    effectiveRawCost: 0,
    totalCost: 0,
    finalPrice: 0,
  });
  
  // State for PDF options
  const [includeLogo, setIncludeLogo] = useState(true);

  // useEffect hook to run calculations whenever an input changes
  useEffect(() => {
    const purchasePrice = parseFloat(inputs.purchasePrice) || 0;
    const exchangeRate = parseFloat(inputs.exchangeRate) || 0;
    const conversionFactor = parseFloat(inputs.conversionFactor) || 1;
    const wastage = parseFloat(inputs.wastage) || 0;
    const operationalCost = parseFloat(inputs.operationalCost) || 0;
    const profitMargin = parseFloat(inputs.profitMargin) || 0;

    const inrPerCbm = purchasePrice * exchangeRate;
    const inrPerCftRaw = inrPerCbm / conversionFactor;
    const effectiveRawCost = wastage < 100 ? inrPerCftRaw / (1 - wastage / 100) : 0;
    const totalCost = effectiveRawCost + operationalCost;
    const finalPrice = totalCost * (1 + profitMargin / 100);

    setResults({ inrPerCbm, inrPerCftRaw, effectiveRawCost, totalCost, finalPrice });
  }, [inputs]);

  // Handles changes to any input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  // Special handler for log type to update dependent fields
  const handleLogTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const logType = e.target.value;
    let newWastage = '20';
    let newOperationalCost = '105';

    if (logType === 'syp') {
      newWastage = '32';
      newOperationalCost = '150';
    } else if (logType === 'hard-wood') {
      newWastage = '25';
      newOperationalCost = '160';
    } else if (logType === 'teak-wood') {
      newWastage = '15';
      newOperationalCost = '175';
    }

    setInputs((prev) => ({ ...prev, logType, wastage: newWastage, operationalCost: newOperationalCost }));
  };

  // Helper to format numbers as Indian Rupee currency for the UI
  const formatAsCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add Logo (conditionally)
    if (includeLogo) {
        try {
          doc.addImage('/blacklogo.png', 'PNG', 15, 15, 40, 10);
        } catch (e) {
          console.error("Could not add logo", e);
          doc.setFontSize(20);
          doc.text("Solviser", 15, 25);
        }
    }

    // Add Header
    doc.setFontSize(18);
    doc.text("Sales Price Calculation", pageWidth - 15, 25, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, 32, { align: 'right' });
    doc.text(`Reference #: ${Date.now()}`, pageWidth - 15, 37, { align: 'right' });

    doc.line(15, 45, pageWidth - 15, 45);

    // Input Parameters Table
    const inputBody = [
      ['Log Type', inputs.logType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())],
      ['Purchase Price (USD/CBM)', inputs.purchasePrice],
      ['Exchange Rate (INR/USD)', inputs.exchangeRate],
      ['CBM to CFT Factor', inputs.conversionFactor],
      ['Wastage Cost (%)', `${inputs.wastage}%`],
      ['Operational Cost (INR/CFT)', inputs.operationalCost],
      ['Profit Margin (%)', `${inputs.profitMargin}%`],
    ];
    
    autoTable(doc, {
      startY: 55,
      head: [['Input Parameters', 'Value']],
      body: inputBody,
      theme: 'grid',
      headStyles: { fillColor: [35, 31, 32] },
      columnStyles: { 0: { fontStyle: 'bold' } },
    });

    // Calculated Results Table
    const resultsBody = [
        ['Purchase Price (INR per CBM)', `${results.inrPerCbm.toFixed(2)} INR`],
        ['Raw Cost (INR per CFT)', `${results.inrPerCftRaw.toFixed(2)} INR`],
        ['Effective Raw Cost (after wastage)', `${results.effectiveRawCost.toFixed(2)} INR`],
        ['Total Cost (after operational costs)', `${results.totalCost.toFixed(2)} INR`],
        ['Final Selling Price (INR / CFT)', `${results.finalPrice.toFixed(2)} INR`],
    ];

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Calculated Results', 'Value']],
      body: resultsBody,
      theme: 'grid',
      headStyles: { fillColor: [232, 78, 53] }, // #e84e35
      columnStyles: { 0: { fontStyle: 'bold' } },
      didParseCell: (data) => {
        // Highlight the final price row
        if (data.row.index === resultsBody.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = '#fef2f2';
            data.cell.styles.textColor = '#ef4444';
        }
      }
    });

    // Signature Section
    let finalY = (doc as any).lastAutoTable.finalY;
    let signatureY = finalY + 25;

    if (signatureY > pageHeight - 30) {
      doc.addPage();
      signatureY = 40;
    }

    doc.line(pageWidth - 70, signatureY, pageWidth - 15, signatureY); // Signature line
    doc.text("Authorized Signatory", pageWidth - 42.5, signatureY + 5, { align: 'center' });

    // PDF Footer
    doc.setFontSize(10);
    doc.text('This calculation is for estimation purposes. Please verify all figures before making business decisions.', 15, pageHeight - 10);

    // Open in new tab
    doc.output('dataurlnewwindow');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#262626] text-white font-sans">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <style jsx global>{`
          .dark-dropdown option {
            background-color: #374151;
            color: white;
          }
        `}</style>

        <header className="bg-white/5 p-4 rounded-xl shadow-lg mb-8 mt-14">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Sales Price Calculator</h1>
                <div className="flex items-center gap-4">
                    <label htmlFor="logo" className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" id="logo" checked={includeLogo} onChange={e => setIncludeLogo(e.target.checked)} className="accent-[#f05134]" />
                      Include Logo
                    </label>
                    <button onClick={handleGeneratePdf} className="p-2 bg-[#f05134] rounded-full hover:bg-orange-700" title="Generate PDF">
                        <Printer size={18} />
                    </button>
                </div>
            </div>
        </header>
        
        <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:gap-8">
                {/* Left Column: Input Form */}
                <div className="lg:w-2/5 lg:sticky lg:top-8 self-start">
                    <div className="bg-white/5 rounded-xl p-6 sm:p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Input Data</h2>
                        <p className="text-gray-400 mb-6">Adjust the values below to see real-time results.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Log Type" id="logType" value={inputs.logType} onChange={handleLogTypeChange} isSelect>
                                <option value="new-zealand">New Zealand</option>
                                <option value="syp">SYP</option>
                                <option value="hard-wood">Hard Wood</option>
                                <option value="teak-wood">Teak Wood</option>
                            </InputField>
                            <InputField label="CBM to CFT Factor" id="conversionFactor" value={inputs.conversionFactor} onChange={handleInputChange} isSelect>
                                <option value="27.74">27.74</option>
                                <option value="35.315">35.315</option>
                            </InputField>
                            <InputField label="Purchase Price (USD/CBM)" id="purchasePrice" value={inputs.purchasePrice} onChange={handleInputChange} type="number" />
                            <InputField label="Exchange Rate (INR/USD)" id="exchangeRate" value={inputs.exchangeRate} onChange={handleInputChange} type="number" />
                            <InputField label="Wastage Cost (%)" id="wastage" value={inputs.wastage} onChange={handleInputChange} type="number" />
                            <InputField label="Operational Cost (INR/CFT)" id="operationalCost" value={inputs.operationalCost} onChange={handleInputChange} type="number" />
                            <InputField label="Profit Margin (%)" id="profitMargin" value={inputs.profitMargin} onChange={handleInputChange} type="number" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="lg:w-3/5">
                    <div className="bg-white/5 rounded-xl p-6 sm:p-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Review Results</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-black/20 rounded-lg p-6 space-y-4">
                                <ResultRow label="Purchase Price (INR per CBM)" value={formatAsCurrency(results.inrPerCbm)} />
                                <ResultRow label="Raw Cost (INR per CFT)" value={formatAsCurrency(results.inrPerCftRaw)} />
                                <ResultRow label="Effective Raw Cost (after wastage)" value={formatAsCurrency(results.effectiveRawCost)} />
                                <ResultRow label="Total Cost (after operational costs)" value={formatAsCurrency(results.totalCost)} />
                            </div>
                            <div className="bg-[#f05134]/10 border border-[#f05134]/30 rounded-lg p-6 flex flex-col justify-center text-center">
                                <h3 className="text-lg font-semibold text-gray-300 mb-2">Final Selling Price</h3>
                                <p className="text-4xl font-bold text-[#f05134]">
                                    {formatAsCurrency(results.finalPrice)}
                                </p>
                                <p className="text-xl font-medium text-gray-400">/ CFT</p>
                            </div>
                        </div>
                         <div className="mt-6 border-t border-white/10 pt-4 text-sm text-gray-400 bg-black/20 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-300 mb-2">Reference Data Used:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Exchange Rate: ₹{inputs.exchangeRate} per USD</li>
                                <li>Conversion Factor: 1 CBM = {inputs.conversionFactor} CFT</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Reusable component for styled input fields
const InputField = ({ label, id, value, onChange, type = "text", children, isSelect = false }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2 whitespace-nowrap">{label}</label>
    <div className="relative">
      {isSelect ? (
        <select id={id} value={value} onChange={onChange} className="w-full bg-white/10 border border-transparent rounded-lg py-2.5 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#f05134] dark-dropdown">
          {children}
        </select>
      ) : (
        <input id={id} type={type} value={value} onChange={onChange} className="w-full bg-white/10 border border-transparent rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#f05134]" />
      )}
      {isSelect && <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />}
    </div>
  </div>
);

// Reusable component for styled result rows
const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/10 pb-3 last:border-b-0">
    <span className="text-gray-400 mb-1 sm:mb-0">{label}:</span>
    <span className="font-semibold text-white text-lg text-right">{value}</span>
  </div>
);

export default SalesCalculatorPage;