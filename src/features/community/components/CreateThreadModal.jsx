import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

const CreateThreadModal = ({ onClose, onSuccess, categories }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: categories?.[0]?.id || 'general',
        content: '',
        tags: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newThread = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                createdAt: new Date().toISOString(),
                author: {
                    name: "Current User", // Mock
                    role: "User",
                    avatar: "https://i.pravatar.cc/150?u=me"
                }
            };

            console.log("New thread created:", newThread);
            if (onSuccess) onSuccess(newThread);
            onClose();
        } catch (err) {
            console.error("Failed to create thread:", err);
            setError("Failed to post question. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Category</label>
                        <select
                            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories?.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g., divorce, custody, property"
                            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
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
