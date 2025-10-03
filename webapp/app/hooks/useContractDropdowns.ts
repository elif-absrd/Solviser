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
      return [];
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
        setError(err.response?.data?.error || 'Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchTemplates();
    }
  }, [type]);

  return { templates, loading, error };
};