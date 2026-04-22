const QUOTES = [
  "Focus is a matter of deciding what things you're not going to do. – John Carmack",
  "The successful warrior is the average man, with laser-like focus. – Bruce Lee",
  "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days. – Zig Ziglar",
  "Starve your distractions, feed your focus.",
  "You will never reach your destination if you stop and throw stones at every dog that barks. – Winston Churchill",
  "Always remember, your focus determines your reality. – George Lucas",
  "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus. – Alexander Graham Bell"
];

function initQuotes() {
  const quoteEl = document.getElementById('daily-quote');
  if (!quoteEl) return;
  
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % QUOTES.length;
  quoteEl.textContent = QUOTES[index];
}
