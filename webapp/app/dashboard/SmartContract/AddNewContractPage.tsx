'use client';

import React, { useState } from 'react';
import Stepper from './Stepper';

// Define the types for the component props and form data
interface AddNewContractPageProps {
  onGoBack: () => void;
}

interface FormData {
  buyerName: string;
  gstPanCin: string;
  gstNumber: string;
  date: string;
  registeredAddress: string;
  contractTitle: string;
  contractType: string;
  startDate: string;
  endDate: string;
  contractValue: string;
  termsAndClauses: string;
  agreedToTerms: boolean;
}

export default function AddNewContractPage({ onGoBack }: AddNewContractPageProps) {
  // Use state to manage the current step and all form data
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    buyerName: '',
    gstPanCin: '',
    gstNumber: '',
    date: '2025-08-06',
    registeredAddress: '',
    contractTitle: '',
    contractType: '',
    startDate: '',
    endDate: '',
    contractValue: '',
    termsAndClauses: '',
    agreedToTerms: false,
  });

  // Handle changes to any form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

    setFormData((prevData) => ({
      ...prevData,
      [id]: isCheckbox ? checked : value,
    }));
  };

  // Function to handle moving to the next step
  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Function to handle moving to the previous step
  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Conditionally render the form content based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          // Step 1: Order Details
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Details</h2>
              <p className="text-gray-500">Enter the products or services to be included in this contract.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-1 lg:col-span-2">
                <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
                <input type="text" id="buyerName" value={formData.buyerName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              
              <div className="md:col-span-1 lg:col-span-1">
                <div className="flex items-center space-x-2">
                  <label htmlFor="gstPanCin" className="block text-sm font-medium text-gray-700 mb-1">GST/PAN/CIN no</label>
                  <button className="text-xs px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">Fetch</button>
                </div>
                <input type="text" id="gstPanCin" value={formData.gstPanCin} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>

              <div className="md:col-span-1 lg:col-span-1">
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input type="text" id="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>

              <div className="md:col-span-1 lg:col-span-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" id="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label htmlFor="registeredAddress" className="block text-sm font-medium text-gray-700 mb-1">Registered Office Address</label>
                <textarea id="registeredAddress" rows={3} value={formData.registeredAddress} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          // Step 2: Contract Details
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Contract Details</h2>
              <p className="text-gray-500">Provide the key terms and dates for this contract.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contractTitle" className="block text-sm font-medium text-gray-700 mb-1">Contract Title</label>
                <input type="text" id="contractTitle" value={formData.contractTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                <select id="contractType" value={formData.contractType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select Type</option>
                  <option value="service_agreement">Service Agreement</option>
                  <option value="sales_agreement">Sales Agreement</option>
                  <option value="licensing">Licensing</option>
                </select>
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" id="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" id="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="contractValue" className="block text-sm font-medium text-gray-700 mb-1">Contract Value ($)</label>
                <input type="number" id="contractValue" value={formData.contractValue} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          // Step 3: Terms & Clauses
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Terms & Clauses</h2>
              <p className="text-gray-500">Add any specific terms, conditions, or clauses for the contract.</p>
            </div>
            <textarea
              id="termsAndClauses"
              rows={10}
              value={formData.termsAndClauses}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter contract terms, payment schedules, and other clauses here."
            ></textarea>
          </div>
        );
      case 3:
        return (
          // Step 4: Review & Sign
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Review & Sign</h2>
              <p className="text-gray-500">Review the final contract details and prepare for signing.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Summary of Contract</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-semibold">Buyer Name:</span> {formData.buyerName}</p>
                <p><span className="font-semibold">GST/PAN/CIN:</span> {formData.gstPanCin}</p>
                <p><span className="font-semibold">GST Number:</span> {formData.gstNumber}</p>
                <p><span className="font-semibold">Date:</span> {formData.date}</p>
                <p className="md:col-span-2"><span className="font-semibold">Address:</span> {formData.registeredAddress}</p>
                <p><span className="font-semibold">Contract Title:</span> {formData.contractTitle}</p>
                <p><span className="font-semibold">Contract Type:</span> {formData.contractType}</p>
                <p><span className="font-semibold">Start Date:</span> {formData.startDate}</p>
                <p><span className="font-semibold">End Date:</span> {formData.endDate}</p>
                <p><span className="font-semibold">Contract Value:</span> ${formData.contractValue}</p>
                <p className="md:col-span-2"><span className="font-semibold">Terms & Clauses:</span></p>
                <div className="md:col-span-2 whitespace-pre-wrap p-4 bg-white rounded-lg border border-gray-200">
                  {formData.termsAndClauses}
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center space-x-2">
              <input type="checkbox" id="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} className="rounded text-red-600 focus:ring-red-500" />
              <label htmlFor="agreedToTerms" className="text-sm font-medium text-gray-700">I agree to the terms and conditions.</label>
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
            <h1 className="text-3xl font-semibold text-gray-800">Add New Contract</h1>
        </div>
        <button className="px-6 py-2.5 bg-white text-gray-700 rounded-full border border-gray-300 shadow-md hover:bg-gray-100 transition-colors">
          Save Draft
        </button>
      </div>

      {/* Main Content Card */}
      <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <Stepper currentStep={currentStep} />
        
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
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className={`px-6 py-2.5 rounded-full text-white transition-colors ml-auto ${
                currentStep === 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Next
            </button>
          ) : (
            <button className="px-6 py-2.5 rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors ml-auto">
              Create Contract
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
