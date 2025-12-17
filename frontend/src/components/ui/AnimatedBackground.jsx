import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Animated Gradient Mesh Background
export const AnimatedMeshBackground = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cream-100 via-milk-warm to-nature-50 animate-gradient-xy"
        style={{ backgroundSize: "400% 400%" }}
      />

      {/* Animated orbs */}
      <motion.div
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary-200/40 via-primary-100/20 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -80, 20, 0],
          y: [0, 80, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-radial from-sky-200/40 via-sky-100/20 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -60, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] left-[20%] w-[550px] h-[550px] rounded-full bg-gradient-radial from-warm-200/40 via-warm-100/20 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -40, 60, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-radial from-nature-200/30 via-nature-100/15 to-transparent blur-3xl"
      />

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};

// Floating Milk Drops
export const FloatingMilkDrops = ({ count = 8 }) => {
  const drops = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 15 + Math.random() * 20,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute"
          style={{
            left: drop.left,
            top: drop.top,
            width: drop.size,
            height: drop.size * 1.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-full h-full bg-gradient-to-b from-white/80 to-white/40 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%]"
            style={{ filter: "blur(0.5px)" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Parallax Mouse Movement
export const ParallaxContainer = ({
  children,
  className = "",
  intensity = 0.02,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX - innerWidth / 2) * intensity;
      const y = (clientY - innerHeight / 2) * intensity;

      container.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

// Animated Gradient Border
export const GradientBorder = ({
  children,
  className = "",
  borderWidth = 2,
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-400 via-sky-400 to-warm-400 animate-gradient-x opacity-70"
        style={{
          padding: borderWidth,
          backgroundSize: "200% 200%",
        }}
      />
      <div className="relative bg-white rounded-3xl h-full">{children}</div>
    </div>
  );
};

// Milk Wave Divider
export const MilkWaveDivider = ({ className = "", inverted = false }) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-auto ${inverted ? "rotate-180" : ""}`}
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
          fill="url(#milk-gradient)"
          animate={{
            d: [
              "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
              "M0,80 C240,20 480,100 720,40 C960,80 1200,20 1440,80 L1440,120 L0,120 Z",
              "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <defs>
          <linearGradient id="milk-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 253, 248, 1)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 1)" />
            <stop offset="100%" stopColor="rgba(255, 253, 248, 1)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Shimmer Effect Component
export const ShimmerButton = ({ children, className = "" }) => {
  return (
    <button className={`relative overflow-hidden group ${className}`}>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </button>
  );
};

// Glow Effect on Hover
export const GlowCard = ({
  children,
  className = "",
  glowColor = "primary",
}) => {
  const glowColors = {
    primary: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]",
    sky: "hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]",
    warm: "hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]",
  };

  return (
    <div
      className={`transition-all duration-500 ${glowColors[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
};

// Animated Counter
export const AnimatedCounter = ({
  end,
  duration = 2,
  suffix = "",
  prefix = "",
}) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animationFrame = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// Need to import useState for AnimatedCounter
import { useState } from "react";

// Liquid Progress Bar
export const LiquidProgress = ({ progress, className = "" }) => {
  return (
    <div
      className={`relative h-4 bg-gray-100 rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 rounded-full"
        style={{ backgroundSize: "200% 100%" }}
        initial={{ width: 0 }}
        animate={{
          width: `${progress}%`,
          backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
        }}
        transition={{
          width: { duration: 1, ease: "easeOut" },
          backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
    </div>
  );
};

// Staggered Reveal Container
export const StaggeredReveal = ({
  children,
  className = "",
  staggerDelay = 0.1,
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  AnimatedMeshBackground,
  FloatingMilkDrops,
  ParallaxContainer,
  GradientBorder,
  MilkWaveDivider,
  ShimmerButton,
  GlowCard,
  AnimatedCounter,
  LiquidProgress,
  StaggeredReveal,
  StaggeredItem,
};
