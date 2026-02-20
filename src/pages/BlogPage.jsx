import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { PageHero } from '@/components/ui/PageHero';
import { GlassCard } from '@/components/ui/GlassCard';
import { Loader2 } from 'lucide-react';
import SystemBootLoader from '@/components/ui/SystemBootLoader';
import { useBootSequence } from '@/hooks/useBootSequence';

export default function BlogPage() {
  const { shouldBoot, completeBoot } = useBootSequence();

  if (shouldBoot) {
    return <SystemBootLoader onComplete={completeBoot} />;
  }

  return (
    <PublicPageLayout 
        title="Advyon Blog" 
        description="Insights, updates, and thought leadership from the Advyon team."
    >
        <PageHero 
            title="Insights"
            subtitle="Thoughts on the future of law, AI, and technology."
            badge="Coming Soon"
        />

        <section className="py-20">
            <div className="container mx-auto px-6 text-center">
                <GlassCard className="max-w-md mx-auto py-16">
                    <Loader2 className="h-12 w-12 text-teal-500 animate-spin mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">Blog Under Construction</h3>
                    <p className="text-emerald-100/60">
                        Our editors are hard at work crafting the first batch of articles. Check back soon!
                    </p>
                </GlassCard>
            </div>
        </section>
    </PublicPageLayout>
  );
}
