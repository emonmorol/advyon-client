import React, { useState } from 'react';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCommunityStore } from '@/store/useCommunityStore';
import { createThreadSchema } from '@/features/community/schemas/communitySchemas';

const CreateThreadModal = ({ onClose, onSuccess, categories }) => {
    const selectableCategories = (categories || []).filter((category) => category.id !== 'all');
    const [formData, setFormData] = useState({
        title: '',
        category: selectableCategories?.[0]?.id || 'family',
        content: '',
        tags: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const {
        createThread,
        fetchSmartTags,
        fetchSimilarThreads,
        smartTagSuggestions,
        similarThreadSuggestions,
        isLoadingAssist,
    } = useCommunityStore();
    const titleLength = formData.title.trim().length;
    const contentLength = formData.content.trim().length;
    const canUseAssist = titleLength >= 5 && contentLength >= 10;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            const payload = {
                title: formData.title,
                category: formData.category,
                content: formData.content,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            const parsed = createThreadSchema.safeParse(payload);
            if (!parsed.success) {
                const nextFieldErrors = {};
                parsed.error.issues.forEach((issue) => {
                    const key = issue.path?.[0];
                    if (key && !nextFieldErrors[key]) {
                        nextFieldErrors[key] = issue.message;
                    }
                });
                setFieldErrors(nextFieldErrors);
                setError(parsed.error.issues?.[0]?.message || 'Please fix the highlighted fields.');
                setIsSubmitting(false);
                return;
            }

            const newThread = await createThread(payload);

            console.log("Thread created successfully:", newThread);
            if (onSuccess) onSuccess(newThread);
            onClose();
        } catch (err) {
            console.error("Failed to create thread:", err);
            setError(err.response?.data?.message || "Failed to post question. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuggestTags = async () => {
        if (!canUseAssist) {
            setError('Add at least 5 title characters and 10 detail characters to use AI assistance.');
            return;
        }

        try {
            await fetchSmartTags({
                title: formData.title,
                content: formData.content,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to suggest smart tags right now.');
        }
    };

    const handleSuggestSimilar = async () => {
        if (!canUseAssist) {
            setError('Add at least 5 title characters and 10 detail characters to use AI assistance.');
            return;
        }

        try {
            await fetchSimilarThreads({
                title: formData.title,
                content: formData.content,
                limit: 5,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to suggest similar threads right now.');
        }
    };

    const applySuggestedTag = (tag) => {
        const currentTags = formData.tags
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);

        if (currentTags.includes(tag)) return;

        setFormData({
            ...formData,
            tags: [...currentTags, tag].join(', '),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-lg m-4 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-foreground mb-6">Ask a Question</h2>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Question Title</label>
                        <input
                            type="text"
                            required
                            placeholder="What's your legal question?"
                            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        {fieldErrors.title && <p className="text-xs text-destructive">{fieldErrors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Category</label>
                        <select
                            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {selectableCategories?.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                        {fieldErrors.category && <p className="text-xs text-destructive">{fieldErrors.category}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Details</label>
                        <textarea
                            required
                            rows={5}
                            placeholder="Describe your situation in detail..."
                            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                        {fieldErrors.content && <p className="text-xs text-destructive">{fieldErrors.content}</p>}
                        <div className="flex flex-wrap gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleSuggestSimilar}
                                disabled={isLoadingAssist || !canUseAssist}
                                className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
                            >
                                {isLoadingAssist ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                Suggest Similar Threads
                            </button>
                            <button
                                type="button"
                                onClick={handleSuggestTags}
                                disabled={isLoadingAssist || !canUseAssist}
                                className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
                            >
                                {isLoadingAssist ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                Suggest Smart Tags
                            </button>
                        </div>
                    </div>

                    {similarThreadSuggestions?.length > 0 && (
                        <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Similar Threads
                            </p>
                            <div className="space-y-2">
                                {similarThreadSuggestions.map((thread) => (
                                    <Link
                                        key={thread._id}
                                        to={`/dashboard/community/thread/${thread._id}`}
                                        className="block rounded-md border border-border px-2 py-1 text-sm hover:bg-accent/20"
                                        onClick={onClose}
                                    >
                                        <p className="font-medium">{thread.title}</p>
                                        <p className="text-xs text-muted-foreground">{thread.category}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {smartTagSuggestions?.length > 0 && (
                        <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Smart Tag Suggestions
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {smartTagSuggestions.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => applySuggestedTag(tag)}
                                        className="rounded-full border border-input px-2.5 py-1 text-xs hover:bg-accent/20"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g., divorce, custody, property"
                            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                        {fieldErrors.tags && <p className="text-xs text-destructive">{fieldErrors.tags}</p>}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors border border-transparent hover:border-border"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            Post Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateThreadModal;
