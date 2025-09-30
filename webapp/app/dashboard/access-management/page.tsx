// File: apps/webapp/src/app/dashboard/access-management/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useUser } from "../../hooks/use-user";
import { Plus, Trash2, Users, Save, X, RotateCcw, AlertCircle, ShieldCheck } from 'lucide-react';
import ForbiddenPage from '@/components/ForbiddenPage';

// --- Type Definitions ---
interface Permission {
  id: string;
  actionName: string;
  description: string | null;
}

interface Role {
  id: string;
  name: string;
  isSystemRole?: boolean;
  permissions: { permission: Permission }[];
  _count?: { users: number }; // Made optional as system roles won't have this
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: { role: Pick<Role, 'id' | 'name'> }[];
}

// --- Prop Type Definitions ---
type RoleListProps = { roles: Role[], selectedRole: Role | null, onSelectRole: (role: Role) => void, onRoleCreate: (role: Role) => void };
type UserListProps = { users: User[], onSelectUser: (user: User) => void };
type RoleEditorProps = { role: Role, allPermissions: Permission[], onRoleUpdate: (role: Role) => void, onRoleDelete: (roleId: string) => void };
type PlanEditorProps = { plan: Role, allPermissions: Permission[], onPlanUpdate: (plan: Role) => void };
type UserRoleModalProps = { user: User, roles: Role[], onClose: () => void, onUserUpdate: (user: User) => void };

// --- Main Page Component ---
export default function AccessManagementPage() {
  const { user: currentUser, isLoading: isUserLoading } = useUser(); // Get current user
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'plans'>('roles');
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [systemRoles, setSystemRoles] = useState<Role[]>([]); // --- NEW: State for System Roles ---
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Role | null>(null); // --- NEW: State for selected plan ---
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  // --- MODIFIED: useEffect to fetch admin data conditionally ---
  useEffect(() => {
    if (isUserLoading) return; // Wait until we know who the user is

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setIsForbidden(false);
      try {
        // Standard data for all users with access
        const [rolesRes, usersRes, permissionsRes] = await Promise.all([
          api.get('/rbac/roles'),
          api.get('/rbac/users'),
          api.get('/rbac/permissions')
        ]);
        setRoles(rolesRes.data);
        setUsers(usersRes.data);
        setPermissions(permissionsRes.data);

        // --- NEW: Fetch system roles only if user is a super admin ---
        if (currentUser?.isSuperAdmin) {
            const systemRolesRes = await api.get('/admin/system-roles');
            setSystemRoles(systemRolesRes.data);
        }
      } catch (err: any) {
        if (err.response?.status === 403) setIsForbidden(true);
        else setError(err.response?.data?.error || "Failed to load access management data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser, isUserLoading]); // Re-run if the user changes

  // --- State Updaters ---
  const onRoleUpdate = (updatedRole: Role) => {
    setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
    setSelectedRole(updatedRole);
  };
  const onPlanUpdate = (updatedPlan: Role) => {
    setSystemRoles(systemRoles.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    setSelectedPlan(updatedPlan);
  };
  const onRoleCreate = (newRole: Role) => {
    setRoles([...roles, newRole]);
    setSelectedRole(newRole);
  };
  const onRoleDelete = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId));
    setSelectedRole(null);
  };
  const onUserUpdate = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(null);
  };

  if (isLoading || isUserLoading) {
    return <div className="flex items-center justify-center p-8"><RotateCcw className="w-8 h-8 animate-spin text-[#f05134]" /></div>;
  }
  if (isForbidden) return <ForbiddenPage />;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg m-8 flex items-center gap-3"><AlertCircle size={20} /><p>{error}</p></div>;

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Management</h1>
      <p className="text-gray-600 mb-6">Manage roles, permissions, and plan features for your platform.</p>

      {/* --- MODIFIED: Add new tab for Super Admins --- */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <TabButton name="Role Management" active={activeTab === 'roles'} onClick={() => { setActiveTab('roles'); setSelectedPlan(null); }} />
          <TabButton name="User Assignments" active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setSelectedRole(null); setSelectedPlan(null); }} />
          {currentUser?.isSuperAdmin && (
            <TabButton name="Plan Permissions" active={activeTab === 'plans'} onClick={() => { setActiveTab('plans'); setSelectedRole(null); }} />
          )}
        </nav>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          {activeTab === 'roles' && <RoleList roles={roles} selectedRole={selectedRole} onSelectRole={setSelectedRole} onRoleCreate={onRoleCreate} />}
          {activeTab === 'users' && <UserList users={users} onSelectUser={setSelectedUser} />}
          {activeTab === 'plans' && <PlanList plans={systemRoles} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />}
        </div>

        <div className="lg:col-span-2">
          {activeTab === 'roles' && (selectedRole ? <RoleEditor key={selectedRole.id} role={selectedRole} allPermissions={permissions} onRoleUpdate={onRoleUpdate} onRoleDelete={onRoleDelete} /> : <Placeholder text="Select a custom role to view or edit its permissions." />)}
          {activeTab === 'plans' && (selectedPlan ? <PlanEditor key={selectedPlan.id} plan={selectedPlan} allPermissions={permissions} onPlanUpdate={onPlanUpdate} /> : <Placeholder text="Select a subscription plan to edit its base permissions." />)}
          {activeTab === 'users' && !selectedUser && <Placeholder text="Select a user from the list to manage their role assignments." />}
        </div>
      </div>
      
      {selectedUser && <UserRoleModal user={selectedUser} roles={roles} onClose={() => setSelectedUser(null)} onUserUpdate={onUserUpdate} />}
    </div>
  );
}

