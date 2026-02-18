import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AIToolsPage from '@/pages/dashboard/AIToolsPage';

const mockUseAIStore = vi.fn();

vi.mock('@/store/useAIStore', () => ({
  useAIStore: () => mockUseAIStore(),
}));

describe('AIToolsPage export behavior', () => {
  let exportToolHistory;

  beforeEach(() => {
    exportToolHistory = vi.fn().mockResolvedValue({
      blob: new Blob(['history']),
      contentType: 'application/json',
    });

    mockUseAIStore.mockReturnValue({
      runTool: vi.fn().mockResolvedValue({}),
      fetchToolHistory: vi.fn().mockResolvedValue({}),
      exportToolHistory,
      toolHistory: [],
      toolHistoryMeta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPage: 1,
      },
      toolExecutionResult: null,
      toolUsage: {
        todayCount: 0,
        dailyLimit: 10,
      },
      isRunningTool: false,
      isLoadingToolHistory: false,
      error: null,
    });

    URL.createObjectURL = vi.fn(() => 'blob:mock-history');
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  it("exports full history when 'All Tools' filter is selected", async () => {
    render(<AIToolsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'JSON' }));

    await waitFor(() => {
      expect(exportToolHistory).toHaveBeenCalledWith('json', undefined);
    });
  });

  it('exports filtered history when a specific tool is selected', async () => {
    render(<AIToolsPage />);

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'brief-analyzer' } });
    fireEvent.click(screen.getByRole('button', { name: 'JSON' }));

    await waitFor(() => {
      expect(exportToolHistory).toHaveBeenCalledWith('json', 'brief-analyzer');
    });
  });
});
