import { useState, useEffect } from 'react';

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
      const response = await fetch(`/api/contracts/dropdown-options/${category}`);
      if (!response.ok) throw new Error('Failed to fetch dropdown options');
      const data = await response.json();
      return data.options;
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
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/contracts/templates/${type}`);
        if (response.ok) {
          const data = await response.json();
          setTemplate(data);
        }
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchTemplate();
    }
  }, [type]);

  return { template, loading };
};