// --- Helper Components ---
const TabButton = ({ name, active, onClick }: { name: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${active ? 'border-[#f05134] text-[#f05134]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {name}
    </button>
);

const Placeholder = ({ text }: { text: string }) => (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl p-8 text-gray-500">
        <p>{text}</p>
    </div>
);

// --- Components for Custom Role Management ---
const RoleList = ({ roles, selectedRole, onSelectRole, onRoleCreate }: RoleListProps) => {
    const handleCreateRole = async () => {
        const newRoleName = prompt("Enter the name for the new role:");
        if (newRoleName) {
            try {
                const response = await api.post('/rbac/roles', { name: newRoleName, permissionIds: [] });
                onRoleCreate(response.data);
            } catch (err: any) {
                alert(err.response?.data?.error || "Failed to create role.");
            }
        }
    };
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Custom Roles</h2>
                <button onClick={handleCreateRole} className="flex items-center gap-2 text-sm bg-[#f05134] text-white py-1 px-3 rounded-md hover:bg-opacity-90">
                    <Plus size={16} /> New Role
                </button>
            </div>
            <ul className="space-y-2">
                {roles.map((role) => (
                    <li key={role.id} onClick={() => onSelectRole(role)} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedRole?.id === role.id ? 'bg-[#f05134]/10 text-[#f05134]' : 'hover:bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">{role.name}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={12} /> {role._count?.users}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const UserList = ({ users, onSelectUser }: UserListProps) => (
    <div>
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <ul className="space-y-2">
            {users.map((user) => (
                <li key={user.id} onClick={() => onSelectUser(user)} className="p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </li>
            ))}
        </ul>
    </div>
);

const RoleEditor = ({ role, allPermissions, onRoleUpdate, onRoleDelete }: RoleEditorProps) => {
    const [roleName, setRoleName] = useState(role.name);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
        new Set(role.permissions?.map((p) => p.permission.id) ?? [])
    );
    const [isSaving, setIsSaving] = useState(false);
    const isSystemRole = role.isSystemRole;

    const handlePermissionToggle = (permissionId: string) => {
        if (isSystemRole) return;
        const newSelection = new Set(selectedPermissions);
        if (newSelection.has(permissionId)) {
            newSelection.delete(permissionId);
        } else {
            newSelection.add(permissionId);
        }
        setSelectedPermissions(newSelection);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await api.patch(`/rbac/roles/${role.id}`, {
                name: roleName,
                permissionIds: Array.from(selectedPermissions)
            });
            onRoleUpdate(response.data);
            alert("Role updated successfully!");
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to update role.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = async () => {
        if(confirm(`Are you sure you want to delete the "${role.name}" role? This action cannot be undone.`)) {
            try {
                await api.delete(`/rbac/roles/${role.id}`);
                onRoleDelete(role.id);
                alert("Role deleted successfully!");
            } catch(err: any) {
                 alert(err.response?.data?.error || "Failed to delete role.");
            }
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} disabled={isSystemRole} className="text-xl font-bold p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f05134] disabled:bg-transparent disabled:cursor-not-allowed" />
                {!isSystemRole && (
                    <div className="flex items-center gap-2">
                        <button onClick={handleDelete} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"><Trash2 size={18} /></button>
                        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 text-sm bg-[#f05134] text-white py-2 px-4 rounded-md hover:bg-opacity-90 disabled:opacity-50">
                            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
            
            {isSystemRole && <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-md mb-4">This is a system role. Its permissions are managed by the subscription plan and cannot be edited here.</p>}

            <h3 className="font-semibold text-gray-700 mb-4">Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPermissions.map((permission) => (
                    <label key={permission.id} htmlFor={permission.id} className={`flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 ${isSystemRole ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                        <input
                            type="checkbox"
                            id={permission.id}
                            checked={selectedPermissions.has(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            disabled={isSystemRole}
                            className="h-4 w-4 rounded border-gray-300 text-[#f05134] focus:ring-[#f05134] disabled:cursor-not-allowed"
                        />
                        <div>
                            <span className="font-medium text-sm text-gray-800">{permission.actionName}</span>
                            <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

const UserRoleModal = ({ user, roles, onClose, onUserUpdate }: UserRoleModalProps) => {
    const assignableRoles = roles.filter((r) => !r.isSystemRole);
    const [selectedRoles, setSelectedRoles] = useState<Set<string>>(
        new Set(user.roles.map((r) => r.role.id))
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleRoleToggle = (roleId: string) => {
        const newSelection = new Set(selectedRoles);
        if (newSelection.has(roleId)) {
            newSelection.delete(roleId);
        } else {
            newSelection.add(roleId);
        }
        setSelectedRoles(newSelection);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await api.patch(`/rbac/users/${user.id}/roles`, {
                roleIds: Array.from(selectedRoles)
            });
            onUserUpdate(response.data);
            alert("User roles updated successfully!");
        } catch(err: any) {
            alert(err.response?.data?.error || "Failed to update user roles.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Manage Roles for {user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <h3 className="font-semibold text-gray-700 mb-4">Assign Custom Roles</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignableRoles.map((role) => (
                            <label key={role.id} htmlFor={`modal-${role.id}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id={`modal-${role.id}`}
                                    checked={selectedRoles.has(role.id)}
                                    onChange={() => handleRoleToggle(role.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#f05134] focus:ring-[#f05134]"
                                />
                                <div>
                                    <span className="font-medium text-sm text-gray-800">{role.name}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-[#f05134] text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- NEW: Components for Plan Permission Editing ---
const PlanList = ({ plans, selectedPlan, onSelectPlan }: { plans: Role[], selectedPlan: Role | null, onSelectPlan: (plan: Role) => void }) => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Subscription Plans</h2>
            <span className="text-xs text-gray-500 flex items-center gap-1"><ShieldCheck size={14} /> System Roles</span>
        </div>
        <ul className="space-y-2">
            {plans.map((plan) => (
                <li key={plan.id} onClick={() => onSelectPlan(plan)} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedPlan?.id === plan.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}>
                    <span className="font-medium">{plan.name}</span>
                </li>
            ))}
        </ul>
    </div>
);

const PlanEditor = ({ plan, allPermissions, onPlanUpdate }: PlanEditorProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set(plan.permissions?.map(p => p.permission.id) ?? []));
  const [isSaving, setIsSaving] = useState(false);

  const handlePermissionToggle = (permissionId: string) => {
    const newSelection = new Set(selectedPermissions);
    if (newSelection.has(permissionId)) newSelection.delete(permissionId);
    else newSelection.add(permissionId);
    setSelectedPermissions(newSelection);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Use the new admin endpoint to update the system role (plan)
      await api.patch(`/admin/system-roles/${plan.id}/permissions`, {
        permissionIds: Array.from(selectedPermissions)
      });
      // Refetch the role to get the updated permissions list shape, which is needed to re-render the editor correctly
      const updatedPlanResponse = await api.get(`/admin/system-roles/${plan.id}`);
      onPlanUpdate(updatedPlanResponse.data);
      alert("Plan permissions updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update plan permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold p-2 -ml-2">{plan.name}</h2>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 text-sm bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
          <Save size={16} /> {isSaving ? 'Saving...' : 'Save Plan Changes'}
        </button>
      </div>
      <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-md mb-6">You are editing the base permissions for the <strong>{plan.name}</strong> subscription plan. These changes will affect all organizations on this plan.</p>
      <h3 className="font-semibold text-gray-700 mb-4">Enabled Permissions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allPermissions.map((permission) => (
          <label key={permission.id} htmlFor={`plan-${permission.id}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
            <input type="checkbox" id={`plan-${permission.id}`} checked={selectedPermissions.has(permission.id)} onChange={() => handlePermissionToggle(permission.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <div>
              <span className="font-medium text-sm text-gray-800">{permission.actionName}</span>
              <p className="text-xs text-gray-500">{permission.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};