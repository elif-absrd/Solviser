"use client";
import React from "react";

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  const defaultSteps = [
    { label: "Order Details" },
    { label: "Contract Details" },
    { label: "Terms & Clauses" },
    { label: "Review & Sign" },
  ];
  
  const importSteps = [
    { label: "Basic Info" },
    { label: "Item Details" },
    { label: "Shipping & Payment" },
    { label: "Documents & Bank" },
    { label: "Terms & Conditions" },
  ];
  
  const steps = totalSteps === 5 ? importSteps : defaultSteps;

  return (
    <div className="flex justify-between items-center my-8 px-4 relative">
      {/* Background line */}
      <div className="absolute top-[30%] left-0 w-full h-0.5 bg-gray-300 transform -translate-y-1/2"></div>

      {/* Progress line */}
      <div
        className="absolute top-[30%] left-0 h-0.5 bg-red-600 transform -translate-y-1/2 transition-all duration-300"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center z-10">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold transition-colors duration-300 ${
              index <= currentStep ? "bg-red-600" : "bg-gray-400"
            }`}
          >
            {index < currentStep ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          <p
            className={`mt-2 text-sm text-center transition-colors duration-300 ${
              index === currentStep
                ? "text-gray-800 font-semibold"
                : "text-gray-500"
            }`}
          >
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
}
