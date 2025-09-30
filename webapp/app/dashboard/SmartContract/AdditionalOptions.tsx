import React, { useState } from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
        enabled ? 'bg-red-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function AdditionalOptions() {
  const [options, setOptions] = useState({
    blockchainMode: false,
    autoReminders: true,
    aiMonitoring: true
  });

  const handleToggle = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
    
    // Here you would typically save the setting to the backend
    console.log(`${option} toggled to:`, !options[option]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Additional Options</h2>
      
      <div className="space-y-6">
        {/* Blockchain Mode */}
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h4 className="text-sm font-medium text-gray-800">Enable Blockchain Mode</h4>
            <p className="text-xs text-gray-600 mt-1">Add immutability to your contracts</p>
          </div>
          <ToggleSwitch
            enabled={options.blockchainMode}
            onChange={() => handleToggle('blockchainMode')}
          />
        </div>

        {/* Auto Reminders */}
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h4 className="text-sm font-medium text-gray-800">Auto Reminder Setup</h4>
            <p className="text-xs text-gray-600 mt-1">Automated email/SMS reminders</p>
          </div>
          <ToggleSwitch
            enabled={options.autoReminders}
            onChange={() => handleToggle('autoReminders')}
          />
        </div>

        {/* AI Monitoring */}
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h4 className="text-sm font-medium text-gray-800">AI Contract Health Monitoring</h4>
            <p className="text-xs text-gray-600 mt-1">Continuous risk monitoring</p>
          </div>
          <ToggleSwitch
            enabled={options.aiMonitoring}
            onChange={() => handleToggle('aiMonitoring')}
          />
        </div>
      </div>
    </div>
  );
}