import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function GoogleGeminiEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const paths = [0.2, 0.15, 0.1, 0.05, 0].map((start) => useTransform(scrollYProgress, [0, 0.8], [start, 1.2]));
  return <div ref={ref} className="gemini-wrap"><svg viewBox="0 0 1000 360" aria-hidden="true">
    {paths.map((length, index) => <motion.path key={index} d={`M ${80 + index * 10} 290 C 260 ${80 - index * 8}, 520 ${350 + index * 4}, 920 ${70 + index * 25}`} pathLength={length} className={`gemini-line line-${index}`} />)}
  </svg></div>;
}
