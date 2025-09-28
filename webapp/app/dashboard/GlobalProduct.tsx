"use client";

const products = [
  { name: "Wholesale & Retail Stores", value: "15k" },
  { name: "E-commerce Startups", value: "5k" },
  { name: "Grocery Shops", value: "30k" },
  { name: "Pharmacies", value: "100k" },
  { name: "Stationery & Bookstores", value: "15k" },
  { name: "Textile & Garments", value: "15k" },
  { name: "Food Processing", value: "5k" },
  { name: "Furniture Manufacturing", value: "30k" },
  { name: "Plastic Products", value: "30k" },
  { name: "Handicrafts & Handlooms", value: "15k" },
  { name: "Agro-based Industries", value: "15k" },
  { name: "Automobile Components", value: "5k" },
  { name: "Paper & Packaging", value: "30k" },
  { name: "Electronics Assembly", value: "30k" },
  { name: "Steel Fabrication", value: "15k" },
  { name: "Business Consultancy", value: "15k" },
  { name: "Courier & Logistics", value: "15k" },
  { name: "Travel & Tourism Services", value: "30k" },
  { name: "Dairy Farming", value: "30k" },
  { name: "Organic Farming", value: "15k" },
];

export default function GlobalProducts() {
  return (
    <main className="p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Global Product List</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((p, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-lg p-4 text-center border hover:shadow-lg cursor-pointer"
          >
            <h3 className="text-sm font-medium mb-2">{p.name}</h3>
            <p className="text-orange-600 font-bold">{p.value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
