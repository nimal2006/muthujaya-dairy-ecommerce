/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Premium cream-based palette
        cream: {
          50: "#FFFEFB",
          100: "#FFFDF8",
          200: "#FFF9ED",
          300: "#FFF5E1",
          400: "#FFEFD1",
          500: "#FFE8BE",
          600: "#F5D89A",
          700: "#E6C67A",
          800: "#D4B05C",
          900: "#B8943D",
        },
        milk: {
          white: "#FEFEFE",
          cream: "#FFF8E7",
          warm: "#FFFDF8",
          pure: "#FFFFFF",
        },
        primary: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        sky: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
        },
        nature: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        warm: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        dairy: {
          cream: "#FFF8E7",
          milk: "#FEFEFE",
          butter: "#F5DEB3",
          green: "#10B981",
          blue: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["SF Pro Display", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left": "slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right": "slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.8s ease-out",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 8s linear infinite",
        "gradient-x": "gradientX 15s ease infinite",
        "gradient-y": "gradientY 15s ease infinite",
        "gradient-xy": "gradientXY 15s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        "milk-wave": "milkWave 3s ease-in-out infinite",
        "milk-drop": "milkDrop 4s ease-in-out infinite",
        ripple: "ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "blur-in": "blurIn 0.6s ease-out",
        morph: "morph 8s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(2deg)" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(40px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-40px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        gradientY: {
          "0%, 100%": { backgroundPosition: "50% 0%" },
          "50%": { backgroundPosition: "50% 100%" },
        },
        gradientXY: {
          "0%, 100%": { backgroundPosition: "0% 0%" },
          "25%": { backgroundPosition: "100% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "75%": { backgroundPosition: "0% 100%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        milkWave: {
          "0%, 100%": { transform: "translateX(0) scaleY(1)" },
          "25%": { transform: "translateX(-5px) scaleY(1.02)" },
          "50%": { transform: "translateX(0) scaleY(0.98)" },
          "75%": { transform: "translateX(5px) scaleY(1.01)" },
        },
        milkDrop: {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "50%": { transform: "translateY(-15px) scale(1.1)", opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        blurIn: {
          "0%": { filter: "blur(10px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
        morph: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "50%": { borderRadius: "50% 60% 30% 60% / 30% 60% 70% 40%" },
          "75%": { borderRadius: "60% 40% 60% 30% / 70% 30% 50% 60%" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(34, 197, 94, 0.8)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" },
          "100%": {
            boxShadow:
              "0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "url('/patterns/hero-bg.svg')",
        "mesh-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "cream-gradient":
          "linear-gradient(135deg, #FFFDF8 0%, #FFF8E7 50%, #F0FDF4 100%)",
        "milk-gradient":
          "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,253,248,1) 100%)",
        "sky-gradient":
          "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)",
        "nature-gradient":
          "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #6EE7B7 100%)",
        "warm-gradient":
          "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)",
        "premium-gradient":
          "linear-gradient(135deg, #FFFDF8 0%, #E0F2FE 25%, #D1FAE5 50%, #FEF3C7 75%, #FFFDF8 100%)",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "soft-lg":
          "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 15px 30px -5px rgba(0, 0, 0, 0.05)",
        "soft-xl":
          "0 8px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)",
        glow: "0 0 15px rgba(34, 197, 94, 0.5)",
        "glow-lg": "0 0 30px rgba(34, 197, 94, 0.6)",
        "glow-sky": "0 0 30px rgba(56, 189, 248, 0.5)",
        "glow-warm": "0 0 30px rgba(251, 191, 36, 0.5)",
        cream: "0 4px 30px rgba(255, 248, 231, 0.5)",
        "inner-glow": "inset 0 0 20px rgba(255, 255, 255, 0.5)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "card-hover": "0 20px 50px -15px rgba(0, 0, 0, 0.2)",
        luxury: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
      },
      scale: {
        102: "1.02",
        103: "1.03",
      },
      blur: {
        "4xl": "72px",
        "5xl": "96px",
      },
    },
  },
  plugins: [],
};
