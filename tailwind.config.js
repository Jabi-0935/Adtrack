export default {
  theme: {
    extend: {
      colors: {
        black: "#000000",
        prussian: "#14213D",
        orange: "#FCA311",
        grey: "#E5E5E5",
        white: "#FFFFFF",
        transparent: "transparent",
      },

      fontSize: {
        h1: ["56px", { fontWeight: "700" }],
        h2: ["40px", { fontWeight: "700" }],
        h3: ["32px", { fontWeight: "600" }],

        body: ["16px", "1.5"],
        bodyLg: ["18px", "1.5"],
        bodySm: ["14px", "1.4"],
      },

      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
      },

      borderRadius: {
        DEFAULT: "8px",
      },

      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.08)",
      },
    },
  },
};