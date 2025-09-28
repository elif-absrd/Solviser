'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import { Edit, Trash2, Printer, X, Plus, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Define the type for a single calculated item
interface CalculationItem {
  id: number;
  itemName: string;
  width: number;
  thickness: number;
  length: number;
  dimensions: string; // Combined field for display
  quantity: number;
  price: number;
  cft: number;
  cbm: number; // Added CBM
  amount: number;
  taxRate: number;
  sgst: number;
  cgst: number;
  igst: number;
  tcs: number;
  total: number;
  sgstChecked: boolean;
  cgstChecked: boolean;
  igstChecked: boolean;
  tcsChecked: boolean;
}

// Main Component
const MeasurementCalculatorPage = () => {
  const [items, setItems] = useState<CalculationItem[]>([]);
  const [inputs, setInputs] = useState({ itemName: '', width: '', thickness: '', length: '', quantity: '1', price: '' });
  const [taxOptions, setTaxOptions] = useState({ sgst: false, cgst: false, igst: false, tcs: false, taxRate: '18' });
  const [otherCharges, setOtherCharges] = useState(''); // State for Other Charges input
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CalculationItem | null>(null);
  const [totals, setTotals] = useState({
    basicAmount: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    tcs: 0,
    roundOff: 0, // State for Round Off amount
    grandTotal: 0,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [includeLogo, setIncludeLogo] = useState(true);

  // Effect to recalculate totals whenever items or other charges change
  useEffect(() => {
    const basicAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const sgst = items.reduce((sum, item) => sum + item.sgst, 0);
    const cgst = items.reduce((sum, item) => sum + item.cgst, 0);
    const igst = items.reduce((sum, item) => sum + item.igst, 0);
    const tcs = items.reduce((sum, item) => sum + item.tcs, 0);

    const numOtherCharges = parseFloat(otherCharges) || 0;

    // Calculate total before rounding
    const preRoundTotal = basicAmount + sgst + cgst + igst + tcs + numOtherCharges;
    
    // Calculate final rounded total and the round-off amount
    const grandTotal = Math.round(preRoundTotal);
    const roundOff = grandTotal - preRoundTotal;

    setTotals({
      basicAmount,
      sgst,
      cgst,
      igst,
      tcs,
      roundOff,
      grandTotal,
    });
  }, [items, otherCharges]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleTaxCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setTaxOptions(prev => {
        const newOptions = { ...prev, [id]: checked };
        if (id === 'igst' && checked) {
            newOptions.sgst = false;
            newOptions.cgst = false;
        }
        if (id === 'sgst' && checked) {
            newOptions.igst = false;
            newOptions.cgst = true; // Auto-check CGST
        }
        if (id === 'cgst' && checked) {
            newOptions.igst = false;
            newOptions.sgst = true; // Auto-check SGST
        }
         if ((id === 'sgst' || id === 'cgst') && !checked) {
            newOptions.sgst = false;
            newOptions.cgst = false;
        }
        return newOptions;
    });
  };

  const handleAddItem = () => {
    const { itemName, width, thickness, length, quantity, price } = inputs;
    if (!itemName || !width || !thickness || !length || !quantity || !price || parseFloat(quantity) <= 0 || parseFloat(price) <= 0) {
        setAlertMessage('Please fill all fields correctly.');
        return;
    }
    const { sgst: sgstChecked, cgst: cgstChecked, igst: igstChecked, tcs: tcsChecked, taxRate } = taxOptions;
    const w = parseFloat(width) || 0;
    const t = parseFloat(thickness) || 0;
    const l = parseFloat(length) || 0;
    const qty = parseFloat(quantity) || 0;
    const p = parseFloat(price) || 0;
    const rate = parseFloat(taxRate) || 0;

    const cftPerPiece = (w * t * l) / 144;
    const totalCFT = cftPerPiece * qty;
    const totalCBM = totalCFT / 35.315; // Calculate CBM
    const amount = totalCFT * p;
    let sgst = 0, cgst = 0, igst = 0, tcs = 0;

    if (igstChecked) {
      igst = amount * (rate / 100);
    } else {
      if (sgstChecked) sgst = amount * (rate / 200);
      if (cgstChecked) cgst = amount * (rate / 200);
    }
    if (tcsChecked) tcs = (amount + sgst + cgst + igst) * 0.02;

    const total = amount + sgst + cgst + igst;
    const dimensions = `${w}in x ${t}in x ${l}ft`;

    setItems(prev => [...prev, { id: Date.now(), itemName, width: w, thickness: t, length: l, dimensions, quantity: qty, price: p, cft: totalCFT, cbm: totalCBM, amount, taxRate: rate, sgst, cgst, igst, tcs, total, sgstChecked, cgstChecked, igstChecked, tcsChecked }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddItem();
  };

  const handleOpenEditModal = (item: CalculationItem) => {
    setCurrentItem(item);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedItem: CalculationItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditModalOpen(false);
  };

  const handleOpenDeleteModal = (item: CalculationItem) => {
    setCurrentItem(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (currentItem) setItems(items.filter(item => item.id !== currentItem.id));
    setDeleteModalOpen(false);
  };
  
  const handleGeneratePdf = () => {
    if (items.length === 0) {
      setAlertMessage("No data to generate a PDF.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    if (includeLogo) {
        try {
            doc.addImage('/blacklogo.png', 'PNG', 15, 15, 40, 10);
        } catch (e) {
            console.error("Could not add logo. Make sure it's in your /public folder.", e);
            doc.setFontSize(20);
            doc.text("Solviser", 15, 25);
        }
    }

    doc.setFontSize(18);
    doc.text("Calculation Summary", pageWidth - 15, 25, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, 32, { align: 'right' });
    doc.text(`Reference #: ${Date.now()}`, pageWidth - 15, 37, { align: 'right' });

    doc.line(15, 45, pageWidth - 15, 45);

    // Add CBM to PDF table header
    const head = [['Item', 'Dimensions', 'Qty', 'CFT', 'CBM', 'Rate (INR)', 'Amount (INR)']];
    // Add CBM data to each row
    const body = items.map(item => [
      item.itemName,
      item.dimensions,
      item.quantity,
      item.cft.toFixed(2),
      item.cbm.toFixed(3), // CBM value
      item.price.toFixed(2),
      item.amount.toFixed(2),
    ]);
    
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalCFT = items.reduce((sum, item) => sum + item.cft, 0);
    const totalCBM = items.reduce((sum, item) => sum + item.cbm, 0);

    // Update footer row to include CBM total and units
    const foot: RowInput[] = [[
        { content: 'Total', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `${totalQty} Pcs`, styles: { fontStyle: 'bold'} },
        { content: `${totalCFT.toFixed(2)} Cft`, styles: { fontStyle: 'bold'} },
        { content: totalCBM.toFixed(3), styles: { fontStyle: 'bold' } },
        { content: '' }, // Empty cell for Rate
        { content: totals.basicAmount.toFixed(2), styles: { fontStyle: 'bold' } },
    ]];

    autoTable(doc, {
      startY: 55,
      head: head,
      body: body,
      foot: foot,
      theme: 'grid',
      headStyles: {
        fillColor: [35, 31, 32] // #231f20
      },
      footStyles: {
        fillColor: [35, 31, 32],
        textColor: [255, 255, 255]
      },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.text('Thank you for using our tool.', 15, doc.internal.pageSize.getHeight() - 10);
      }
    });
    
    let finalY = (doc as any).lastAutoTable.finalY;
    const numOtherCharges = parseFloat(otherCharges) || 0;

    // Add Other Charges and Round Off to the PDF totals
    const totalsData = [
        ['Basic Amount', `${totals.basicAmount.toFixed(2)} INR`],
        ...(numOtherCharges > 0 ? [['Other Charges', `${numOtherCharges.toFixed(2)} INR`]] : []),
        ...(totals.sgst > 0 ? [['SGST', `${totals.sgst.toFixed(2)} INR`]] : []),
        ...(totals.cgst > 0 ? [['CGST', `${totals.cgst.toFixed(2)} INR`]] : []),
        ...(totals.igst > 0 ? [['IGST', `${totals.igst.toFixed(2)} INR`]] : []),
        ...(totals.tcs > 0 ? [['TCS', `${totals.tcs.toFixed(2)} INR`]] : []),
        [['ROUND OFF', `${totals.roundOff >= 0 ? '(+) ' : '(-) '}${Math.abs(totals.roundOff).toFixed(2)} INR`]],
        ['Grand Total', `${totals.grandTotal.toFixed(2)} INR`],
    ];

    autoTable(doc, {
        startY: finalY + 10,
        body: totalsData,
        theme: 'plain',
        tableWidth: 'wrap',
        margin: { left: pageWidth / 2 },
        styles: {
            fontSize: 10,
        },
        columnStyles: {
            0: { fontStyle: 'bold', halign: 'right' },
            1: { halign: 'right' }
        },
        didParseCell: (data) => {
            if (data.row.section === 'body' && data.row.index === totalsData.length - 1) {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fontSize = 12;
            }
        }
    });
    
    finalY = (doc as any).lastAutoTable.finalY;
    let signatureY = finalY + 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    
    if (signatureY > pageHeight - 30) {
      doc.addPage();
      signatureY = 40;
    }

    doc.line(pageWidth - 70, signatureY, pageWidth - 15, signatureY);
    doc.text("Authorized Signatory", pageWidth - 42.5, signatureY + 5, { align: 'center' });

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
                <h1 className="text-2xl font-bold text-white">Measurement Calculator</h1>
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
            <div className="lg:w-2/5 lg:sticky lg:top-8 self-start no-print">
              <div className="bg-white/5 rounded-xl shadow-lg p-6 mb-6">
                <p className="text-gray-400 mb-6">Enter dimensions to calculate Cubic Feet (CFT).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  <input type="text" id="itemName" value={inputs.itemName} onChange={handleInputChange} onKeyDown={handleKeyPress} className="w-full bg-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f05134]" placeholder="Item Name" />
                  <input type="number" id="width" value={inputs.width} onChange={handleInputChange} onKeyDown={handleKeyPress} className="w-full bg-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f05134]" placeholder="Width (inch)" />
                  <input type="number" id="thickness" value={inputs.thickness} onChange={handleInputChange} onKeyDown={handleKeyPress} className="w-full bg-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f05134]" placeholder="Thickness (inch)" />
                  <input type="number" id="length" value={inputs.length} onChange={handleInputChange} onKeyDown={handleKeyPress} className="w-full bg-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f05134]" placeholder="Length (feet)" />
                   <input type="number" id="quantity" value={inputs.quantity} onChange={handleInputChange} onKeyDown={handleKeyPress} className="w-full bg-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f05134]" placeholder="Quantity" />
                  <input type="number" id="price" value={inputs.price} onChange={handleInputChange} onKeyDown={handleKeyPress} className="w-full bg-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f05134]" placeholder="Price per CFT (INR)" />
                </div>
                
                <div className="mt-6 bg-black/20 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <label className="block text-gray-300 font-medium mb-3">Tax Type</label>
                      <div className="flex items-center flex-wrap gap-4">
                        <div className="flex items-center"><input type="checkbox" id="sgst" checked={taxOptions.sgst} onChange={handleTaxCheckboxChange} className="w-4 h-4 accent-[#f05134]" /><label htmlFor="sgst" className="ml-2 text-gray-300">SGST</label></div>
                        <div className="flex items-center"><input type="checkbox" id="cgst" checked={taxOptions.cgst} onChange={handleTaxCheckboxChange} className="w-4 h-4 accent-[#f05134]" /><label htmlFor="cgst" className="ml-2 text-gray-300">CGST</label></div>
                        <div className="flex items-center"><input type="checkbox" id="igst" checked={taxOptions.igst} onChange={handleTaxCheckboxChange} className="w-4 h-4 accent-[#f05134]" /><label htmlFor="igst" className="ml-2 text-gray-300">IGST</label></div>
                        <div className="flex items-center"><input type="checkbox" id="tcs" checked={taxOptions.tcs} onChange={handleTaxCheckboxChange} className="w-4 h-4 accent-[#f05134]" /><label htmlFor="tcs" className="ml-2 text-gray-300">TCS 2%</label></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-3" htmlFor="taxRate">GST Rate (%)</label>
                      <select id="taxRate" value={taxOptions.taxRate} onChange={(e: any) => setTaxOptions(prev => ({ ...prev, taxRate: e.target.value }))} className="w-full bg-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f05134] dark-dropdown">
                        <option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleAddItem} className="bg-[#f05134] hover:bg-orange-700 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2 w-full md:w-auto justify-center">
                    <Plus size={18}/> Add Item
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-3/5">
              <div className="bg-white/5 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Calculation Results</h2>
                </div>
                {items.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <p>No calculations yet.</p>
                    <p className="text-sm">Add an item using the form on the left.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[calc(100vh-12rem)]">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-[#2c2829]">
                        <tr className="border-b border-white/10">
                          <th className="px-4 py-3 text-left font-medium">Item</th>
                          <th className="px-4 py-3 text-center font-medium">Dimensions</th>
                          <th className="px-4 py-3 text-center font-medium">Qty</th>
                          <th className="px-4 py-3 text-center font-medium">CFT</th>
                          <th className="px-4 py-3 text-center font-medium">CBM</th>
                          <th className="px-4 py-3 text-right font-medium">Rate</th>
                          <th className="px-4 py-3 text-right font-medium">Amount</th>
                          <th className="px-4 py-3 text-center font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id} className="hover:bg-white/5">
                            <td className="px-4 py-3 border-b border-white/10">{item.itemName}</td>
                            <td className="px-4 py-3 text-center border-b border-white/10 text-sm text-gray-300">{item.dimensions}</td>
                            <td className="px-4 py-3 text-center border-b border-white/10">{item.quantity}</td>
                            <td className="px-4 py-3 text-center border-b border-white/10">{item.cft.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center border-b border-white/10">{item.cbm.toFixed(3)}</td>
                            <td className="px-4 py-3 text-right border-b border-white/10">₹{item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right border-b border-white/10">₹{item.amount.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center border-b border-white/10">
                              <button onClick={() => handleOpenEditModal(item)} className="text-blue-400 hover:text-blue-300 mr-3"><Edit size={16} /></button>
                              <button onClick={() => handleOpenDeleteModal(item)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tbody className="bg-black/10">
                        <tr><td colSpan={7} className="px-4 pt-4 pb-2 text-right text-gray-300">Basic Amount</td><td className="px-4 pt-4 pb-2 text-right font-medium">₹{totals.basicAmount.toFixed(2)}</td></tr>
                        {totals.sgst > 0 && <tr><td colSpan={7} className="px-4 py-2 text-right text-gray-300">SGST</td><td className="px-4 py-2 text-right font-medium">₹{totals.sgst.toFixed(2)}</td></tr>}
                        {totals.cgst > 0 && <tr><td colSpan={7} className="px-4 py-2 text-right text-gray-300">CGST</td><td className="px-4 py-2 text-right font-medium">₹{totals.cgst.toFixed(2)}</td></tr>}
                        {totals.igst > 0 && <tr><td colSpan={7} className="px-4 py-2 text-right text-gray-300">IGST</td><td className="px-4 py-2 text-right font-medium">₹{totals.igst.toFixed(2)}</td></tr>}
                        <tr>
                            <td colSpan={7} className="px-4 py-2 text-right text-gray-300">Other Charges</td>
                            <td className="px-4 py-2 text-right font-medium">
                                <input
                                    type="number"
                                    value={otherCharges}
                                    onChange={(e) => setOtherCharges(e.target.value)}
                                    className="w-28 bg-white/10 rounded-md px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-[#f05134]"
                                    placeholder="0.00"
                                />
                            </td>
                        </tr>
                        {totals.tcs > 0 && <tr><td colSpan={7} className="px-4 py-2 text-right text-gray-300">TCS</td><td className="px-4 py-2 text-right font-medium">₹{totals.tcs.toFixed(2)}</td></tr>}
                        <tr><td colSpan={7} className="px-4 py-2 text-right text-gray-300">Round Off</td><td className="px-4 py-2 text-right font-medium">₹{totals.roundOff.toFixed(2)}</td></tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-black/20 font-bold">
                          <td colSpan={7} className="px-4 py-3 text-right text-lg">Grand Total</td>
                          <td className="px-4 py-3 text-right text-lg text-[#f05134]">₹{totals.grandTotal.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
      {isEditModalOpen && <EditModal item={currentItem} onSave={handleSaveEdit} onClose={() => setEditModalOpen(false)} />}
      {isDeleteModalOpen && <DeleteModal onConfirm={handleConfirmDelete} onClose={() => setDeleteModalOpen(false)} />}
    </div>
  );
};

const EditModal = ({ item, onSave, onClose }: { item: CalculationItem | null, onSave: (item: CalculationItem) => void, onClose: () => void }) => {
  const [editData, setEditData] = useState<CalculationItem | null>(item);

  useEffect(() => { setEditData(item); }, [item]);

  if (!editData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setEditData(prev => prev ? { ...prev, [e.target.id]: e.target.value } : null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, checked } = e.target;
      setEditData(prev => {
          if (!prev) return null;
          const newOptions = { ...prev, [id]: checked };
          if (id === 'igstChecked' && checked) {
              newOptions.sgstChecked = false;
              newOptions.cgstChecked = false;
          }
          if ((id === 'sgstChecked' || id === 'cgstChecked') && checked) {
              newOptions.igstChecked = false;
          }
          return newOptions;
      });
  };

  const handleSave = () => {
      if (!editData) return;

      const { id, itemName, width, thickness, length, quantity, price, taxRate, sgstChecked, cgstChecked, igstChecked, tcsChecked } = editData;
      const w = Number(width);
      const t = Number(thickness);
      const l = Number(length);
      const qty = Number(quantity);
      const p = Number(price);
      const rate = Number(taxRate);

      const cftPerPiece = (w * t * l) / 144;
      const totalCFT = cftPerPiece * qty;
      const totalCBM = totalCFT / 35.315; // Calculate CBM on edit
      const amount = totalCFT * p;
      let sgst = 0, cgst = 0, igst = 0, tcs = 0;

      if (igstChecked) {
          igst = amount * (rate / 100);
      } else {
          if (sgstChecked) sgst = amount * (rate / 200);
          if (cgstChecked) cgst = amount * (rate / 200);
      }
      if (tcsChecked) tcs = (amount + sgst + cgst + igst) * 0.02;

      const total = amount + sgst + cgst + igst;
      const dimensions = `${w}in x ${t}in x ${l}ft`;

      // Pass the updated object with CBM
      onSave({ id, itemName, width: w, thickness: t, length: l, dimensions, quantity: qty, price: p, cft: totalCFT, cbm: totalCBM, amount, taxRate: rate, sgst, cgst, igst, tcs, total, sgstChecked, cgstChecked, igstChecked, tcsChecked });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-[#2c2829] text-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Edit Item</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <input type="text" id="itemName" value={editData.itemName} onChange={handleChange} className="w-full bg-white/10 rounded px-3 py-2" placeholder="Item Name"/>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" id="width" value={editData.width} onChange={handleChange} className="w-full bg-white/10 rounded px-3 py-2" placeholder="Width (inch)"/>
            <input type="number" id="thickness" value={editData.thickness} onChange={handleChange} className="w-full bg-white/10 rounded px-3 py-2" placeholder="Thickness (inch)"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" id="length" value={editData.length} onChange={handleChange} className="w-full bg-white/10 rounded px-3 py-2" placeholder="Length (feet)"/>
            <input type="number" id="quantity" value={editData.quantity} onChange={handleChange} className="w-full bg-white/10 rounded px-3 py-2" placeholder="Quantity"/>
          </div>
          <input type="number" id="price" value={editData.price} onChange={handleChange} className="w-full bg-white/10 rounded px-3 py-2" placeholder="Price (₹)"/>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center"><input type="checkbox" id="sgstChecked" checked={editData.sgstChecked} onChange={handleCheckboxChange} className="w-4 h-4 accent-[#f05134] rounded" /><label htmlFor="sgstChecked" className="ml-2 text-sm">SGST</label></div>
            <div className="flex items-center"><input type="checkbox" id="cgstChecked" checked={editData.cgstChecked} onChange={handleCheckboxChange} className="w-4 h-4 accent-[#f05134] rounded" /><label htmlFor="cgstChecked" className="ml-2 text-sm">CGST</label></div>
            <div className="flex items-center"><input type="checkbox" id="igstChecked" checked={editData.igstChecked} onChange={handleCheckboxChange} className="w-4 h-4 accent-[#f05134] rounded" /><label htmlFor="igstChecked" className="ml-2 text-sm">IGST</label></div>
            <div className="flex items-center"><input type="checkbox" id="tcsChecked" checked={editData.tcsChecked} onChange={handleCheckboxChange} className="w-4 h-4 accent-[#f05134] rounded" /><label htmlFor="tcsChecked" className="ml-2 text-sm">TCS 2%</label></div>
          </div>
          <select id="taxRate" value={editData.taxRate} onChange={handleChange} className="w-full bg-white/10 rounded px-3 py-2 dark-dropdown">
            <option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md">Cancel</button>
          <button onClick={handleSave} className="bg-[#f05134] hover:bg-orange-700 text-white px-4 py-2 rounded-md">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ onConfirm, onClose }: { onConfirm: () => void, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 no-print">
        <div className="bg-[#2c2829] text-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/50 mb-4">
                    <Trash2 className="text-red-400 h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Delete Item</h3>
                <p className="text-gray-400">Are you sure you want to delete this item? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
                <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md">Cancel</button>
                <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Delete</button>
            </div>
        </div>
    </div>
);

const AlertModal = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 no-print">
        <div className="bg-[#2c2829] text-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-900/50 mb-4">
                    <AlertTriangle className="text-yellow-400 h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Input Required</h3>
                <p className="text-gray-400">{message}</p>
            </div>
            <div className="flex justify-center">
                <button onClick={onClose} className="bg-[#f05134] hover:bg-orange-700 text-white px-6 py-2 rounded-md">OK</button>
            </div>
        </div>
    </div>
);

export default MeasurementCalculatorPage;