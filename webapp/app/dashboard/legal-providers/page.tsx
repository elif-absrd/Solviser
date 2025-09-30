"use client";

import { useState, useEffect, useCallback } from "react";
import { Globe, Linkedin, Facebook, RotateCw, AlertCircle, Phone, Mail } from "lucide-react";
import api from '@/lib/api';

// Define the structure for a single provider
interface Provider {
    id: string;
    name: string;
    type: string;
    rating: number;
    city: string;
    address: string;
    phone: string;
    email: string;
    services: string[];
}

// Define the structure for the API's pagination response
interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export default function LegalProviders() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedCity, setSelectedCity] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const uniqueCities = ["All", "Mumbai", "New Delhi", "Bengaluru", "Noida", "Chandigarh"];

    const fetchProviders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/providers', {
                params: {
                    page: currentPage,
                    pageSize: 6,
                    city: selectedCity === "All" ? undefined : selectedCity,
                    search: searchQuery || undefined,
                }
            });
            setProviders(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            setError("Failed to fetch service providers.");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, selectedCity, searchQuery]);

    useEffect(() => {
        fetchProviders();
    }, [fetchProviders]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchProviders();
    };

    const handleClear = () => {
        setSearchQuery("");
        setSelectedCity("All");
        setCurrentPage(1);
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <h1 className="text-2xl font-bold">Legal & Service Providers</h1>
            <p className="text-gray-600 mb-6">Find and connect with verified professionals across India.</p>

            <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                {uniqueCities.map((city) => (
                    <button key={city} onClick={() => { setSelectedCity(city); setCurrentPage(1); }}
                        className={`px-4 py-2 text-sm rounded-full border whitespace-nowrap ${selectedCity === city ? "bg-[#f05134] text-white border-[#f05134]" : "bg-white text-gray-700 hover:border-gray-400"}`}>
                        {city}
                    </button>
                ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <input type="text" placeholder="Search by name, service, city..." className="border rounded-lg px-4 py-2 flex-1"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                <div className="flex gap-2">
                    <button onClick={handleSearch} className="bg-[#f05134] text-white px-6 py-2 rounded-lg">Search</button>
                    <button onClick={handleClear} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg">Clear</button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8"><RotateCw className="w-8 h-8 animate-spin text-[#f05134]" /></div>
            ) : error ? (
                <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-lg"><AlertCircle size={20} />{error}</div>
            ) : providers.length === 0 ? (
                <div className="text-center text-gray-500 p-8">No providers found matching your criteria.</div>
            ) : (
                <>
                    {/* --- UPDATED PROVIDER CARD GRID --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {providers.map((p) => (
                            <div key={p.id} className="p-5 bg-white shadow rounded-lg border flex flex-col">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    <img src={`https://i.pravatar.cc/150?u=${p.id}`} alt={p.name} className="w-14 h-14 rounded-full object-cover" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 truncate">{p.name}</h3>
                                        <p className="text-sm text-[#f05134] font-medium">{p.type}</p>
                                        <div className="flex items-center text-yellow-500 text-sm">
                                            {Array.from({ length: 5 }).map((_, i) => (<span key={i}>{i < Math.round(p.rating) ? "★" : "☆"}</span>))}
                                            <span className="text-gray-600 ml-1">({p.rating.toFixed(1)})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p className="flex items-start gap-2"><span>📍</span> {p.address}, {p.city}</p>
                                    <p className="flex items-center gap-2"><Phone size={14} /> {p.phone || 'Not available'}</p>
                                    <p className="flex items-center gap-2"><Mail size={14} /> {p.email || 'Not available'}</p>
                                </div>

                                {/* Services */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {p.services.slice(0, 3).map((s, idx) => (<span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{s}</span>))}
                                </div>
                                
                                {/* Footer */}
                                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                    <div className="flex gap-4 text-gray-400">
                                        <Globe size={18} className="cursor-pointer hover:text-gray-700"/>
                                        <Facebook size={18} className="cursor-pointer hover:text-gray-700"/>
                                        <Linkedin size={18} className="cursor-pointer hover:text-gray-700"/>
                                    </div>
                                    <button className="text-[#f05134] text-sm font-semibold flex items-center gap-1 hover:underline">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 space-x-2">
                            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50 bg-white">{"<"}</button>
                            <span className="px-4 py-1 text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
                            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pagination.totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50 bg-white">{">"}</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}