module.paths.push("/build/node_modules");
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

var config = {
  content: ["/web/assets/frontend/**/*.php", "/web/assets/frontend/**/*.js"],
  important: "html",
  theme: {
    fontSize: {
      xs: "1rem",
      sm: "1.11rem",
      base: "1.22rem",
      lead: "1.44rem",
      lg: "1.33rem",
      xl: "1.44rem",

      h6: "1.39rem", //25px
      h5: "1.67rem", //30px
      h4: "1.94rem", //35px
      h3: "2.22rem", //40px
      h2: "2.50rem", //45px
      h1: "2.78rem", //50px
    },
    fontWeight: {
      light: "200",
      base: "300",
      semibold: "500",
      bold: "700",

      h6: "400",
      h5: "400",
      h4: "500",
      h3: "500",
      h2: "700",
      h1: "700", 
    },
    extend: {
      borderRadius:{
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '5rem',
      },
      scale: {
        '110': '1.10',
      },
      minHeight: {
        'xs': '1rem',
        'sm': '2rem',
        'md': '4rem',
        'lg': '8rem',
        'xl': '16rem'
      },
      spacing: {
        theme: "1.5rem",
        0: "0px",
        "3xs": "0.25rem", //
        "2xs": "0.5rem", //
        xxs: "0.5rem", // 1
        xs: "1rem", // 2
        sm: "2rem", // 4
        md: "4rem", // 8
        lg: "8rem", // 16
        xl: "16rem", // 32
      },

      colors: {
        primary: {
          light: "#262E65",
          DEFAULT: "#000C62",
          dark: "#0D123B",
          contrast: "#fff",
        },
        secondary: {
          light: "#E05030",
          DEFAULT: "#E05030",
          dark: "#E05030",
          contrast: "#fff",
        },
        tertiary: {
          light: "#55667f",
          DEFAULT: "#55667f",
          dark: "#55667f",
          contrast: "#fff",
        },
        body: "#191e25",
        black: "#000",
        xdark: "#3a3a3a",
        dark: "#575757",
        mid: "#777",
        light: "#e5e5e5",
        xlight: "#f2f2f2",
        white: "#fff",
        red: "#EF4444",
        blue: "#3B82F6",
        yellow: "#f8d149",
        green: "#10B981",
        purple: "#8B5CF6",
        pink: "#EC4899",
        orange: "#F59E0B",
        transparent: "transparent",
        current: "currentColor",
      },
      fontFamily: {
        display: ['theme("fontFamily.sans")'],
        body: ['theme("fontFamily.sans")'],
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: "calc(theme('fontSize.base') * 0.8)",
            maxWidth: "100%",
            color: "var(--color)",
            lineHeight: "calc(2ex + 4px)",
            p: {
              color: "var(--color)",
              lineHeight: "theme('lineHeight.normal')",
              fontWeight: "theme('fontWeight.base')",
              marginTop: false,
              marginBottom: "1rem"
            },
            li: {
              color: "var(--color)",
              lineHeight: "theme('lineHeight.normal')",
              fontWeight: "theme('fontWeight.base')",
              marginTop: "0",
              marginBottom: "0.5rem"
            },
            a: {
              color: "var(--link-color)",
              textDecoration: false,
              "&:hover": {
                color: "var(--link-color-hover)",
              },
              "&:focus": {
                color: "var(--link-color-hover)",
              },
            },
            strong: {
              color: "inherit",
            },
            blockquote: {
              borderLeft: "none",
              fontSize: "theme('fontSize.xl')",
              fontWeight: "theme('fontWeight.base')",
              fontStyle: "normal",
              lineHeight: "1.2",
              marginBottom: "1rem",
              color: "inherit",
            },
            cite: {
              fontStyle: "normal",
            },
            h1: {
              color: "var(--heading-color)",
              fontFamily: "theme('fontFamily.display')",
              fontSize: "calc(theme('fontSize.h1') * .6)",
              fontWeight: "theme('fontWeight.h1')",
              marginTop: "0",
              marginBottom: "1rem",
              lineHeight: "1.1",
            },
            h2: {
              color: "var(--heading-color)",
              fontFamily: "theme('fontFamily.display')",
              fontSize: "calc(theme('fontSize.h2') * .6)",
              fontWeight: "theme('fontWeight.h2')",
              marginTop: "0",
              marginBottom: "0.75rem",
              lineHeight: "1.1",
            },
            h3: {
              color: "var(--heading-color)",
              fontFamily: "theme('fontFamily.display')",
              fontSize: "calc(theme('fontSize.h3') * .6)",
              fontWeight: "theme('fontWeight.h3')",
              marginTop: "0",
              marginBottom: "0.75rem",
              lineHeight: "1.1",
            },
            h4: {
              color: "var(--heading-color)",
              fontFamily: "theme('fontFamily.display')",
              fontSize: "calc(theme('fontSize.h4') * .7)",
              fontWeight: "theme('fontWeight.h4')",
              marginTop: "0",
              marginBottom: "0.5rem",
              lineHeight: "1.1",
            },
            h5: {
              color: "var(--heading-color)",
              fontFamily: "theme('fontFamily.display')",
              fontSize: "calc(theme('fontSize.h5') * .8)",
              fontWeight: "theme('fontWeight.h5')",
              marginTop: "0",
              marginBottom: "0.5rem",
              lineHeight: "1.1",
              fontWeight: "700",
            },
            h6: {
              color: "var(--heading-color)",
              fontFamily: "theme('fontFamily.display')",
              fontSize: "calc(theme('fontSize.h6') * .9)",
              fontWeight: "theme('fontWeight.h6')",
              marginTop: "0",
              marginBottom: "0.5rem",
              lineHeight: "1.1",
              fontWeight: "500",
            },
            '[class~="size-h1"]': {
              fontSize: "calc(theme('fontSize.h1') * .6)",
            },
            '[class~="size-h2"]': {
              fontSize: "calc(theme('fontSize.h2') * .6)",
            },
            '[class~="size-h3"]': {
              fontSize: "calc(theme('fontSize.h3') * .6)",
            },
            '[class~="size-h4"]': {
              fontSize: "calc(theme('fontSize.h4') * .7)",
            },
            '[class~="size-h5"]': {
              fontSize: "calc(theme('fontSize.h5') * .8)",
            },
            '[class~="size-h6"]': {
              fontSize: "calc(theme('fontSize.h6') * .9)",
            },
            '[class~="size-xl"]': {
              fontSize: "calc(theme('fontSize.xl') * .8)",
            },
            '[class~="size-lg"]': {
              fontSize: "calc(theme('fontSize.lg') * .8)",
            },
            '[class~="size-base"]': {
              fontSize: "calc(theme('fontSize.base') * .8)",
            },
            '[class~="size-sm"]': {
              fontSize: "calc(theme('fontSize.sm') * .8)",
            },
            '[class~="size-xs"]': {
              fontSize: "calc(theme('fontSize.xs') * .8)",
            },
            '[class~="size-lead"]': {
              fontSize: "calc(theme('fontSize.lead') * .8)",
            },
            '[class~="lead"]': {
              fontSize: "calc(theme('fontSize.lead') * .8)",
              color: false,
            },
            '[class~="mb-xxs"]': {
              marginBottom: "theme('spacing.xxs')",
            },
            img: {
              marginTop: 0,
              marginBottom: 0,
            }
          },
        },
        lg: {
          css: {
            fontSize: "theme('fontSize.base')",
            lineHeight: false,
            p: {
              marginTop: false,
              marginBottom: false
            },
            h1: {
              fontSize: "theme('fontSize.h1')",
              marginTop: false,
              marginBottom: false,
              lineHeight: false,
            },
            h2: {
              fontSize: "theme('fontSize.h2')",
              marginTop: false,
              marginBottom: false,
              lineHeight: false,
            },
            h3: {
              fontSize: "theme('fontSize.h3')",
              marginTop: false,
              marginBottom: false,
              lineHeight: 1.3,
            },
            h4: {
              fontSize: "theme('fontSize.h4')",
              marginTop: false,
              marginBottom: false,
            },
            h5: {
              fontSize: "theme('fontSize.h5')",
              marginTop: false,
              marginBottom: false,
            },
            h6: {
              fontSize: "theme('fontSize.h6')",
              marginTop: false,
              marginBottom: false,
            },
            '[class~="size-h1"]': {
              fontSize: "theme('fontSize.h1')",
            },
            '[class~="size-h2"]': {
              fontSize: "theme('fontSize.h2')",
            },
            '[class~="size-h3"]': {
              fontSize: "theme('fontSize.h3')",
            },
            '[class~="size-h4"]': {
              fontSize: "theme('fontSize.h4')",
            },
            '[class~="size-h5"]': {
              fontSize: "theme('fontSize.h5')",
            },
            '[class~="size-h6"]': {
              fontSize: "theme('fontSize.h6')",
            },
            '[class~="size-xl"]': {
              fontSize: "theme('fontSize.xl')",
            },
            '[class~="size-lg"]': {
              fontSize: "theme('fontSize.lg')",
            },
            '[class~="size-base"]': {
              fontSize: "theme('fontSize.base')",
            },
            '[class~="size-sm"]': {
              fontSize: "theme('fontSize.sm')",
            },
            '[class~="size-xs"]': {
              fontSize: "theme('fontSize.xs')",
            },
            '[class~="size-lead"]': {
              fontSize: "theme('fontSize.lead')",
            },
            '[class~="lead"]': {
              fontSize: "theme('fontSize.lead')",
            },
            img: {
              marginTop: 0,
              marginBottom: 0,
            },
            li: {
              marginTop: "0",
              marginBottom: "0.5rem",
            },
          },
        },
      },
      screens: {
        //'xs':       { 'max': '639px'},
        //'not-xs':   { 'min': '640px'}, // USE sm
        phone: { max: "639px" },
        tablet: { min: "640px", max: "1023px" },
        mobile: { max: "1023px" },
        laptop: { min: "1024px", max: "1279px" },
        tl: { min: "640px", max: "1279px" },
        desktop: { min: "1279px" },
        ld: { min: "1024px" },
      },
    },
  },
  plugins: [],
};

