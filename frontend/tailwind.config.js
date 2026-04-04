export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bdam: {
          bg:            "#0E0F11",
          surface:       "#2C2E33",
          "surface-alt": "#1E1F24",
          primary:       "#74121D",
          "primary-hov": "#5C0E17",
          "primary-soft":"rgba(116,18,29,0.15)",
          muted:         "#8B8D97",
          label:         "#C0C1C7",
          text:          "#F8F9FA",
          border:        "#3A3C42",
          error:         "#D94452",
          "error-soft":  "rgba(217,68,82,0.12)",
          success:       "#2A9D5C",
          "success-soft":"rgba(42,157,92,0.12)",
          mono:          "#B39DDB",
        },
      },
      boxShadow: {
        card: "0 8px 32px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3)",
      },
      ringColor: {
        DEFAULT: "#74121D",
      },
    },
  },
  plugins: [],
};