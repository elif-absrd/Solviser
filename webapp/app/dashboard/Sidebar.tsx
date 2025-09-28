// app/dashboard/components/Sidebar.tsx

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "../hooks/use-user";

import {
  LayoutDashboard, Search, Users, Globe, BarChart3, FileText,
  Ban, Network, Package, ShoppingCart, Scale, Landmark, Menu,
  ShieldCheck, CreditCard, // Added new icons
} from "lucide-react";

// The full menuItems array with the new items
const menuItems = [
  { name: "My Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard", requiredPermission: 'dashboard.view' },
  { name: "Search Page", icon: <Search size={18} />, path: "/dashboard/search", requiredPermission: 'dashboard.view' },
  { name: "Find My Buyers", icon: <Users size={18} />, path: "/dashboard/FindMyBuyers", requiredPermission: 'buyers.find' },
  { name: "Global Product List", icon: <Globe size={18} />, path: "/dashboard/GlobalProducts", requiredPermission: 'products.view' },
  { name: "AI-Based Risk Analysis", icon: <BarChart3 size={18} />, path: "/dashboard/AIRiskAnalysis", requiredPermission: 'risk_report.view' },
  { name: "Smart Contract", icon: <FileText size={18} />, path: "/dashboard/SmartContract", requiredPermission: 'contract.create' },
  { name: "Centralized Buyers Blocklist", icon: <Ban size={18} />, path: "/dashboard/BuyersBlocklist", requiredPermission: 'blocklist.view' },
  { name: "Specific Suppliers Network", icon: <Network size={18} />, path: "/dashboard/SuppliersNetwork", requiredPermission: 'suppliers.view' },
  { name: "ERP Solution", icon: <Package size={18} />, path: "/dashboard/ERP", requiredPermission: 'erp.manage' },
  { name: "E-Commerce Page", icon: <ShoppingCart size={18} />, path: "/dashboard/ECommerce", requiredPermission: 'ecommerce.manage' },
  { name: "Legal Services", icon: <Scale size={18} />, path: "/dashboard/legal-providers", requiredPermission: 'legal.view' },
  { name: "Financial Services", icon: <Landmark size={18} />, path: "/dashboard/Financial", requiredPermission: 'financial.view' },
  { name: "Subscriptions & Billing", icon: <CreditCard size={18} />, path: "/dashboard/subscriptions", requiredPermission: 'billing.manage' },
  { name: "Access Management", icon: <ShieldCheck size={18} />, path: "/dashboard/access-management", requiredPermission: ['user.read','user.invite','user.delete','user.update.role','role.read','role.create','role.update','role.delete',] },
  { name: "Legal Service Onboarding", icon: <Scale size={18} />, path: "/dashboard/legal-service-onboarding", requiredPermission: 'legal.onboarding' },
];


export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  const userPermissions = new Set(user?.permissions || []);

  // --- UPDATED FILTERING LOGIC ---
  const accessibleMenuItems = menuItems.filter(item => {
    const { requiredPermission } = item;

    // If no permission is required, show the item
    if (!requiredPermission) {
      return true;
    }

    // If permission is an array, check if the user has AT LEAST ONE
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.some(permission => userPermissions.has(permission));
    }

    // Otherwise, check for a single permission string
    return userPermissions.has(requiredPermission);
  });

  if (isLoading) {
    // Return a skeleton loader while user data is being fetched
    return (
      <div className={`${open ? "w-64" : "w-16"} bg-white border-r shadow-sm flex flex-col transition-all duration-300 animate-pulse`}>
         <div className="p-4 border-b h-[61px]"></div>
         <div className="p-4 space-y-4">
            <div className="h-8 bg-gray-200 rounded-md"></div>
            <div className="h-8 bg-gray-200 rounded-md"></div>
            <div className="h-8 bg-gray-200 rounded-md"></div>
         </div>
      </div>
    )
  }

  return (
    <div className={`${open ? "w-64" : "w-16"} bg-white border-r shadow-sm flex flex-col transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold text-orange-600">{open ? "SOLVISER" : "S"}</h1>
        <button onClick={() => setOpen(!open)}><Menu size={20} /></button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 text-sm space-y-2">
        {accessibleMenuItems.map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={idx}
              href={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-orange-600 text-white font-medium"
                  // Note the subtle change for consistent group naming in Tailwind JIT
                  : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
              }`}
            >
              {item.icon}
              {open && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}