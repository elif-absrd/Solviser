'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import { Plus, Trash2, Printer } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Helper function to format numbers with Indian style commas
const formatNumberWithCommas = (num: number) => {
    return num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// Define the type for a single item in our calculation list
interface CalculationItem {
  type: string;
  commodity: string;
  dimensions: string;
  quantity: number;
  volume: string;
  volumeValue: number; // Will store CBM for grand total
  volumeType: 'CBM' | 'CFT' | 'SQFT';
  cftValue?: number;   // Will store CFT for grand total
  price: string;
  priceValue: number;
  priceUnit: 'CFT' | 'CBM' | 'SQFT';
  total: string;
  totalValue: number;
}

const WoodCalculatorPage = () => {
  const [activeCalculator, setActiveCalculator] = useState('swan');

  // --- Swan Timber State ---
  const [swanInputs, setSwanInputs] = useState({
    thickness: '',
    width: '',
    lengthValue: '',
    lengthUnit: 'feet',
    quantity: '1',
    commodity: 'Pinewood',
    priceCFT: '',
  });
  const [swanCalculations, setSwanCalculations] = useState({
    cft: 0,
    cbm: 0,
    totalCFT: 0,
    totalCBM: 0,
    totalAmount: 0,
  });

  // --- Round Log State (Updated) ---
  const [roundLogInputs, setRoundLogInputs] = useState({
    girth: '',
    lengthMeter: '',
    quantity: '1',
    commodity: 'Teakwood',
    priceCFT: '', // Input price is now per CFT
  });
  const [roundLogCalculations, setRoundLogCalculations] = useState({
    cft: 0,
    cbm: 0,
    totalCFT: 0,
    totalCBM: 0,
    totalAmount: 0,
  });
    
  // --- Plywood State ---
  const [plywoodInputs, setPlywoodInputs] = useState({
      length: '',
      width: '',
      thickness: '',
      quantity: '1',
      commodity: 'Marine',
      priceSqFt: '',
  });
  const [plywoodCalculations, setPlywoodCalculations] = useState({
      sqft: 0,
      cbm: 0,
      totalSqFt: 0,
      totalCBM: 0,
      totalAmount: 0,
  });

  // --- Main Calculation List and Totals ---
  const [calculationList, setCalculationList] = useState<CalculationItem[]>([]);
  const [totals, setTotals] = useState({
    items: 0,
    quantity: 0,
    cbm: 0,
    cft: 0,
    basicAmount: 0,
    finalAmount: 0,
  });
    
  // --- Tax and Charges State ---
  const [includeGST, setIncludeGST] = useState(false);
  const [gstType, setGstType] = useState('cgst_sgst');
  const [includeOtherCharges, setIncludeOtherCharges] = useState(false);
  const [otherChargesRate, setOtherChargesRate] = useState('');
  const [includeTCS, setIncludeTCS] = useState(false);
  const [tcsRate, setTcsRate] = useState(2);
  const [includeTDS, setIncludeTDS] = useState(false);
  const [tdsRate, setTdsRate] = useState(2);
  const [finalAmounts, setFinalAmounts] = useState({
      cgst: 0, sgst: 0, igst: 0, totalGst: 0,
      otherCharges: 0, tcs: 0, tds: 0, roundOff: 0, grandTotal: 0,
  });
  const [includeLogo, setIncludeLogo] = useState(true);
    
  // --- useEffect for Swan Timber Calculations ---
  useEffect(() => {
    const { thickness, width, lengthValue, lengthUnit, quantity, priceCFT } = swanInputs;
    const t = parseFloat(thickness) || 0;
    const w = parseFloat(width) || 0;
    const lVal = parseFloat(lengthValue) || 0;
    const qty = parseInt(quantity) || 1;
    const price = parseFloat(priceCFT) || 0;
    const lengthInFeet = lengthUnit === 'inches' ? lVal / 12 : lVal;
    const cft = (t * w * lengthInFeet) / 144;
    const totalCFT = cft * qty;
    const cbm = totalCFT / 35.3147;
    const totalAmount = totalCFT * price;
    setSwanCalculations({ cft, cbm: cbm / qty, totalCFT, totalCBM: cbm, totalAmount });
  }, [swanInputs]);

  // --- useEffect for Round Log Calculations (Updated with new formula) ---
  useEffect(() => {
    const { girth, lengthMeter, quantity, priceCFT } = roundLogInputs;
    const g = parseFloat(girth) || 0;       // Girth in cm
    const l = parseFloat(lengthMeter) || 0; // Length in meters
    const qty = parseInt(quantity) || 1;
    const price = parseFloat(priceCFT) || 0;  // Price is per CFT

    // New Formula: (Girth x Girth x Length x 2.2072) / 10000 = CFT
    const cft = (g * g * l * 2.2072) / 10000;
    const totalCFT = cft * qty;
    const totalCBM = totalCFT / 35.3147; // Also calculate CBM for footer totals
    const totalAmount = totalCFT * price; // Total is based on CFT

    setRoundLogCalculations({ cft, cbm: totalCBM / qty, totalCFT, totalCBM, totalAmount });
  }, [roundLogInputs]);
    
  // --- useEffect for Plywood Calculations ---
  useEffect(() => {
    const { length, width, thickness, quantity, priceSqFt } = plywoodInputs;
    const l = parseFloat(length) || 0, w = parseFloat(width) || 0, t = parseFloat(thickness) || 0;
    const qty = parseInt(quantity) || 1, price = parseFloat(priceSqFt) || 0;
    const sqft = l * w, totalSqFt = sqft * qty;
    const cbm = l * w * (t / 1000) * 0.3048 * 0.3048, totalCBM = cbm * qty;
    const totalAmount = totalSqFt * price;
    setPlywoodCalculations({ sqft, cbm, totalSqFt, totalCBM, totalAmount });
  }, [plywoodInputs]);

  // --- useEffect for Grand Totals (with updated rounding) ---
  useEffect(() => {
    let totalQuantity = 0, totalCBM = 0, totalCFT = 0, basicAmount = 0;

    calculationList.forEach(item => {
      totalQuantity += item.quantity;
      basicAmount += item.totalValue;
      totalCFT += item.cftValue || 0;
      totalCBM += item.volumeValue || 0; // volumeValue consistently stores CBM
    });
    
    const rate = parseFloat(otherChargesRate) || 0;
    const otherCharges = includeOtherCharges ? totalCFT * rate : 0;
    let cgst = 0, sgst = 0, igst = 0, totalGst = 0;
    if (includeGST) {
      if (gstType === 'cgst_sgst') {
        cgst = basicAmount * 0.09; sgst = basicAmount * 0.09; totalGst = cgst + sgst;
      } else {
        igst = basicAmount * 0.18; totalGst = igst;
      }
    }
    const baseForTaxes = basicAmount + totalGst + otherCharges;
    const tcs = includeTCS ? baseForTaxes * (tcsRate / 100) : 0;
    const tds = includeTDS ? baseForTaxes * (tdsRate / 100) : 0;
    const preRoundTotal = basicAmount + totalGst + otherCharges + tcs - tds;

    // Updated Round Off Logic: > 0.51
    const decimalPart = preRoundTotal - Math.floor(preRoundTotal);
    let grandTotal = (decimalPart > 0.51) ? Math.ceil(preRoundTotal) : Math.floor(preRoundTotal);
    const roundOff = grandTotal - preRoundTotal;

    setTotals({
      items: calculationList.length, quantity: totalQuantity,
      cbm: totalCBM, cft: totalCFT, basicAmount: basicAmount, finalAmount: grandTotal,
    });
    setFinalAmounts({
        cgst, sgst, igst, totalGst, otherCharges, tcs, tds, roundOff, grandTotal
    });
  }, [calculationList, includeGST, gstType, includeOtherCharges, otherChargesRate, includeTCS, tcsRate, includeTDS, tdsRate]);

  // --- Input Handlers ---
  const handleSwanInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setSwanInputs(prev => ({ ...prev, [e.target.id]: e.target.value }));
  const handleRoundLogInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setRoundLogInputs(prev => ({ ...prev, [e.target.id]: e.target.value }));
  const handlePlywoodInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setPlywoodInputs(prev => ({ ...prev, [e.target.id]: e.target.value }));

  // --- Add to List Handlers (Updated for Round Log) ---
  const addSwanToList = () => {
    if (swanCalculations.totalAmount <= 0) return;
    setCalculationList(prev => [...prev, {
      type: 'Swan Timber', commodity: swanInputs.commodity,
      dimensions: `${swanInputs.thickness}" x ${swanInputs.width}" x ${swanInputs.lengthValue} ${swanInputs.lengthUnit}`,
      quantity: parseInt(swanInputs.quantity), volume: `${swanCalculations.totalCBM.toFixed(2)} CBM`,
      volumeValue: swanCalculations.totalCBM, volumeType: 'CBM', cftValue: swanCalculations.totalCFT,
      price: `₹${parseFloat(swanInputs.priceCFT).toFixed(2)} / CFT`, priceValue: parseFloat(swanInputs.priceCFT),
      priceUnit: 'CFT', total: `₹${swanCalculations.totalAmount.toFixed(2)}`, totalValue: swanCalculations.totalAmount,
    }]);
  };
    
  const addRoundLogToList = () => {
      if (roundLogCalculations.totalAmount <= 0) return;
      setCalculationList(prev => [...prev, {
          type: 'Round Log', commodity: roundLogInputs.commodity,
          dimensions: `Girth: ${roundLogInputs.girth}cm, Length: ${roundLogInputs.lengthMeter}m`,
          quantity: parseInt(roundLogInputs.quantity),
          volume: `${roundLogCalculations.totalCFT.toFixed(2)} CFT`, // Primary volume is now CFT
          volumeValue: roundLogCalculations.totalCBM, // Store CBM for total CBM calc
          volumeType: 'CFT', cftValue: roundLogCalculations.totalCFT, // Store CFT for total CFT calc
          price: `₹${parseFloat(roundLogInputs.priceCFT).toFixed(2)} / CFT`, priceValue: parseFloat(roundLogInputs.priceCFT),
          priceUnit: 'CFT', total: `₹${roundLogCalculations.totalAmount.toFixed(2)}`, totalValue: roundLogCalculations.totalAmount,
      }]);
  };
    
  const addPlywoodToList = () => {
      if (plywoodCalculations.totalAmount <= 0) return;
      setCalculationList(prev => [...prev, {
          type: 'Plywood', commodity: plywoodInputs.commodity,
          dimensions: `${plywoodInputs.length}' x ${plywoodInputs.width}' x ${plywoodInputs.thickness}mm`,
          quantity: parseInt(plywoodInputs.quantity), volume: `${plywoodCalculations.totalCBM.toFixed(2)} CBM`,
          volumeValue: plywoodCalculations.totalCBM, volumeType: 'CBM', cftValue: plywoodCalculations.totalCBM * 35.3147,
          price: `₹${parseFloat(plywoodInputs.priceSqFt).toFixed(2)} / SqFt`, priceValue: parseFloat(plywoodInputs.priceSqFt),
          priceUnit: 'SQFT', total: `₹${plywoodCalculations.totalAmount.toFixed(2)}`, totalValue: plywoodCalculations.totalAmount,
      }]);
  };
    
  const removeItem = (index: number) => setCalculationList(prev => prev.filter((_, i) => i !== index));
    
  const handleGeneratePdf = () => {
      if (calculationList.length === 0) return alert("Calculation list is empty.");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      if (includeLogo) { try { doc.addImage('/blacklogo.png', 'PNG', 15, 15, 40, 10); } catch (e) { console.error("Could not add logo.", e); doc.setFontSize(20).text("Solviser", 15, 25); }}
      doc.setFontSize(18).text("Wood Calculation Summary", pageWidth - 15, 25, { align: 'right' });
      doc.setFontSize(10).text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, 32, { align: 'right' });
      doc.text(`Reference #: ${Date.now()}`, pageWidth - 15, 37, { align: 'right' });
      doc.line(15, 45, pageWidth - 15, 45);

      const head = [['Type', 'Commodity', 'Dimensions', 'Qty', 'Volume', 'Price', 'Total (INR)']];
      const body = calculationList.map(item => {
        let displayPrice = '';
        if (item.type === 'Swan Timber' && item.priceUnit === 'CFT') {
            displayPrice = `${(item.priceValue * 35.315).toFixed(2)}/CBM`;
        } else {
            displayPrice = item.price.replace('₹', '').replace('/', '/ ').trim();
        }
        return [item.type, item.commodity, item.dimensions, item.quantity, item.volume, displayPrice, formatNumberWithCommas(item.totalValue)];
      });

      // Updated PDF footer to show both CFT and CBM totals
      const foot: RowInput[] = [[
        { content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `${totals.quantity} Pcs`, styles: { fontStyle: 'bold' } },
        { content: `${totals.cft.toFixed(2)} CFT`, styles: { fontStyle: 'bold' } },
        { content: `${totals.cbm.toFixed(2)} CBM`, styles: { fontStyle: 'bold' } },
        { content: formatNumberWithCommas(totals.basicAmount), styles: { fontStyle: 'bold' } }
      ]];
      
      autoTable(doc, {
          startY: 55, head, body, foot, theme: 'grid',
          headStyles: { fillColor: [35, 31, 32] },
          footStyles: { fillColor: [35, 31, 32], textColor: [255, 255, 255]},
      });

      let finalY = (doc as any).lastAutoTable.finalY;
      const totalsBody = [
          ...(includeOtherCharges ? [['Other Charges', `${formatNumberWithCommas(finalAmounts.otherCharges)} INR`]] : []),
          ['Basic Amount', `${formatNumberWithCommas(totals.basicAmount)} INR`],
          ...(includeGST && gstType === 'cgst_sgst' ? [['CGST @9%', `${formatNumberWithCommas(finalAmounts.cgst)} INR`]] : []),
          ...(includeGST && gstType === 'cgst_sgst' ? [['SGST @9%', `${formatNumberWithCommas(finalAmounts.sgst)} INR`]] : []),
          ...(includeGST && gstType === 'igst' ? [['IGST @18%', `${formatNumberWithCommas(finalAmounts.igst)} INR`]] : []),
          ...(includeTCS ? [['TCS', `${formatNumberWithCommas(finalAmounts.tcs)} INR`]] : []),
          ...(includeTDS ? [['TDS', `${formatNumberWithCommas(finalAmounts.tds)} INR`]] : []),
          [['Round Off.', `${finalAmounts.roundOff >= 0 ? '(+) ' : '(-) '}${Math.abs(finalAmounts.roundOff).toFixed(2)} INR`]],
          ['Grand Total', `${formatNumberWithCommas(finalAmounts.grandTotal)} INR`],
      ];
      
      autoTable(doc, {
          startY: finalY + 10, body: totalsBody, theme: 'plain', tableWidth: 'wrap',
          margin: { left: pageWidth / 2 }, styles: { fontSize: 10 },
          columnStyles: { 0: { fontStyle: 'bold', halign: 'right' }, 1: { halign: 'right' }},
          didParseCell: (data) => {
            if (data.row.index === totalsBody.length - 1) {
              data.cell.styles.fontStyle = 'bold'; data.cell.styles.fontSize = 12;
            }
          }
      });

      finalY = (doc as any).lastAutoTable.finalY;
      let signatureY = finalY + 20;
      if (signatureY > doc.internal.pageSize.getHeight() - 30) { doc.addPage(); signatureY = 40; }
      doc.line(pageWidth - 70, signatureY, pageWidth - 15, signatureY);
      doc.text("Authorized Signatory", pageWidth - 42.5, signatureY + 5, { align: 'center' });
      doc.output('dataurlnewwindow');
  };

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'swan': return (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input id="thickness" type="number" value={swanInputs.thickness} onChange={handleSwanInputChange} placeholder="Thickness (in)" className="p-2 bg-white/10 rounded-md" />
            <input id="width" type="number" value={swanInputs.width} onChange={handleSwanInputChange} placeholder="Width (in)" className="p-2 bg-white/10 rounded-md" />
            <input id="lengthValue" type="number" value={swanInputs.lengthValue} onChange={handleSwanInputChange} placeholder="Length" className="p-2 bg-white/10 rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select id="lengthUnit" value={swanInputs.lengthUnit} onChange={handleSwanInputChange} className="p-2 bg-white/10 rounded-md dark-dropdown"><option value="feet">Feet</option><option value="inches">Inches</option></select>
            <input id="quantity" type="number" min="1" value={swanInputs.quantity} onChange={handleSwanInputChange} placeholder="Quantity" className="p-2 bg-white/10 rounded-md" />
            <select id="commodity" value={swanInputs.commodity} onChange={handleSwanInputChange} className="p-2 bg-white/10 rounded-md dark-dropdown"><option value="Pinewood">Pinewood</option><option value="Teakwood">Teakwood</option><option value="Hardwood">Hardwood</option><option value="Others">Others</option></select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input id="priceCFT" type="number" value={swanInputs.priceCFT} onChange={handleSwanInputChange} placeholder="Price per CFT (₹)" className="p-2 bg-white/10 rounded-md" />
            <div className="p-2 bg-white/5 rounded-md text-center"><span className="text-lg font-bold">₹{formatNumberWithCommas(swanCalculations.totalAmount)}</span></div>
          </div>
          <div className="flex justify-end"><button onClick={addSwanToList} className="bg-[#f05134] px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-700"><Plus size={18} /> Add to List</button></div>
        </div>
      );
      case 'round': return (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input id="girth" type="number" value={roundLogInputs.girth} onChange={handleRoundLogInputChange} placeholder="Girth (cm)" className="p-2 bg-white/10 rounded-md" />
            <input id="lengthMeter" type="number" value={roundLogInputs.lengthMeter} onChange={handleRoundLogInputChange} placeholder="Length (m)" className="p-2 bg-white/10 rounded-md" />
            <input id="quantity" type="number" min="1" value={roundLogInputs.quantity} onChange={handleRoundLogInputChange} placeholder="Quantity" className="p-2 bg-white/10 rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <select id="commodity" value={roundLogInputs.commodity} onChange={handleRoundLogInputChange} className="p-2 bg-white/10 rounded-md dark-dropdown"><option value="Teakwood">Teakwood</option><option value="Pine wood">Pine wood</option><option value="Hardwood">Hardwood</option><option value="Others">Others</option></select>
            <input id="priceCFT" type="number" value={roundLogInputs.priceCFT} onChange={handleRoundLogInputChange} placeholder="Price per CFT (₹)" className="p-2 bg-white/10 rounded-md" />
            <div className="p-2 bg-white/5 rounded-md text-center"><span className="text-lg font-bold">₹{formatNumberWithCommas(roundLogCalculations.totalAmount)}</span></div>
          </div>
          <div className="flex justify-end"><button onClick={addRoundLogToList} className="bg-[#f05134] px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-700"><Plus size={18} /> Add to List</button></div>
        </div>
      );
      case 'plywood': return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input id="length" type="number" value={plywoodInputs.length} onChange={handlePlywoodInputChange} placeholder="Length (ft)" className="p-2 bg-white/10 rounded-md" />
                <input id="width" type="number" value={plywoodInputs.width} onChange={handlePlywoodInputChange} placeholder="Width (ft)" className="p-2 bg-white/10 rounded-md" />
                <input id="thickness" type="number" value={plywoodInputs.thickness} onChange={handlePlywoodInputChange} placeholder="Thickness (mm)" className="p-2 bg-white/10 rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input id="quantity" type="number" min="1" value={plywoodInputs.quantity} onChange={handlePlywoodInputChange} placeholder="Quantity" className="p-2 bg-white/10 rounded-md" />
                <select id="commodity" value={plywoodInputs.commodity} onChange={handlePlywoodInputChange} className="p-2 bg-white/10 rounded-md dark-dropdown"><option value="Marine">Marine</option><option value="Commercial">Commercial</option><option value="Others">Others</option></select>
                <input id="priceSqFt" type="number" value={plywoodInputs.priceSqFt} onChange={handlePlywoodInputChange} placeholder="Price per SqFt (₹)" className="p-2 bg-white/10 rounded-md" />
            </div>
            <div className="p-2 bg-white/5 rounded-md text-center mb-6"><span className="text-lg font-bold">₹{formatNumberWithCommas(plywoodCalculations.totalAmount)}</span></div>
            <div className="flex justify-end"><button onClick={addPlywoodToList} className="bg-[#f05134] px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-700"><Plus size={18} /> Add to List</button></div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#262626] text-white font-sans p-4 sm:p-6 lg:p-8">
        <style jsx global>{`.dark-dropdown option { background-color: #374151; color: white; }`}</style>
        <header className="bg-white/5 p-4 rounded-xl shadow-lg mb-8 mt-14">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Wood Calculator</h1>
            <div className="flex items-center gap-4">
              <label htmlFor="logo" className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" id="logo" checked={includeLogo} onChange={e => setIncludeLogo(e.target.checked)} className="accent-[#f05134]" /> Include Logo</label>
              <button onClick={handleGeneratePdf} className="p-2 bg-[#f05134] rounded-full hover:bg-orange-700" title="Generate PDF"><Printer size={18} /></button>
            </div>
          </div>
        </header>
        <main className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 p-6 rounded-xl shadow-lg">
              <div className="flex border-b border-white/10 mb-6">
                <button onClick={() => setActiveCalculator('swan')} className={`py-2 px-4 text-sm font-medium ${activeCalculator === 'swan' ? 'border-b-2 border-[#f05134] text-[#f05134]' : 'text-gray-400'}`}>Swan Timbers</button>
                <button onClick={() => setActiveCalculator('round')} className={`py-2 px-4 text-sm font-medium ${activeCalculator === 'round' ? 'border-b-2 border-[#f05134] text-[#f05134]' : 'text-gray-400'}`}>Round Logs</button>
                <button onClick={() => setActiveCalculator('plywood')} className={`py-2 px-4 text-sm font-medium ${activeCalculator === 'plywood' ? 'border-b-2 border-[#f05134] text-[#f05134]' : 'text-gray-400'}`}>Plywood</button>
              </div>
              {renderCalculator()}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white/5 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Calculation List</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {calculationList.length === 0 ? (<p className="text-gray-400 text-center py-4">Your list is empty.</p>) : (
                  calculationList.map((item, index) => (
                    <div key={index} className="bg-white/5 p-3 rounded-lg flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.type} <span className="text-gray-300 font-normal">({item.commodity})</span></p>
                        <p className="text-xs text-gray-400">{item.dimensions} | Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#f05134]">₹{formatNumberWithCommas(item.totalValue)}</p>
                      </div>
                      <button onClick={() => removeItem(index)} className="text-gray-400 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  )))}
              </div>
              <div className="border-t border-white/10 mt-6 pt-4">
                <h3 className="font-semibold mb-3">Taxes & Charges</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <label htmlFor="gst" className="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="gst" checked={includeGST} onChange={e => setIncludeGST(e.target.checked)} className="accent-[#f05134]" /> Include GST</label>
                    {includeGST && (<select value={gstType} onChange={e => setGstType(e.target.value)} className="bg-white/10 text-xs rounded p-1 dark-dropdown"><option value="cgst_sgst">CGST+SGST</option><option value="igst">IGST</option></select>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="other" className="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="other" checked={includeOtherCharges} onChange={e => setIncludeOtherCharges(e.target.checked)} className="accent-[#f05134]" /> Other Charges</label>
                    {includeOtherCharges && (<input type="number" value={otherChargesRate} onChange={e => setOtherChargesRate(e.target.value)} placeholder="Rate/CFT" className="bg-white/10 text-xs rounded p-1 w-20" />)}
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="tcs" className="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="tcs" checked={includeTCS} onChange={e => setIncludeTCS(e.target.checked)} className="accent-[#f05134]" /> Include TCS</label>
                    {includeTCS && (<select value={tcsRate} onChange={e => setTcsRate(Number(e.target.value))} className="bg-white/10 text-xs rounded p-1 dark-dropdown"><option value="2">2%</option><option value="2.5">2.5%</option></select>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="tds" className="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="tds" checked={includeTDS} onChange={e => setIncludeTDS(e.target.checked)} className="accent-[#f05134]" /> Include TDS</label>
                    {includeTDS && (<select value={tdsRate} onChange={e => setTdsRate(Number(e.target.value))} className="bg-white/10 text-xs rounded p-1 dark-dropdown"><option value="2">2%</option><option value="2.5">2.5%</option></select>)}
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 mt-6 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Basic Amount:</span> <span>₹{formatNumberWithCommas(totals.basicAmount)}</span></div>
                {includeOtherCharges && <div className="flex justify-between"><span className="text-gray-400">Other Charges:</span> <span>₹{formatNumberWithCommas(finalAmounts.otherCharges)}</span></div>}
                {includeGST && gstType === 'cgst_sgst' && (<>
                    <div className="flex justify-between"><span className="text-gray-400">CGST (9%):</span> <span>₹{formatNumberWithCommas(finalAmounts.cgst)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">SGST (9%):</span> <span>₹{formatNumberWithCommas(finalAmounts.sgst)}</span></div></>)}
                {includeGST && gstType === 'igst' && <div className="flex justify-between"><span className="text-gray-400">IGST (18%):</span> <span>₹{formatNumberWithCommas(finalAmounts.igst)}</span></div>}
                {includeTCS && <div className="flex justify-between"><span className="text-gray-400">TCS ({tcsRate}%):</span> <span>₹{formatNumberWithCommas(finalAmounts.tcs)}</span></div>}
                {includeTDS && <div className="flex justify-between"><span className="text-gray-400">TDS ({tdsRate}%):</span> <span className="text-red-400">-₹{formatNumberWithCommas(finalAmounts.tds)}</span></div>}
                <div className="flex justify-between"><span className="text-gray-400">Round Off:</span> <span>₹{finalAmounts.roundOff.toFixed(2)}</span></div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Grand Total:</span>
                  <span className="text-[#f05134]">₹{formatNumberWithCommas(finalAmounts.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default WoodCalculatorPage;