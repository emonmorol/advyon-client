import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '@/lib/api/api';
import { useCommunityStore } from '@/store/useCommunityStore';

vi.mock('@/lib/api/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const resetCommunityState = () => {
  useCommunityStore.setState({
    threads: [],
    currentThread: null,
    isLoading: false,
    isLoadingAssist: false,
    error: null,
    assistError: null,
    lastFetched: null,
    similarThreadSuggestions: [],
    smartTagSuggestions: [],
    answerSuggestion: '',
    legalReferenceSuggestions: [],
    aiThreadSummary: null,
    threadSummaryRequestId: 0,
    legalReferencesRequestId: 0,
  });
};

describe('useCommunityStore assist safety', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCommunityState();
  });

  it('does not overwrite fatal thread error state when thread summary fails', async () => {
    api.get.mockRejectedValueOnce({
      response: { data: { message: 'Summary service unavailable' } },
    });

    const result = await useCommunityStore.getState().fetchThreadSummary('thread-1');
    const state = useCommunityStore.getState();

    expect(result).toBeNull();
    expect(state.error).toBeNull();
    expect(state.assistError).toBe('Summary service unavailable');
    expect(state.aiThreadSummary).toBeNull();
  });

  it('clears previous summary immediately when a new summary fetch starts', async () => {
    let resolveRequest;
    api.get.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    useCommunityStore.setState({
      aiThreadSummary: { summary: 'Old summary', legalReferences: ['Old ref'] },
    });

    const pendingRequest = useCommunityStore
      .getState()
      .fetchThreadSummary('thread-2');

    expect(useCommunityStore.getState().aiThreadSummary).toBeNull();

    resolveRequest({
      data: { data: { summary: 'New summary', legalReferences: ['New ref'] } },
    });
    await pendingRequest;

    expect(useCommunityStore.getState().aiThreadSummary?.summary).toBe('New summary');
  });

  it('ignores stale summary responses from older thread requests', async () => {
    let resolveFirstRequest;
    let resolveSecondRequest;

    api.get.mockImplementation(
      (url) =>
        new Promise((resolve) => {
          if (url.includes('/threads/thread-a/summary-ai')) {
            resolveFirstRequest = resolve;
            return;
          }

          if (url.includes('/threads/thread-b/summary-ai')) {
            resolveSecondRequest = resolve;
          }
        }),
    );

    const firstPromise = useCommunityStore.getState().fetchThreadSummary('thread-a');
    const secondPromise = useCommunityStore.getState().fetchThreadSummary('thread-b');

    resolveSecondRequest({
      data: { data: { summary: 'Thread B summary', legalReferences: ['B ref'] } },
    });
    await secondPromise;

    resolveFirstRequest({
      data: { data: { summary: 'Thread A summary', legalReferences: ['A ref'] } },
    });
    const firstResult = await firstPromise;

    expect(firstResult).toBeNull();
    expect(useCommunityStore.getState().aiThreadSummary?.summary).toBe(
      'Thread B summary',
    );
  });

  it('clears and protects legal references from stale cross-thread responses', async () => {
    let resolveFirstRequest;
    let resolveSecondRequest;

    api.post.mockImplementation(
      (url) =>
        new Promise((resolve) => {
          if (url.endsWith('/assist/legal-references')) {
            if (!resolveFirstRequest) {
              resolveFirstRequest = resolve;
              return;
            }
            resolveSecondRequest = resolve;
          }
        }),
    );

    useCommunityStore.setState({ legalReferenceSuggestions: ['Old ref'] });

    const firstPromise = useCommunityStore.getState().fetchLegalReferences('A content');
    expect(useCommunityStore.getState().legalReferenceSuggestions).toEqual([]);

    const secondPromise = useCommunityStore.getState().fetchLegalReferences('B content');

    resolveSecondRequest({ data: { data: ['B ref'] } });
    await secondPromise;

    resolveFirstRequest({ data: { data: ['A ref'] } });
    const firstResult = await firstPromise;

    expect(firstResult).toEqual([]);
    expect(useCommunityStore.getState().legalReferenceSuggestions).toEqual(['B ref']);
  });
});
