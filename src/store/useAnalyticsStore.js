import { create } from 'zustand';
import api from '@/lib/api/api';

/**
 * Phase 5: Analytics Store
 * Manages analytics overview data
 */
export const useAnalyticsStore = create((set) => ({
  stats: null,
  caseDistribution: [],
  upcomingDeadlines: [],
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const [caseResponse, clientResponse, deadlinesResponse] = await Promise.all([
        api.get('/analytics/metrics/cases'),
        api.get('/analytics/metrics/clients'),
        api.get('/analytics/metrics/deadlines', { params: { limit: 5 } }),
      ]);

      const caseMetrics = caseResponse?.data?.data || caseResponse?.data || {};
      const clientMetrics = clientResponse?.data?.data || clientResponse?.data || {};
      const deadlines = deadlinesResponse?.data?.data || deadlinesResponse?.data || [];

      const summary = caseMetrics?.summary || {};
      const totalCases = summary?.totalCases || 0;
      const rawDistribution = caseMetrics?.caseDistribution || [];

      const caseDistribution = rawDistribution.map((item) => ({
        area: item?.type || 'Unknown',
        percentage: totalCases > 0 ? Math.round((item.count / totalCases) * 100) : 0,
      }));

      const upcomingDeadlines = deadlines.map((item) => ({
        task: item?.description || `${item?.title || 'Case'} deadline`,
        case: item?.caseNumber
          ? `${item.caseNumber} - ${item?.title || 'Case'}`
          : item?.title || 'Case',
        date: item?.deadline,
        color: item?.urgency === 'high' ? 'red' : item?.urgency === 'medium' ? 'amber' : 'blue',
      }));

      const stats = {
        activeCases: summary?.activeCases || 0,
        totalClients: clientMetrics?.totalClients || 0,
        filingsDue: upcomingDeadlines.length,
        billableHours: 0,
      };

      set({ 
        stats,
        caseDistribution,
        upcomingDeadlines,
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
