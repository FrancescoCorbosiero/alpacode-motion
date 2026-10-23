/* The code blocks' colours: the studio's ink and blue on blueprint paper,
   nothing else. A Shiki theme, for Astro's <Code>. */
export const studio = {
  name: "alpacode-studio",
  type: "light" as const,
  colors: {
    "editor.background": "#e4e9f3",
    "editor.foreground": "#0b0e14",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#5d6880", fontStyle: "italic" } },
    {
      scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.control"],
      settings: { foreground: "#2756c2" },
    },
    { scope: ["string", "string.quoted", "string.template", "punctuation.definition.string"], settings: { foreground: "#3a548f" } },
    { scope: ["constant.numeric", "constant.language", "keyword.other.unit"], settings: { foreground: "#2756c2" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#2756c2", fontStyle: "bold" } },
    { scope: ["entity.name.tag", "meta.tag"], settings: { foreground: "#0b0e14" } },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: "#0b0e14", fontStyle: "bold" } },
    { scope: ["entity.name.type", "support.type", "entity.other.inherited-class"], settings: { foreground: "#1a1f2b" } },
    { scope: ["support.type.property-name", "meta.property-name"], settings: { foreground: "#0b0e14" } },
    { scope: ["entity.other.attribute-name.class.css", "entity.name.tag.css", "entity.other.attribute-name.pseudo-class.css"], settings: { foreground: "#2756c2" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#465065" } },
    { scope: ["variable", "variable.other", "meta.definition.variable"], settings: { foreground: "#0b0e14" } },
  ],
};
