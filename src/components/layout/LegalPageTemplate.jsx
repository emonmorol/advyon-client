import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { PageHero } from '@/components/ui/PageHero';
import { GlassCard } from '@/components/ui/GlassCard';

import SystemBootLoader from '@/components/ui/SystemBootLoader';
import { useBootSequence } from '@/hooks/useBootSequence';

export default function LegalPageTemplate({ title, lastUpdated, children }) {
  const { shouldBoot, completeBoot } = useBootSequence();

  if (shouldBoot) {
    return <SystemBootLoader onComplete={completeBoot} />;
  }

  return (
    <PublicPageLayout 
        title={title}
        description={`Legal documentation for ${title}`}
    >
        <PageHero 
            title={title}
            subtitle={`Last Updated: ${lastUpdated}`}
        />

        <section className="py-12 pb-32">
            <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                <GlassCard className="p-8 md:p-12">
                    <div className="prose prose-invert prose-emerald max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-emerald-100/80 prose-li:text-emerald-100/80 prose-strong:text-teal-200">
                        {children}
                    </div>
                </GlassCard>
            </div>
        </section>
    </PublicPageLayout>
  );
}
