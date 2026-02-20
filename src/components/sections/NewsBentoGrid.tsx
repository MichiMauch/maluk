"use client";

import { SectionTitle } from "@/components/ui";
import { NewsCard } from "./NewsCard";
import { newsArticles } from "@/data/news";

export function NewsBentoGrid() {
  const featuredArticle = newsArticles.find((a) => a.featured);
  const otherArticles = newsArticles.filter((a) => !a.featured);

  return (
    <section id="news" className="w-full max-w-[1280px] px-4 md:px-10 py-10">
      <SectionTitle highlight="Updates">Telemetry Updates</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
        {featuredArticle && (
          <NewsCard article={featuredArticle} featured delay={0} />
        )}
        {otherArticles.map((article, index) => (
          <NewsCard
            key={article._id}
            article={article}
            delay={0.1 * (index + 1)}
          />
        ))}
      </div>
    </section>
  );
}