if (process.env.NODE_ENV == "firebase") {
  config.content = [
    "/firebase/public/**/*.html",
    "/web/public/cache/assets/frontend-*.js",
  ];
} else if (process.env.NODE_ENV == "shopify") {
  config.content = [
    "/firebase/public/**/*.html",
    "/web/public/cache/assets/frontend-*.js",
    `/web/assets/shopify/**/*.liquid`,
  ];
} else {
  config.safelist = [
    {
      pattern:
        /^(grid|flex|bg-|justify-|gap-|max-w-|items-|(p|m|h)(x|y|t|b|l|r)?-|text-|font-|ctr|btn).*/,
      variants: ["xs", "sm", "md", "lg", "xl"],
    },
  ];
}

config.plugins = [
  require("@tailwindcss/forms"),
  require("@tailwindcss/typography")({
    modifiers: ["lg"],
  }),
  require("@tailwindcss/line-clamp"),
  require("@tailwindcss/aspect-ratio"),

  plugin(function ({ addUtilities, theme }) {
    let utilies = {
      ".flex-grid": {
        display: "flex",
        flexWrap: "wrap",
        "--cols": "1",
        "--col-span": "1",
        "--col-gap": "0px",
      },
      ".flex-grid > *": {
        minWidth:
          "calc(100% / var(--cols) * var(--col-span) - var(--col-gap) * (var(--cols) - var(--col-span)) / var(--cols))",
        width:
          "calc(100% / var(--cols) * var(--col-span) - var(--col-gap) * (var(--cols) - var(--col-span)) / var(--cols))",
      },
      '.grid-cols-auto > *': {
        minWidth: 'auto',
        width: 'auto',
      },
      ".col-span-full": {
        "--col-span": "var(--cols)",
      }
    };

    for (let i = 1; i <= 12; i++) {
      utilies[`.grid-cols-${i}`] = {
        "--cols": `${i}`,
      };

      utilies[`.col-span-${i}`] = {
        "--col-span": `${i}`,
      };
    }

    const spacing = theme("spacing", {});
    Object.keys(spacing).forEach((key) => {
      utilies[`.gap-${key}`] = {
        "--col-gap": spacing[key],
        "--row-gap": spacing[key],
      };

      utilies[`.gap-x-${key}`] = {
        "--col-gap": spacing[key],
      };

      utilies[`.gap-y-${key}`] = {
        "--row-gap": spacing[key],
      };
    });

    const colors = theme("colors", {});
    Object.keys(colors).forEach((key) => {
      utilies[`.text-${key}`] = {
        "--color": colors[key],
        "--heading-color": colors[key],
        "--link-color": colors[key],
      };
    });

    addUtilities(utilies, {
      variants: ["responsive"],
    });
  }),
];

module.exports = config;
