import { useState, useEffect } from 'react';
import api from '../lib/api';

interface DropdownOption {
  id: number;
  value: string;
  label: string;
  sortOrder: number;
}

interface ContractTemplate {
  id: number;
  name: string;
  type: string;
  generalTerms: string;
  shippingTerms: string;
  paymentTerms: string;
  deliveryTerms: string;
  disputeTerms: string;
  otherTerms: string;
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
      // Return fallback data if API is not available
      return getFallbackData(category);
    }
  };

  const getFallbackData = (category: string): DropdownOption[] => {
    const fallbackData: {[key: string]: DropdownOption[]} = {
      item_types: [
        { id: 1, value: 'pine_wood', label: 'Pine Wood', sortOrder: 1 },
        { id: 2, value: 'hardwood', label: 'Hardwood', sortOrder: 2 },
        { id: 3, value: 'teak_wood', label: 'Teak Wood', sortOrder: 3 },
        { id: 4, value: 'furniture', label: 'Furniture', sortOrder: 4 },
        { id: 5, value: 'textiles', label: 'Textiles', sortOrder: 5 },
        { id: 6, value: 'electronics', label: 'Electronics', sortOrder: 6 }
      ],
      origins: [
        { id: 1, value: 'uruguay', label: 'Uruguay', sortOrder: 1 },
        { id: 2, value: 'new_zealand', label: 'New Zealand', sortOrder: 2 },
        { id: 3, value: 'australia', label: 'Australia', sortOrder: 3 },
        { id: 4, value: 'syp', label: 'Southern Yellow Pine (SYP)', sortOrder: 4 },
        { id: 5, value: 'canada', label: 'Canada', sortOrder: 5 },
        { id: 6, value: 'brazil', label: 'Brazil', sortOrder: 6 }
      ],
      sub_categories: [
        { id: 1, value: 'lumbers', label: 'Lumbers', sortOrder: 1 },
        { id: 2, value: 'logs_unedged', label: 'Logs Unedged', sortOrder: 2 },
        { id: 3, value: 'planks', label: 'Planks', sortOrder: 3 },
        { id: 4, value: 'beams', label: 'Beams', sortOrder: 4 }
      ],
      incoterms: [
        { id: 1, value: 'cif', label: 'CIF (Cost, Insurance, and Freight)', sortOrder: 1 },
        { id: 2, value: 'cfr', label: 'CFR (Cost and Freight)', sortOrder: 2 },
        { id: 3, value: 'cnf', label: 'CNF (Cost and Freight)', sortOrder: 3 },
        { id: 4, value: 'fob', label: 'FOB (Free on Board)', sortOrder: 4 },
        { id: 5, value: 'exw', label: 'EXW (Ex Works)', sortOrder: 5 },
        { id: 6, value: 'ddp', label: 'DDP (Delivered Duty Paid)', sortOrder: 6 }
      ],
      payment_terms: [
        { id: 1, value: 'lc', label: 'Letter of Credit (L/C)', sortOrder: 1 },
        { id: 2, value: 'dp', label: 'Document against Payment (D/P)', sortOrder: 2 },
        { id: 3, value: 'da', label: 'Document against Acceptance (D/A)', sortOrder: 3 },
        { id: 4, value: 'wire_transfer', label: 'Wire Transfer', sortOrder: 4 },
        { id: 5, value: 'bank_guarantee', label: 'Bank Guarantee', sortOrder: 5 }
      ],
      payment_periods: [
        { id: 1, value: '30_days', label: '30 Days', sortOrder: 1 },
        { id: 2, value: '60_days', label: '60 Days', sortOrder: 2 },
        { id: 3, value: '90_days', label: '90 Days', sortOrder: 3 },
        { id: 4, value: '120_days', label: '120 Days', sortOrder: 4 },
        { id: 5, value: '150_days', label: '150 Days', sortOrder: 5 },
        { id: 6, value: '180_days', label: '180 Days', sortOrder: 6 }
      ],
      countries: [
        { id: 1, value: 'india', label: 'India', sortOrder: 1 },
        { id: 2, value: 'usa', label: 'United States', sortOrder: 2 },
        { id: 3, value: 'uk', label: 'United Kingdom', sortOrder: 3 },
        { id: 4, value: 'singapore', label: 'Singapore', sortOrder: 4 },
        { id: 5, value: 'uae', label: 'United Arab Emirates', sortOrder: 5 },
        { id: 6, value: 'australia', label: 'Australia', sortOrder: 6 }
      ]
    };
    return fallbackData[category] || [];
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
    } catch (err) {
      setError('Failed to load dropdown options');
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
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await api.get(`/contracts/templates/${type}`);
        if (response.data) {
          setTemplate(response.data);
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        // Use fallback template if API is not available
        setTemplate(getFallbackTemplate(type));
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchTemplate();
    }
  }, [type]);

  const getFallbackTemplate = (type: string): ContractTemplate => {
    return {
      id: 1,
      name: 'Standard Import Contract',
      type: type,
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
Cancellations and termination clauses.`
    };
  };

  return { template, loading };
};