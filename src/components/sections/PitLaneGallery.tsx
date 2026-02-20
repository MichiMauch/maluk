"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";
import { SectionTitle } from "@/components/ui";
import { galleryImages, type GalleryImage } from "@/data/gallery";

const SCROLL_SPEED = 40; // px per second
const CLICK_THRESHOLD = 5; // px – max movement to count as a click

export function PitLaneGallery() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeItem, setActiveItem] = useState<GalleryImage | null>(null);
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const halfWidth = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollX = useRef(0);
  const pointerDownX = useRef(0);
  const savedX = useRef<number | null>(null);

  const startAnimation = useCallback(
    (from?: number) => {
      if (!halfWidth.current) return;
      const startX = from ?? 0;
      const distance = halfWidth.current - Math.abs(startX);
      const duration = distance / SCROLL_SPEED;

      controls.start({
        x: -halfWidth.current,
        transition: {
          x: {
            from: startX,
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0,
          },
        },
      });
    },
    [controls],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      const scrollContent = containerRef.current?.firstElementChild as HTMLElement | null;
      if (scrollContent) {
        halfWidth.current = scrollContent.scrollWidth / 2;
        startAnimation();
      }
    };

    const timeout = setTimeout(measure, 100);
    return () => clearTimeout(timeout);
  }, [startAnimation]);

  const getCurrentX = useCallback(() => {
    const inner = containerRef.current?.firstElementChild as HTMLElement | null;
    if (!inner) return 0;
    const style = getComputedStyle(inner);
    const matrix = new DOMMatrix(style.transform);
    return matrix.m41;
  }, []);

  useEffect(() => {
    if (activeItem) {
      controls.stop();
      return;
    }
    // Modal wurde gerade geschlossen → Position wiederherstellen
    if (savedX.current !== null) {
      const resumeX = savedX.current;
      savedX.current = null;
      controls.set({ x: resumeX });
      if (!isPaused) {
        startAnimation(resumeX);
      }
      return;
    }
    if (isPaused && !dragging.current) {
      controls.stop();
    } else if (!isPaused && !dragging.current) {
      startAnimation(getCurrentX());
    }
  }, [isPaused, activeItem, controls, startAnimation, getCurrentX]);

  // Close modal on Escape
  useEffect(() => {
    if (!activeItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeItem]);

  const clampX = useCallback(
    (x: number) => {
      if (!halfWidth.current) return x;
      let clamped = x;
      if (clamped < -halfWidth.current) clamped += halfWidth.current;
      if (clamped > 0) clamped -= halfWidth.current;
      return clamped;
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      setIsDragging(true);
      dragStartX.current = e.clientX;
      pointerDownX.current = e.clientX;
      dragScrollX.current = getCurrentX();
      controls.stop();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [controls, getCurrentX],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const newX = clampX(dragScrollX.current + delta);
      controls.set({ x: newX });
    },
    [controls, clampX],
  );

  // The doubled array used for infinite scroll
  const doubledImages = [...galleryImages, ...galleryImages];

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

      const movedDistance = Math.abs(e.clientX - pointerDownX.current);
      const wasClick = movedDistance < CLICK_THRESHOLD;

      if (wasClick) {
        const elementUnderPointer = document.elementFromPoint(e.clientX, e.clientY);
        const card = elementUnderPointer?.closest("[data-gallery-index]") as HTMLElement | null;
        if (card) {
          const idx = Number(card.dataset.galleryIndex);
          const item = doubledImages[idx];
          if (item) {
            savedX.current = getCurrentX();
            controls.stop();
            setActiveItem(item);
            return;
          }
        }
      }

      const currentX = getCurrentX();
      startAnimation(currentX);
    },
    [getCurrentX, startAnimation, doubledImages],
  );

  return (
    <section className="w-full py-16 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-4 md:px-10">
        <SectionTitle centered highlight="Lane">
          Pit Lane
        </SectionTitle>
      </div>

      <div
        ref={containerRef}
        className={`relative w-full ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        style={{ touchAction: "pan-y" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <motion.div className="flex gap-4 w-max" animate={controls}>
          {doubledImages.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              className="relative flex-shrink-0 w-[280px] h-[190px] sm:w-[360px] sm:h-[240px] md:w-[440px] md:h-[290px] rounded-lg overflow-hidden"
              style={{ transform: "skewX(-3deg)" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.08, zIndex: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              data-gallery-index={index}
            >
              <div
                className="absolute inset-0 transition-[filter] duration-300"
                style={{
                  filter:
                    hoveredIndex !== null && hoveredIndex !== index
                      ? "blur(4px) brightness(0.5)"
                      : "blur(0px) brightness(1)",
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  draggable={false}
                  className="object-cover"
                  style={{ transform: "skewX(3deg) scale(1.1)" }}
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 360px, 440px"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Play button overlay for YouTube videos */}
              {image.youtubeId && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-8 h-8 sm:w-10 sm:h-10 ml-1"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Caption on hover */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background-dark to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background-dark to-transparent pointer-events-none z-10" />
      </div>

      {/* Lightbox / Video Modal */}
      {activeItem &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="modal-backdrop"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
              onClick={() => setActiveItem(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={`relative mx-4 ${activeItem.youtubeId ? "w-full max-w-5xl" : "max-w-5xl max-h-[85vh]"}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Close button */}
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1 z-10"
                >
                  <span>Schliessen</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>

                {activeItem.youtubeId ? (
                  /* YouTube Video */
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${activeItem.youtubeId}?autoplay=1&start=${activeItem.startSeconds ?? 0}`}
                      title="YouTube Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  /* Image Lightbox */
                  <div className="flex items-center justify-center">
                    <Image
                      src={activeItem.src}
                      alt={activeItem.alt}
                      width={1200}
                      height={800}
                      className="rounded-lg object-contain max-h-[85vh] w-auto"
                      sizes="(max-width: 1280px) 95vw, 1200px"
                      priority
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
