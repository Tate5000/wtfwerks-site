import pptxgen from "pptxgenjs";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "WTFWERKS";
pptx.company = "WTFWERKS";
pptx.title = "WTFWERKS Pitch Deck";

const TITLE_COLOR = "FFFFFF";
const TEXT_COLOR = "E6E6E6";
const ACCENT = "C9A24D";
const BG = "050505";

function addTitleSlide(title, subtitle) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: BG } });
  slide.addText(title, {
    x: 0.8,
    y: 2.0,
    w: 11.7,
    h: 1.0,
    fontFace: "Calibri",
    fontSize: 44,
    bold: true,
    color: TITLE_COLOR,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8,
      y: 3.1,
      w: 11.7,
      h: 1.0,
      fontFace: "Calibri",
      fontSize: 20,
      color: ACCENT,
    });
  }
}

function addBulletsSlide(title, bullets) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: BG } });
  slide.addText(title, {
    x: 0.8,
    y: 0.6,
    w: 11.7,
    h: 0.6,
    fontFace: "Calibri",
    fontSize: 30,
    bold: true,
    color: TITLE_COLOR,
  });

  const bulletText = bullets.map((b) => ({ text: b, options: { bullet: { indent: 18 } } }));

  slide.addText(bulletText, {
    x: 1.0,
    y: 1.6,
    w: 11.0,
    h: 5.2,
    fontFace: "Calibri",
    fontSize: 20,
    color: TEXT_COLOR,
    paraSpaceAfter: 10,
  });
}

function addSectionSlide(title, bodyLines) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: BG } });
  slide.addText(title, {
    x: 0.8,
    y: 0.6,
    w: 11.7,
    h: 0.6,
    fontFace: "Calibri",
    fontSize: 30,
    bold: true,
    color: TITLE_COLOR,
  });
  slide.addText(bodyLines.join("\n"), {
    x: 0.9,
    y: 1.6,
    w: 11.4,
    h: 5.4,
    fontFace: "Calibri",
    fontSize: 20,
    color: TEXT_COLOR,
    lineSpacingMultiple: 1.1,
  });
}

addTitleSlide("WTFWERKS", "Employee-owned factory for products with personalities");

addBulletsSlide("THE PROBLEM", [
  "Infinite AI feels disposable",
  "Smart hardware has no soul",
  "Employees build value but do not own it",
  "Creativity dies when everything is optimized for growth curves",
  "",
  "People want:",
  "Objects they bond with",
  "Work they own",
  "Companies that do not betray builders later",
]);

addBulletsSlide("THE INSIGHT", [
  "Meaning comes from scarcity. Loyalty comes from ownership.",
  "Finite products create attachment",
  "Personality creates habit",
  "Employee ownership creates care",
  "You cannot fake any of these",
]);

addBulletsSlide("THE SOLUTION", [
  "WTFWERKS is an employee-owned studio that ships limited-run physical products with embedded AI personalities.",
  "Each product is a character",
  "Each drop is finite",
  "Each builder is an owner",
  "This is not SaaS.",
  "This is not mass market hardware.",
  "This is a factory that ships artifacts.",
]);

addBulletsSlide("THE PRODUCTS (DROP_001)", [
  "Wallet — Nervous. Stingy. Judges spending.",
  "Waterpipe — Stoner conspiracy theorist. Sees patterns everywhere.",
  "Purse — Boujee bad bitch. Protective. Ruthless honesty.",
  "Backpack — Adventurous. Warm. Encourages movement and exploration.",
  "Picture Frame — Judgmental. Rich. Silent disapproval in a gold frame.",
  "",
  "Each product:",
  "ESP32 based",
  "Speaker + OLED eyes",
  "Fixed personality",
  "No reissues",
]);

addBulletsSlide("FUN IS THE UTILITY", [
  "Fun earns attention",
  "Attention becomes habit",
  "Habit creates attachment",
  "Attachment drives retention and word of mouth",
  "The product works because people want to interact with it",
]);

addBulletsSlide("HOW IT WORKS (TECH)", [
  "Simple hardware. Central personality logic.",
  "Devices handle:",
  "Audio playback",
  "Display animation",
  "Local interaction",
  "Cloud handles:",
  "Personality logic",
  "Access rules",
  "Drop enforcement",
  "Hardware stays simple. Personalities stay special.",
]);

addBulletsSlide("SCARCITY MODEL", [
  "Fixed production runs",
  "Serialized instances",
  "No resales",
  "No personality swaps",
  "When it is gone, it is gone",
  "Miss a drop and it becomes lore",
]);

addBulletsSlide("OWNERSHIP MODEL (THE DIFFERENCE)", [
  "WTFWERKS is employee owned. For real.",
  "Company governed by an Employee Ownership Trust",
  "Trust holds controlling voting power",
  "Employees earn ownership by building and shipping",
  "Outside capital cannot take control",
  "Founders lead. Builders own the factory.",
]);

addBulletsSlide("FOUNDERS", [
  "Ownership split evenly among founders.",
  "Tate Carroll — CEO: Vision, systems, product direction",
  "Austin Patton — CCO/CMO: Brand, voice, personalities, culture",
  "Hayden Cash — CTO: Hardware systems, embedded engineering, manufacturing",
  "Equal partners. Clear domains. No shadow control.",
]);

addBulletsSlide("BUSINESS MODEL", [
  "High margin, low volume, sustainable",
  "Direct sale of limited hardware",
  "Premium pricing per drop",
  "Optional personality expansions",
  "Profit sharing with employees per drop",
  "No subscriptions required",
  "No infinite support burden",
]);

addBulletsSlide("WHY NOW", [
  "AI fatigue is real",
  "Physical objects are back",
  "Drops dominate culture",
  "Builders want ownership again",
  "Hardware + cloud AI finally works cleanly",
  "This category does not exist yet",
]);

addBulletsSlide("VISION", [
  "Products people miss when they are gone",
  "A catalog of personalities, not SKUs",
  "A factory owned by the people who run it",
  "We are not building a platform",
  "We are building a lineage",
]);

addSectionSlide("THE ASK (OPTIONAL)", [
  "Early collaborators",
  "Manufacturing partners",
  "Patient capital that respects employee control",
  "",
  "We are pre-drop. This is an invitation.",
  "",
  "One-line closer:",
  "WTFWERKS is an employee-owned factory that ships fun as a product.",
]);

await pptx.writeFile({ fileName: "docs/wtfwerks-pitch-deck.pptx" });
