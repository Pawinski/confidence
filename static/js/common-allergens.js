// Short, generic list of common allergens. No personal data.
// Each entry lists spellings to match (case- and accent-insensitive, full words).
window.COMMON_ALLERGENS = [
  ["penicillin", "pénicilline"],
  ["amoxicillin", "amoxicilline"],
  ["aspirin", "aspirine"],
  ["ibuprofen", "ibuprofène"],
  ["sulfa", "sulfamide", "sulfonamide"],
  ["codeine", "codéine"],
  ["latex"],
  ["peanut", "arachide", "cacahuète"],
];

(function () {
  function norm(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  function hasWord(text, word) {
    return new RegExp("(^|[^a-z0-9])" + word + "s?([^a-z0-9]|$)").test(text);
  }
  // Passive check only: returns the terms to flag, never asks anything.
  window.findAllergenFlags = function (record) {
    const r = record || {};
    const listed = norm((r.allergies || []).map((a) => [a.name, a.detail].join(" ")).join(" "));
    const text = norm(
      [].concat(r.medications || [], r.conditions || [])
        .map((x) => [x.name, x.detail, x.dose, x.notes].join(" "))
        .join(" ")
    );
    const flags = [];
    window.COMMON_ALLERGENS.forEach((spellings) => {
      const words = spellings.map(norm);
      const hit = spellings.find((s, i) => hasWord(text, words[i]));
      if (hit && !words.some((w) => hasWord(listed, w))) flags.push(hit);
    });
    return flags;
  };
})();
