const badWords = [
  "xxx",
  "hate",
  "abuse",
  "violence",
  "racist",
  "sexist",
  "discriminat",
  "harass",
  "threat",
  "bully",
  // Add more words as needed
];

export const filterBadWords = (text) => {
  let filtered = text;

  badWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    filtered = filtered.replace(regex, "*".repeat(word.length));
  });

  return filtered;
};

export const containsBadWords = (text) => {
  return badWords.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(text);
  });
};
