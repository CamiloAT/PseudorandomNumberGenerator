export const generateLinearCongruential = (x0, a, c, m, n) => {
  const data = [];
  let xi = x0;
  const history = new Set();
  let period = 0;

  for (let i = 0; i < n; i++) {
    const nextXi = (a * xi + c) % m;
    const ri = nextXi / m;
    data.push({ i: i + 1, xi, nextXi, ri });
    if (period === 0 && history.has(nextXi)) {
      period = i + 1;
    }
    history.add(nextXi);
    xi = nextXi;
  }
  return { data, period: period === 0 ? n : period };
};

export const generateMultiplicativeCongruential = (x0, a, m, n) => {
  const data = [];
  let xi = x0;
  const history = new Set();
  let period = 0;

  for (let i = 0; i < n; i++) {
    const nextXi = (a * xi) % m;
    const ri = nextXi / m;
    data.push({ i: i + 1, xi, nextXi, ri });
    if (period === 0 && history.has(nextXi)) {
      period = i + 1;
    }
    history.add(nextXi);
    xi = nextXi;
  }
  return { data, period: period === 0 ? n : period };
};

export const generateMiddleSquare = (x0, d, n) => {
  const data = [];
  let xi = x0;
  const history = new Set();
  let period = 0;

  for (let i = 0; i < n; i++) {
    const squared = Math.pow(xi, 2).toString();
    const desiredLength = d * 2;
    const padded = squared.padStart(desiredLength, '0');
    
    const start = Math.floor((padded.length - d) / 2);
    const middleStr = padded.substring(start, start + d);
    const nextXi = parseInt(middleStr, 10);
    const ri = nextXi / Math.pow(10, d);

    data.push({ i: i + 1, xi, squared: padded, nextXi, ri });
    if (period === 0 && history.has(nextXi)) {
      period = i + 1;
    }
    history.add(nextXi);
    xi = nextXi;
  }
  return { data, period: period === 0 ? n : period };
};

export const calculateStats = (numbers) => {
  if (!numbers || numbers.length === 0) return { mean: 0, variance: 0 };
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  const mean = sum / numbers.length;
  const squaredDiffs = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const variance = squaredDiffs / numbers.length;
  return { mean, variance };
};
