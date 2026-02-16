import React, { useEffect, useMemo, useState } from 'react';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { aiToolInputSchema } from '@/features/community/schemas/communitySchemas';

const TOOL_CONFIG = [
  {
    key: 'contract-analyzer',
    label: 'Contract Analyzer',
    description: 'Review obligations, ambiguities, and legal risk areas.',
    placeholder:
      'Paste contract clauses or key points you want to analyze for legal risks.',
  },
  {
    key: 'document-generator',
    label: 'Document Generator',
    description: 'Draft legal documents from facts and requirements.',
    placeholder: 'Describe the document type, parties, and required sections.',
  },
  {
    key: 'case-law-researcher',
    label: 'Case Law Researcher',
    description: 'Get case-law research guidance and citation directions.',
    placeholder:
      'Describe jurisdiction, legal issue, and what precedents you need.',
  },
  {
    key: 'legal-writing-assistant',
    label: 'Legal Writing Assistant',
    description: 'Improve structure, clarity, and persuasive legal writing.',
    placeholder:
      'Paste your legal paragraph or section and specify tone/quality goals.',
  },
  {
    key: 'deposition-summarizer',
    label: 'Deposition Summarizer',
    description: 'Summarize testimony, key admissions, and contradictions.',
    placeholder: 'Paste deposition text and ask for chronology and key findings.',
  },
  {
    key: 'brief-analyzer',
    label: 'Brief Analyzer',
    description: 'Assess legal briefs for argument and authority gaps.',
    placeholder:
      'Paste your brief content and request a strength-gap analysis.',
  },
];

const TOOL_FLAGS = {
  'contract-analyzer': import.meta.env.VITE_AI_TOOL_CONTRACT_ANALYZER !== 'false',
  'document-generator': import.meta.env.VITE_AI_TOOL_DOCUMENT_GENERATOR !== 'false',
  'case-law-researcher': import.meta.env.VITE_AI_TOOL_CASE_RESEARCHER !== 'false',
  'legal-writing-assistant':
    import.meta.env.VITE_AI_TOOL_WRITING_ASSISTANT !== 'false',
  'deposition-summarizer':
    import.meta.env.VITE_AI_TOOL_DEPOSITION_SUMMARIZER !== 'false',
  'brief-analyzer': import.meta.env.VITE_AI_TOOL_BRIEF_ANALYZER !== 'false',
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleString();
};

const AIToolsPage = () => {
  const enabledTools = useMemo(
    () => TOOL_CONFIG.filter((tool) => TOOL_FLAGS[tool.key]),
    [],
  );

  const [selectedTool, setSelectedTool] = useState(
    enabledTools[0]?.key || 'contract-analyzer',
  );
  const [historyToolFilter, setHistoryToolFilter] = useState('all');
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState('');

  const {
    runTool,
    fetchToolHistory,
    exportToolHistory,
    toolHistory,
    toolHistoryMeta,
    toolExecutionResult,
    toolUsage,
    isRunningTool,
    isLoadingToolHistory,
    error,
  } = useAIStore();

  const activeToolConfig =
    enabledTools.find((tool) => tool.key === selectedTool) || enabledTools[0];

  const loadHistory = async (page = 1) => {
    const params = {
      page,
      limit: 20,
      ...(historyToolFilter !== 'all' ? { toolKey: historyToolFilter } : {}),
    };
    await fetchToolHistory(params);
  };

  useEffect(() => {
    loadHistory(1).catch(() => {});
  }, [historyToolFilter]);

  const handleRunTool = async (event) => {
    event.preventDefault();
    const parsed = aiToolInputSchema.safeParse(input);
    if (!parsed.success) {
      setInputError(parsed.error.issues?.[0]?.message || 'Invalid tool input');
      return;
    }

    setInputError('');
    await runTool(selectedTool, input.trim());
    await loadHistory(1);
  };

  const handleExport = async (format) => {
    const exportTool =
      historyToolFilter !== 'all' ? historyToolFilter : selectedTool;
    const { blob } = await exportToolHistory(format, exportTool);

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ai-tools-history.${format}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!enabledTools.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h1 className="text-2xl font-bold">AI Tools</h1>
          <p className="mt-2 text-muted-foreground">
            AI tools are currently disabled by feature flags.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <header className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">AI Tools Workspace</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Run legal AI tools with policy guardrails, tracked usage, and exportable
          history.
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          Daily usage: {toolUsage.todayCount}/{toolUsage.dailyLimit || '-'}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7 rounded-2xl border border-border bg-card p-5">
          <label className="text-sm font-semibold text-foreground">Select Tool</label>
          <select
            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={selectedTool}
            onChange={(event) => setSelectedTool(event.target.value)}
          >
            {enabledTools.map((tool) => (
              <option key={tool.key} value={tool.key}>
                {tool.label}
              </option>
            ))}
          </select>

          <p className="mt-3 text-sm text-muted-foreground">
            {activeToolConfig?.description}
          </p>

          <form onSubmit={handleRunTool} className="mt-4 space-y-3">
            <textarea
              className="min-h-[220px] w-full rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder={activeToolConfig?.placeholder}
              value={input}
              onChange={(event) => {
                setInputError('');
                setInput(event.target.value);
              }}
            />
            {inputError && <p className="text-xs text-destructive">{inputError}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Legal and platform-only requests are accepted.
              </span>
              <button
                type="submit"
                disabled={isRunningTool || !input.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRunningTool && <Loader2 className="h-4 w-4 animate-spin" />}
                Run Tool
              </button>
            </div>
          </form>

          {(toolExecutionResult?.result || error) && (
            <div className="mt-5 rounded-lg border border-border bg-background p-4">
              <h2 className="text-sm font-semibold">Latest Output</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                {error || toolExecutionResult?.result}
              </p>
            </div>
          )}
        </section>

        <section className="lg:col-span-5 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Tool History</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExport('json')}
                className="inline-flex items-center gap-1 rounded-md border border-input px-2.5 py-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                JSON
              </button>
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="inline-flex items-center gap-1 rounded-md border border-input px-2.5 py-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
            </div>
          </div>

          <div className="mt-3">
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={historyToolFilter}
              onChange={(event) => setHistoryToolFilter(event.target.value)}
            >
              <option value="all">All Tools</option>
              {enabledTools.map((tool) => (
                <option key={tool.key} value={tool.key}>
                  {tool.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {isLoadingToolHistory ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading tool history...
              </div>
            ) : toolHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No AI tool runs yet for the selected filter.
              </p>
            ) : (
              toolHistory.map((item) => (
                <article
                  key={item._id}
                  className="rounded-lg border border-border bg-background p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.toolKey}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                    <span className="rounded-full border border-input px-2 py-0.5 text-xs">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    Input: {item.input}
                  </p>
                  <p className="mt-1 line-clamp-3 text-xs">
                    Output: {item.output}
                  </p>
                </article>
              ))
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Page {toolHistoryMeta.page} of {Math.max(toolHistoryMeta.totalPage || 1, 1)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border border-input px-2 py-1 disabled:opacity-50"
                disabled={toolHistoryMeta.page <= 1}
                onClick={() => loadHistory(toolHistoryMeta.page - 1)}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border border-input px-2 py-1 disabled:opacity-50"
                disabled={
                  toolHistoryMeta.page >=
                  Math.max(toolHistoryMeta.totalPage || 1, 1)
                }
                onClick={() => loadHistory(toolHistoryMeta.page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIToolsPage;
