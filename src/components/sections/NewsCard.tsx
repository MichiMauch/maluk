"use client";

import { motion } from "framer-motion";
import { MaterialIcon, GlassCard } from "@/components/ui";
import type { NewsArticle } from "@/data/news";
import { getRelativeTime } from "@/data/news";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
  delay?: number;
}

export function NewsCard({ article, featured = false, delay = 0 }: NewsCardProps) {
  if (featured) {
    return (
      <GlassCard
        className="lg:col-span-2 lg:row-span-2 overflow-hidden group relative hover:border-primary/50"
        delay={delay}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url("${article.image.url}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <div className="flex items-center gap-2 mb-2">
            {article.tag && (
              <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">
                {article.tag}
              </span>
            )}
            <span className="text-gray-300 text-xs font-mono">
              {getRelativeTime(article.publishedAt)}
            </span>
          </div>
          <motion.h3
            className="text-white text-3xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {article.title}
          </motion.h3>
          <p className="text-gray-300 line-clamp-2 mb-4">{article.excerpt}</p>
          <motion.a
            className="inline-flex items-center text-white text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
            href={`/news/${article.slug.current}`}
            whileHover={{ gap: "0.5rem" }}
          >
            Read Full Report
            <MaterialIcon name="arrow_right_alt" className="text-sm ml-1" />
          </motion.a>
        </div>
      </GlassCard>
    );
  }

  // Tech/Status Cards
  if (article.liveStatus) {
    return (
      <GlassCard className="p-6 flex flex-col justify-between bg-[#231013]/40" delay={delay}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-gray-400 text-xs font-mono uppercase">
              {article.liveStatus.label}
            </span>
          </div>
          <h4 className="text-white text-xl font-bold mb-auto">{article.title}</h4>
          {article.techSpecs && (
            <div className="space-y-3 mt-4">
              {article.techSpecs.map((spec) => (
                <div key={spec.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{spec.label}</span>
                    <span className="text-primary font-mono">{spec.value}</span>
                  </div>
                </div>
              ))}
              {article.liveStatus.progress && (
                <div className="w-full bg-gray-800 h-1 rounded-full">
                  <motion.div
                    className="bg-gradient-to-r from-accent to-primary h-1 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${article.liveStatus.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </GlassCard>
    );
  }

  // Default Tech Card
  return (
    <GlassCard className="p-6 flex flex-col justify-between bg-[#231013]/40" delay={delay}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <MaterialIcon name="build" className="text-primary text-3xl" />
          <span className="text-gray-500 text-xs font-mono uppercase">
            {article.category.toUpperCase()}
          </span>
        </div>
        <h4 className="text-white text-xl font-bold mb-2">{article.title}</h4>
        <p className="text-gray-400 text-sm">{article.excerpt}</p>
      </div>
      {article.image.url && (
        <motion.div
          className="mt-4 w-full h-32 rounded-lg bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url("${article.image.url}")` }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </GlassCard>
  );
}
