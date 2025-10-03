import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const contractDropdownData = [
  {
    category: 'item_types',
    description: 'Types of items for contracts',
    options: [
      { value: 'pine_wood', label: 'Pine Wood', sortOrder: 1 },
      { value: 'hardwood', label: 'Hardwood', sortOrder: 2 },
      { value: 'teak_wood', label: 'Teak Wood', sortOrder: 3 },
      { value: 'furniture', label: 'Furniture', sortOrder: 4 },
      { value: 'textiles', label: 'Textiles', sortOrder: 5 },
      { value: 'electronics', label: 'Electronics', sortOrder: 6 }
    ]
  },
  {
    category: 'origins',
    description: 'Countries and regions of origin',
    options: [
      { value: 'uruguay', label: 'Uruguay', sortOrder: 1 },
      { value: 'new_zealand', label: 'New Zealand', sortOrder: 2 },
      { value: 'australia', label: 'Australia', sortOrder: 3 },
      { value: 'syp', label: 'Southern Yellow Pine (SYP)', sortOrder: 4 },
      { value: 'canada', label: 'Canada', sortOrder: 5 },
      { value: 'brazil', label: 'Brazil', sortOrder: 6 }
    ]
  },
  {
    category: 'sub_categories',
    description: 'Sub-categories for items',
    options: [
      { value: 'lumbers', label: 'Lumbers', sortOrder: 1 },
      { value: 'logs_unedged', label: 'Logs Unedged', sortOrder: 2 },
      { value: 'planks', label: 'Planks', sortOrder: 3 },
      { value: 'beams', label: 'Beams', sortOrder: 4 }
    ]
  },
  {
    category: 'incoterms',
    description: 'International commercial terms',
    options: [
      { value: 'cif', label: 'CIF (Cost, Insurance, and Freight)', sortOrder: 1 },
      { value: 'cfr', label: 'CFR (Cost and Freight)', sortOrder: 2 },
      { value: 'cnf', label: 'CNF (Cost and Freight)', sortOrder: 3 },
      { value: 'fob', label: 'FOB (Free on Board)', sortOrder: 4 },
      { value: 'exw', label: 'EXW (Ex Works)', sortOrder: 5 },
      { value: 'ddp', label: 'DDP (Delivered Duty Paid)', sortOrder: 6 }
    ]
  },
  {
    category: 'payment_terms',
    description: 'Payment methods and terms',
    options: [
      { value: 'lc', label: 'Letter of Credit (L/C)', sortOrder: 1 },
      { value: 'dp', label: 'Document against Payment (D/P)', sortOrder: 2 },
      { value: 'da', label: 'Document against Acceptance (D/A)', sortOrder: 3 },
      { value: 'wire_transfer', label: 'Wire Transfer', sortOrder: 4 },
      { value: 'bank_guarantee', label: 'Bank Guarantee', sortOrder: 5 }
    ]
  },
  {
    category: 'payment_periods',
    description: 'Payment period options',
    options: [
      { value: '30_days', label: '30 Days', sortOrder: 1 },
      { value: '60_days', label: '60 Days', sortOrder: 2 },
      { value: '90_days', label: '90 Days', sortOrder: 3 },
      { value: '120_days', label: '120 Days', sortOrder: 4 },
      { value: '150_days', label: '150 Days', sortOrder: 5 },
      { value: '180_days', label: '180 Days', sortOrder: 6 }
    ]
  },
  {
    category: 'countries',
    description: 'Countries for bank details and shipping',
    options: [
      { value: 'india', label: 'India', sortOrder: 1 },
      { value: 'usa', label: 'United States', sortOrder: 2 },
      { value: 'uk', label: 'United Kingdom', sortOrder: 3 },
      { value: 'singapore', label: 'Singapore', sortOrder: 4 },
      { value: 'uae', label: 'United Arab Emirates', sortOrder: 5 },
      { value: 'australia', label: 'Australia', sortOrder: 6 }
    ]
  }
];

const contractTemplates = [
  {
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
  }
];

async function seedContractOptions() {
  console.log('Seeding contract dropdown options...');

  for (const categoryData of contractDropdownData) {
    const category = await prisma.contractDropdownCategory.upsert({
      where: { name: categoryData.category },
      update: { description: categoryData.description },
      create: {
        name: categoryData.category,
        description: categoryData.description
      }
    });

    for (const optionData of categoryData.options) {
      await prisma.contractDropdownOption.upsert({
        where: {
          id: -1 // This will always fail, so it will create
        },
        update: {},
        create: {
          categoryId: category.id,
          value: optionData.value,
          label: optionData.label,
          sortOrder: optionData.sortOrder
        }
      });
    }
  }

  // Seed contract templates
  for (const template of contractTemplates) {
    await prisma.contractTemplate.upsert({
      where: { id: -1 }, // This will always fail, so it will create
      update: {},
      create: template
    });
  }

  console.log('✅ Contract options and templates seeded successfully');
}

seedContractOptions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());