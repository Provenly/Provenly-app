'use client';

import HeroSection from '@/components/homepage/HeroSection';
import { ComponentErrorBoundary } from '@/components/error/ErrorBoundary';
import {
  WithAPIBootstrapErrorBoundary,
  BootstrapErrorFallback,
} from '@/components/error';
import LazyLoad from '@/components/ui/LazyLoad';
import {
  DynamicHowItWorks,
  DynamicFeaturedQuests,
  DynamicFAQAccordion,
  DynamicCTASection,
} from '@/lib/dynamic-imports';


export default function Home() {
  return (
    <main id="main-content" className="flex flex-col">
      <ComponentErrorBoundary componentName="HeroSection">
        <HeroSection />
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="HowItWorks">
        <LazyLoad
          placeholder={
            <div className="min-h-[500px] w-full animate-pulse bg-slate-800/20" />
          }
        >
          <DynamicHowItWorks />
        </LazyLoad>
      </ComponentErrorBoundary>

      <WithAPIBootstrapErrorBoundary
        componentName="Featured Quests — Page Loader"
        fallback={BootstrapErrorFallback}
      >
        <LazyLoad
          placeholder={
            <div className="min-h-[600px] w-full animate-pulse bg-slate-800/20" />
          }
          rootMargin="100px"
        >
          <DynamicFeaturedQuests />
        </LazyLoad>
      </WithAPIBootstrapErrorBoundary>

      <ComponentErrorBoundary componentName="CTASection">
        <LazyLoad
          placeholder={
            <div className="min-h-[300px] w-full animate-pulse bg-slate-800/20" />
          }
        >
          <DynamicCTASection />
        </LazyLoad>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="FAQAccordion">
        <LazyLoad
          placeholder={
            <div className="min-h-[400px] w-full animate-pulse bg-slate-800/20" />
          }
        >
          <DynamicFAQAccordion />
        </LazyLoad>
      </ComponentErrorBoundary>
    </main>
  );
}
