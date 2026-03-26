import { jStat } from 'jstat';

// 1. Chi-Square Test
export const chiSquareTest = (numbers, alpha = 0.05, k = 10) => {
  const n = numbers.length;
  const expected = n / k;
  const bins = new Array(k).fill(0);

  // Distribute numbers into bins
  numbers.forEach((num) => {
    let binIndex = Math.floor(num * k);
    if (binIndex === k) binIndex = k - 1; // Edge case for 1.0
    bins[binIndex]++;
  });

  // Calculate Chi-Square statistic
  let chiSquare = 0;
  const observations = [];
  bins.forEach((observed, i) => {
    const value = Math.pow(observed - expected, 2) / expected;
    chiSquare += value;
    observations.push({ bin: `${(i / k).toFixed(1)} - ${((i + 1) / k).toFixed(1)}`, observed, expected, value });
  });

  // Degrees of freedom
  const df = k - 1;
  const criticalValue = jStat.chisquare.inv(1 - alpha, df);
  const passed = chiSquare <= criticalValue;

  return { chiSquare, criticalValue, passed, observations, df };
};

// 2. Kolmogorov-Smirnov Test
export const kolmogorovSmirnovTest = (numbers, alpha = 0.05) => {
  const n = numbers.length;
  if (n === 0) return { passed: false };

  // Sort numbers in ascending order
  const sorted = [...numbers].sort((a, b) => a - b);
  const data = [];
  let dMax = 0;

  sorted.forEach((num, index) => {
    const i = index + 1;
    const fn = i / n;
    const dp = Math.abs(fn - num);
    const dm = Math.abs(num - (i - 1) / n);
    const maxLocalD = Math.max(dp, dm);
    if (maxLocalD > dMax) dMax = maxLocalD;
    
    data.push({ i, ri: num, fn, dp, dm, maxLocalD });
  });

  // Approximate critical value for n > 35
  const criticalValue = 1.36 / Math.sqrt(n); 
  const passed = dMax <= criticalValue;

  return { dMax, criticalValue, passed, data };
};

// 3. Poker Test (5 decimal digits)
export const pokerTest = (numbers, alpha = 0.05) => {
  const n = numbers.length;
  const observedCount = {
    'TD': 0, // Todas Diferentes
    '1P': 0, // Un Par
    '2P': 0, // Dos Pares
    'T': 0,  // Tercia
    'TP': 0, // Tercia y Par (Full House)
    'P': 0,  // Poker (4 iguales)
    'Q': 0   // Quintilla (5 iguales)
  };

  const probs = {
    'TD': 0.3024,
    '1P': 0.5040,
    '2P': 0.1080,
    'T':  0.0720,
    'TP': 0.0090,
    'P':  0.0045,
    'Q':  0.0001
  };

  numbers.forEach((num) => {
    // Get 5 decimal digits
    const strNum = num.toFixed(5).split('.')[1];
    const counts = {};
    for (let char of strNum) {
      counts[char] = (counts[char] || 0) + 1;
    }
    
    const freqs = Object.values(counts).sort((a, b) => b - a);
    
    // Categorize
    if (freqs[0] === 5) observedCount['Q']++;
    else if (freqs[0] === 4) observedCount['P']++;
    else if (freqs[0] === 3 && freqs[1] === 2) observedCount['TP']++;
    else if (freqs[0] === 3) observedCount['T']++;
    else if (freqs[0] === 2 && freqs[1] === 2) observedCount['2P']++;
    else if (freqs[0] === 2) observedCount['1P']++;
    else observedCount['TD']++;
  });

  let chiSquare = 0;
  const observations = Object.keys(observedCount).map(category => {
    const observed = observedCount[category];
    const expected = probs[category] * n;
    
    // Merge small categories if expected < 5 (standard practice), but for simplicity:
    const val = expected === 0 ? 0 : Math.pow(observed - expected, 2) / expected;
    chiSquare += val;
    return { category, observed, expected, value: val };
  });

  const df = Object.keys(probs).length - 1; // 6
  // Fallback to table value for 6 degrees of freedom at 0.05
  // approx 12.5916
  const criticalValue = jStat.chisquare.inv(1 - alpha, df);
  const passed = chiSquare <= criticalValue;

  return { chiSquare, criticalValue, passed, observations, df };
};
