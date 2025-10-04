import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface DropdownOption {
  id: number;
  value: string;
  label: string;
  description?: string;
  metadata?: any;
}

interface ContractTemplate {
  id: number;
  name: string;
  type: string;
  generalTerms?: string;
  shippingTerms?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  disputeTerms?: string;
  otherTerms?: string;
  isDefault: boolean;
}

export const useContractDropdowns = () => {
  const [dropdowns, setDropdowns] = useState<{[key: string]: DropdownOption[]}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDropdownOptions = async (category: string) => {
    try {
      const response = await api.get(`/contracts/dropdown-options/${category}`);
      return response.data.options;
    } catch (err) {
      console.error(`Error fetching ${category} options:`, err);
      // Fallback data for development (reduced to avoid confusion)
      const fallbackData: {[key: string]: DropdownOption[]} = {
        item_types: [
          { id: 1, value: 'pine_wood', label: 'Pine Wood' },
          { id: 2, value: 'hardwood', label: 'Hardwood' },
          { id: 3, value: 'teak_wood', label: 'Teak Wood' }
        ],
        origins: [
          { id: 1, value: 'uruguay', label: 'Uruguay' },
          { id: 2, value: 'new_zealand', label: 'New Zealand' },
          { id: 3, value: 'australia', label: 'Australia' }
        ],
        sub_categories: [
          { id: 1, value: 'lumbers', label: 'Lumbers' },
          { id: 2, value: 'logs_unedged', label: 'Logs Unedged' }
        ],
        incoterms: [
          { id: 1, value: 'cif', label: 'CIF (Cost, Insurance, and Freight)' },
          { id: 2, value: 'cfr', label: 'CFR (Cost and Freight)' },
          { id: 3, value: 'fob', label: 'FOB (Free on Board)' }
        ],
        payment_terms: [
          { id: 1, value: 'lc', label: 'Letter of Credit (L/C)' },
          { id: 2, value: 'dp', label: 'Document against Payment (D/P)' },
          { id: 3, value: 'wire_transfer', label: 'Wire Transfer' }
        ],
        payment_periods: [
          { id: 1, value: '30_days', label: '30 Days' },
          { id: 2, value: '60_days', label: '60 Days' },
          { id: 3, value: '90_days', label: '90 Days' }
        ],
        countries: [
          { id: 1, value: 'india', label: 'India' },
          { id: 2, value: 'usa', label: 'United States' },
          { id: 3, value: 'singapore', label: 'Singapore' }
        ]
      };
      console.log(`Using fallback data for ${category}`);
      return fallbackData[category] || [];
    }
  };

  const loadAllDropdowns = async () => {
    setLoading(true);
    try {
      const categories = [
        'item_types', 
        'origins', 
        'sub_categories', 
        'incoterms', 
        'payment_terms', 
        'payment_periods', 
        'countries'
      ];

      const dropdownPromises = categories.map(async (category) => {
        const options = await fetchDropdownOptions(category);
        return { category, options };
      });

      const results = await Promise.all(dropdownPromises);
      
      const dropdownMap: {[key: string]: DropdownOption[]} = {};
      results.forEach(({ category, options }) => {
        dropdownMap[category] = options;
      });

      setDropdowns(dropdownMap);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Failed to load dropdown options:', err);
      setError('Failed to load dropdown options, using fallback data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDropdowns();
  }, []);

  return { dropdowns, loading, error, refetch: loadAllDropdowns };
};

export const useContractTemplate = (type: string) => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/contracts/templates/${type}`);
        setTemplates(response.data);
      } catch (err: any) {
        console.error('Error fetching templates:', err);
        // Fallback template data for development
        const fallbackTemplate: ContractTemplate = {
          id: 1,
          name: 'Standard Import Contract',
          type: 'import',
          generalTerms: `This contract shall be valid between two parties.
Any modifications shall be made in writing and with mutual consent.
Relevant Indian/International laws shall apply.
Tax/Duty responsibilities of supplier/buyer shall be clearly specified.`,
          shippingTerms: `Risk and insurance responsibility determined according to shipping terms (CIF/CFR/CNF).
Delivery port/port of discharge shall be specified.
Penalty/conditions for late shipment.`,
          paymentTerms: `L/C or D/P rules; payment only upon accuracy of documents.
Document presentation period and banking procedures.
Interest on late payment (if applicable).`,
          deliveryTerms: `Packing specifications, supply window, partial deliveries terms.
Inspection and rejected shipment procedures.`,
          disputeTerms: `In case of disputes, first attempt negotiation, if unresolved then arbitration [location/rules] shall apply.
Time limits and expert panel provisions.`,
          otherTerms: `Force Majeure clause.
Confidentiality, IP policies.
Cancellations and termination clauses.`,
          isDefault: true
        };
        setTemplates([fallbackTemplate]);
        setError(null); // Don't show error for fallback data
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchTemplates();
    }
  }, [type]);

  // Return the first template (typically the default one) for easier use
  const template = templates.length > 0 ? templates[0] : null;

  return { template, templates, loading, error };
};