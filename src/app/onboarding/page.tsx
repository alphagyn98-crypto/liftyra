"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "motion/react";

const slides = [
  { mobile: "/onboarding/1.png", desktop: "/onboarding/dekstop-1.png", alt: "Track Every Lift" },
  { mobile: "/onboarding/2.png", desktop: "/onboarding/desktop-2.png", alt: "Monitor Your Progress" },
  { mobile: "/onboarding/3.png", desktop: "/onboarding/desktop-3.png", alt: "Body Assessment" },
  { mobile: "/onboarding/4.png", desktop: "/onboarding/desktop-4.png", alt: "Join the Community" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.92,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.92,
    filter: "blur(4px)",
  }),
};

const controlsVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function OnboardingPage() {
  const [[current, direction], setSlide] = useState([0, 0]);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const swipeThreshold = 50;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const paginate = useCallback(
    (newDirection: number) => {
      const next = current + newDirection;
      if (next >= 0 && next < slides.length) {
        setSlide([next, newDirection]);
      }
    },
    [current],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x < -swipeThreshold) {
        paginate(1);
      } else if (info.offset.x > swipeThreshold) {
        paginate(-1);
      }
    },
    [paginate],
  );

  const finish = useCallback(() => {
    localStorage.setItem("onboarding_done", "true");
    router.push("/login");
  }, [router]);

  const isFirst = current === 0;
  const isLast = current === slides.length - 1;

  return (
    <main className="relative mx-auto min-h-[100dvh] w-full max-w-[430px] overflow-hidden md:max-w-none">
      {/* Full-screen slide image with swipe */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 280, damping: 30 },
            opacity: { duration: 0.35, ease: "easeOut" },
            scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
            filter: { duration: 0.3 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={isDesktop ? slides[current].desktop : slides[current].mobile}
            alt={slides[current].alt}
            fill
            className="pointer-events-none object-cover object-top"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom controls — overlay on top of image */}
      <motion.div
        variants={controlsVariants}
        initial="hidden"
        animate="visible"
        className="absolute right-0 bottom-0 left-0 z-10 flex flex-col items-center gap-4 bg-gradient-to-t from-black/60 to-transparent px-6 pt-24 pb-10"
      >
        {/* Dot indicators */}
        <motion.div variants={itemVariants} className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide([idx, idx > current ? 1 : -1])}
              aria-label={`Slide ${idx + 1}`}
              className="relative h-2.5 rounded-full"
            >
              <motion.div
                className="h-2.5 rounded-full"
                animate={{
                  width: idx === current ? 28 : 10,
                  backgroundColor:
                    idx === current
                      ? "var(--color-green)"
                      : "rgba(255,255,255,0.4)",
                }}
                transition={{
                  width: { type: "spring", stiffness: 350, damping: 25 },
                  backgroundColor: { duration: 0.3 },
                }}
              />
            </button>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex w-full gap-3">
          <AnimatePresence mode="popLayout">
            {!isFirst && (
              <motion.button
                key="back"
                onClick={() => paginate(-1)}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 rounded-[18px] border border-white/30 bg-white/60 px-5 py-4 text-base font-semibold text-black backdrop-blur-md"
              >
                Back
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            key={isLast ? "finish" : "next"}
            onClick={isLast ? finish : () => paginate(1)}
            whileTap={{ scale: 0.95 }}
            layout
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-green flex-1 rounded-[18px] px-5 py-4 text-base font-semibold text-black shadow-[0_20px_40px_rgba(190,255,68,0.22)]"
          >
            <motion.span
              key={isLast ? "finish-text" : "next-text"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {isLast ? "Finish" : "Next"}
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Skip link */}
        <AnimatePresence>
          {!isLast && (
            <motion.button
              onClick={finish}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm font-medium text-black/70 transition-colors hover:text-black"
            >
              Skip
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
