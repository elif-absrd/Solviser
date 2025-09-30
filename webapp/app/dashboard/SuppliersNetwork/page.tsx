"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Phone,
  Mail,
  Globe,
  Facebook,
  Linkedin,
} from "lucide-react";

export default function SuppliersNetwork() {
  // 🔹 Full supplier list
  const [suppliers] = useState([
    {
      id: 1,
      name: "Global Wood Industries",
      contact: "Rajesh Sharma",
      value: "₹4.8 Cr",
      connections: 12,
      followers: 87,
      risk: { label: "Low Risk", score: 82, color: "text-green-600" },
      phone: "+91 9876543210",
      email: "contact@globalwood.com",
      state: "Maharashtra",
      city: "Mumbai",
    },
    {
      id: 2,
      name: "Timber Exports Ltd",
      contact: "Amit Patel",
      value: "₹2.3 Cr",
      connections: 8,
      followers: 56,
      risk: { label: "Moderate Risk", score: 68, color: "text-yellow-600" },
      phone: "+91 9988776655",
      email: "info@timberexports.com",
      state: "Gujarat",
      city: "Ahmedabad",
    },
    {
      id: 3,
      name: "PlyTech Industries",
      contact: "Priya Verma",
      value: "₹1.7 Cr",
      connections: 5,
      followers: 42,
      risk: { label: "High Risk", score: 38, color: "text-red-600" },
      phone: "+91 9123456789",
      email: "contact@plytech.in",
      state: "Karnataka",
      city: "Bangalore",
    },
    {
      id: 4,
      name: "Forest Supplies Pvt Ltd",
      contact: "Anil Kumar",
      value: "₹3.1 Cr",
      connections: 7,
      followers: 34,
      risk: { label: "Low Risk", score: 80, color: "text-green-600" },
      phone: "+91 9345671234",
      email: "info@forestsupplies.in",
      state: "Maharashtra",
      city: "Pune",
    },
    {
      id: 5,
      name: "Greenwood Exports",
      contact: "Meena Joshi",
      value: "₹2.8 Cr",
      connections: 10,
      followers: 67,
      risk: { label: "Moderate Risk", score: 60, color: "text-yellow-600" },
      phone: "+91 9765432100",
      email: "sales@greenwood.com",
      state: "Delhi",
      city: "New Delhi",
    },
  ]);

  // 🔹 Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 🔹 Collect unique filters
const uniqueStates = useMemo(() => {
  return ["Select State", ...Array.from(new Set(suppliers.map((s) => s.state))).sort()];
}, [suppliers]);
  

const uniqueCities = useMemo(() => {
  if (stateFilter === "All" || stateFilter === "Select State") {
    return ["Select City", ...Array.from(new Set(suppliers.map((s) => s.city))).sort()];
  }
  return [
    "Select City",
    ...Array.from(
      new Set(suppliers.filter((s) => s.state === stateFilter).map((s) => s.city))
    ).sort(),
  ];
}, [suppliers, stateFilter]);

const uniqueRisks = useMemo(() => {
  return ["All Ratings", ...Array.from(new Set(suppliers.map((s) => s.risk.label)))];
}, [suppliers]);

  // 🔹 Filtering logic
  const filteredSuppliers = suppliers.filter((s) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      s.contact.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.value.toLowerCase().includes(query);

    const matchesState =
      stateFilter === "All" || stateFilter === "Select State" || s.state === stateFilter;
    const matchesCity =
      cityFilter === "All" || cityFilter === "Select City" || s.city === cityFilter;
    const matchesRating =
      ratingFilter === "All" || ratingFilter === "All Ratings" || s.risk.label === ratingFilter;

    return matchesSearch && matchesState && matchesCity && matchesRating;
  });

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // 🔹 Clear Filters
  const clearFilters = () => {
    setSearchQuery("");
    setStateFilter("All");
    setCityFilter("All");
    setRatingFilter("All");
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Find Global Suppliers</h1>
      <p className="text-gray-600 mb-6">
        Search and connect with verified suppliers across the globe
      </p>

      {/* 🔹 Advanced Search */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Advanced Search</h2>

        {/* Product Search */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Search
        </label>
        <div className="relative mb-4">
          <input
            type="text"
            className="border rounded p-2 w-full pl-10"
            placeholder="Search for products (e.g., timber, plywood, wood panels)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              className="border rounded p-2 w-full"
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCityFilter("All");
                setCurrentPage(1);
              }}
            >
              {uniqueStates.map((st) => (
                <option key={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              className="border rounded p-2 w-full"
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {uniqueCities.map((ct) => (
                <option key={ct}>{ct}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Rating</label>
            <select
              className="border rounded p-2 w-full"
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {uniqueRisks.map((risk) => (
                <option key={risk}>{risk}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded flex items-center gap-2">
            <Search size={16} /> Search Suppliers
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* 🔹 Suppliers Grid */}
      <h2 className="text-lg font-semibold mb-4">
        Suppliers ({filteredSuppliers.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentSuppliers.map((s) => (
          <div
            key={s.id}
            className="p-6 bg-white shadow rounded-lg border flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mb-4">
              <span className="text-gray-400">🏭</span>
            </div>

            <h3 className="text-lg font-semibold">{s.name}</h3>
            <p className="text-gray-600">Contact: {s.contact}</p>

            <div className="mt-3 text-sm space-y-1">
              <p>
                Total Contract Value{" "}
                <span className="font-semibold">{s.value}</span>
              </p>
              <p>
                Connections {s.connections} | Followers {s.followers}
              </p>
            </div>

            {/* Risk Bar */}
            <div className="w-full mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className={s.risk.color}>{s.risk.label}</span>
                <span className={s.risk.color}>{s.risk.score}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${
                    s.risk.color.includes("green")
                      ? "bg-green-500"
                      : s.risk.color.includes("yellow")
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${s.risk.score}%` }}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-4 space-y-1 text-sm text-gray-600 w-full">
              <p className="flex items-center justify-center gap-2">
                <Phone size={14} /> {s.phone}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail size={14} /> {s.email}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 text-gray-500 mt-4">
              <Facebook className="cursor-pointer" size={18} />
              <Linkedin className="cursor-pointer" size={18} />
              <Globe className="cursor-pointer" size={18} />
            </div>

            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded">
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-red-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
