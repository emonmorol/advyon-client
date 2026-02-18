/**
 * @fileoverview MVP Admin Control Center page.
 * Tabbed interface with Users, Cases, Settings, Analytics, and Audit Logs.
 * Role-locked to admin/superAdmin via RequireRole wrapper in routes.
 */
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  useAdminUsers,
  useBulkUpdateUsers,
  useCaseOverview,
  useSystemSettings,
  useUpdateSystemSettings,
  useAdminAnalytics,
  useAuditLogs,
} from '@/services/admin/adminService';
import {
  Users, Shield, BarChart3, Settings, FileText, Trash2, Ban,
  CheckCircle, ChevronLeft, ChevronRight, Search, RefreshCw,
} from 'lucide-react';

// ─── Users Tab ───────────────────────────────────────────────────
function UsersTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const { data, isLoading, mutate } = useAdminUsers({
    page,
    limit: 20,
    search: search || undefined,
    role: roleFilter || undefined,
  });

  const { trigger: bulkUpdate } = useBulkUpdateUsers();
  const users = data?.data || [];

  const handleBulk = async (action) => {
    if (selectedIds.length === 0) return;
    await bulkUpdate({ userIds: selectedIds, action });
    setSelectedIds([]);
    mutate();
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border bg-background text-sm"
        >
          <option value="">All Roles</option>
          <option value="superAdmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="lawyer">Lawyer</option>
          <option value="client">Client</option>
          <option value="judge">Judge</option>
        </select>
        <button onClick={() => mutate()} className="p-2 rounded-lg border hover:bg-muted transition">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <button onClick={() => handleBulk('activate')} className="flex items-center gap-1 px-3 py-1 text-xs bg-emerald-500/10 text-emerald-600 rounded-md hover:bg-emerald-500/20">
            <CheckCircle className="h-3 w-3" /> Activate
          </button>
          <button onClick={() => handleBulk('block')} className="flex items-center gap-1 px-3 py-1 text-xs bg-amber-500/10 text-amber-600 rounded-md hover:bg-amber-500/20">
            <Ban className="h-3 w-3" /> Block
          </button>
          <button onClick={() => handleBulk('delete')} className="flex items-center gap-1 px-3 py-1 text-xs bg-red-500/10 text-red-600 rounded-md hover:bg-red-500/20">
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      )}

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" /></div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left w-10"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? users.map((u) => u._id) : [])} /></th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-muted/30 transition">
                  <td className="p-3"><input type="checkbox" checked={selectedIds.includes(user._id)} onChange={() => toggleSelect(user._id)} /></td>
                  <td className="p-3 font-medium">{user.fullName || '—'}</td>
                  <td className="p-3 text-muted-foreground">{user.email}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'superAdmin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : user.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>{user.role}</span></td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : user.status === 'blocked' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{user.status}</span></td>
                  <td className="p-3 text-muted-foreground">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-muted transition">
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={users.length < 20} className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-muted transition">
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Cases Tab ───────────────────────────────────────────────────
function CasesTab() {
  const { data, isLoading } = useCaseOverview();
  const overview = data?.data || {};

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Cases" value={overview.totalCases || 0} />
        <StatCard label="Active" value={overview.activeCases || 0} color="emerald" />
        <StatCard label="Pending" value={overview.pendingCases || 0} color="amber" />
        <StatCard label="In Review" value={overview.reviewCases || 0} color="blue" />
        <StatCard label="Closed" value={overview.closedCases || 0} color="purple" />
      </div>

      {/* Status Breakdown */}
      {overview.totalCases > 0 && (
        <div className="border rounded-xl p-4 bg-card">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Status Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(overview.casesByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary/60 rounded-full transition-all"
                    style={{ width: `${overview.totalCases > 0 ? (Number(count) / overview.totalCases * 100) : 0}%` }}
                  />
                </div>
                <span className="font-semibold w-8 text-right">{String(count)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Cases Table */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Recent Cases</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Case Number</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {(overview.recentCases || []).map((c) => (
                <tr key={c._id} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{c.caseNumber || '—'}</td>
                  <td className="p-3">{c.title || '—'}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-700'}`}>{c.status}</span></td>
                  <td className="p-3 text-muted-foreground">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
              {(!overview.recentCases || overview.recentCases.length === 0) && (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No cases found. Cases created by users will appear here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────
function SettingsTab() {
  const { data, isLoading, mutate } = useSystemSettings();
  const { trigger: updateSettings } = useUpdateSystemSettings();
  const settings = data?.data || {};
  const [saving, setSaving] = useState(false);

  const handleToggle = async (key, value) => {
    setSaving(true);
    try {
      await updateSettings({ [key]: value });
      mutate();
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureToggle = async (feature, value) => {
    setSaving(true);
    try {
      await updateSettings({ features: { ...settings.features, [feature]: value } });
      mutate();
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <SettingRow label="Site Name" description="Public name of the application">
        <span className="text-sm font-medium">{settings.siteName || 'Advyon'}</span>
      </SettingRow>
      <SettingRow label="Maintenance Mode" description="When enabled, only admins can access the site">
        <ToggleSwitch checked={settings.maintenanceMode} onChange={(v) => handleToggle('maintenanceMode', v)} disabled={saving} />
      </SettingRow>
      <SettingRow label="Allow Registration" description="Allow new users to register">
        <ToggleSwitch checked={settings.allowRegistration} onChange={(v) => handleToggle('allowRegistration', v)} disabled={saving} />
      </SettingRow>

      <h3 className="text-sm font-semibold pt-4 border-t">Feature Flags</h3>
      <SettingRow label="AI Tools" description="Enable AI-powered legal tools">
        <ToggleSwitch checked={settings.features?.aiTools} onChange={(v) => handleFeatureToggle('aiTools', v)} disabled={saving} />
      </SettingRow>
      <SettingRow label="Community Hub" description="Enable community discussion features">
        <ToggleSwitch checked={settings.features?.communityHub} onChange={(v) => handleFeatureToggle('communityHub', v)} disabled={saving} />
      </SettingRow>
      <SettingRow label="Billing" description="Enable billing and payment features">
        <ToggleSwitch checked={settings.features?.billing} onChange={(v) => handleFeatureToggle('billing', v)} disabled={saving} />
      </SettingRow>
      <SettingRow label="Notifications" description="Enable notification system">
        <ToggleSwitch checked={settings.features?.notifications} onChange={(v) => handleFeatureToggle('notifications', v)} disabled={saving} />
      </SettingRow>
    </div>
  );
}

// ─── Analytics Tab ───────────────────────────────────────────────
function AnalyticsTab() {
  const { data, isLoading } = useAdminAnalytics();
  const stats = data?.data || {};

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers || 0} />
        <StatCard label="Active Users" value={stats.activeUsers || 0} color="emerald" />
        <StatCard label="Total Cases" value={stats.totalCases || 0} color="blue" />
        <StatCard label="Total Documents" value={stats.totalDocuments || 0} color="purple" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Recent Registrations (30d)" value={stats.recentRegistrations || 0} color="indigo" />
        <div className="border rounded-xl p-4 bg-card">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Users by Role</h4>
          <div className="space-y-2">
            {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between text-sm">
                <span className="capitalize">{role}</span>
                <span className="font-semibold">{String(count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Audit Logs Tab ──────────────────────────────────────────────
function AuditLogsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs({ page, limit: 20 });
  const logs = data?.data?.data || data?.data || [];

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" /></div>;

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Actor</th>
              <th className="p-3 text-left">Target Type</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(logs) ? logs : []).map((log) => (
              <tr key={log._id} className="border-t hover:bg-muted/30">
                <td className="p-3 font-mono text-xs">{log.action}</td>
                <td className="p-3">{log.actorEmail || (log.actor?.email) || '—'}</td>
                <td className="p-3">{log.targetType || '—'}</td>
                <td className="p-3 text-muted-foreground">{log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
            {(!Array.isArray(logs) || logs.length === 0) && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No audit logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-muted transition">
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition">
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────
function StatCard({ label, value, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary/5 border-primary/20 text-primary',
    emerald: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-500/5 border-purple-500/20 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] || colorMap.primary}`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function AdminPanelPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Admin Control Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage users, cases, settings, and monitor system health.</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-lg">
          <TabsTrigger value="users" className="flex items-center gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" /> Users
          </TabsTrigger>
          <TabsTrigger value="cases" className="flex items-center gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" /> Cases
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" /> Settings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-1.5 text-xs">
            <Shield className="h-3.5 w-3.5" /> Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6"><UsersTab /></TabsContent>
        <TabsContent value="cases" className="mt-6"><CasesTab /></TabsContent>
        <TabsContent value="settings" className="mt-6"><SettingsTab /></TabsContent>
        <TabsContent value="analytics" className="mt-6"><AnalyticsTab /></TabsContent>
        <TabsContent value="audit" className="mt-6"><AuditLogsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
