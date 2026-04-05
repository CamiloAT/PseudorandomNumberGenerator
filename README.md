# Pseudorandom Number Generator and Analyzer

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**[View User Manual](https://docs.google.com/document/d/1iZHUzVeRkD2zG4jbmzTSvAfHUOksLigk/edit)** 

A modern and interactive web application designed for the generation, visualization, and statistical evaluation of pseudorandom numbers. This simulation project allows users to experiment with different mathematical generation algorithms and subject the results to rigorous tests of uniformity and independence.

---

## Project Information

**Course:** COMPUTER SIMULATION  
**Code:** 8108278 | **Group:** 2-0  
**Professor:** Eng. JOSE OSBALDO ROJAS MORENO  
**Phase:** 1st 50% Project  

### Team Members
| Name | Code | Institutional Email |
| :--- | :--- | :--- |
| **Camilo Andres Arias Tenjo** | 202210549 | camilo.arias@uptc.edu.co |
| **Jose Ortega Luis Castillo** | 202210773 | jose.ortega01@uptc.edu.co |

---

## Main Features

### Number Generators
* **Linear Congruential:** Generation using the classic linear recurrence relation.
* **Multiplicative Congruential:** Variant that uses a pure multiplier for specific sequences.
* **Middle Square:** Method based on extracting the middle digits of the square of a seed number.

### Interactive Statistical Tests
Each test includes educational tooltips (rejection condition of $H_0$) and dynamic frequency tables.
* **Chi-Square Test ($\chi^2$):** Goodness-of-fit evaluation through empirical counting by intervals.
* **Kolmogorov-Smirnov (K-S):** Analysis of maximum differences between the theoretical distribution and the actual frequency distribution.
* **Poker Test:** Validation of probabilistic independence through the analysis of "hand" configurations.

### Interactive Graphic Panel (Carousel)
An animated carousel of 5 visual dimensions powered by advanced visualizations in `recharts`:
1. **Scatter Plot:** Visually evaluates basic stochastic density.
2. **Lag Plot:** Helps detect autocorrelations by plotting $X_i$ against $X_{i+1}$.
3. **Frequency Histogram:** Graphically corroborates the expected uniformity in the intervals (flattening).
4. **Trend Line:** Shows macroscopic fluctuations throughout the iterations.
5. **Cumulative Mean:** Demonstrates the central limit theorem by confirming the asymptotic convergence of the average towards $0.5$.

### UI/UX and Educational Focus
* Elegant "Dark Mode" design, using conditional themes and fluid animations (`framer-motion`).
* Built-in informative explanations about the concept of a generator's **Period** (Complete vs Incomplete).

---

## Execution and Development

1. **Install required dependencies:**
   ```bash
   npm install
   ```
2. **Run the environment in development mode:**
   ```bash
   npm run dev
   ```

> [!NOTE]
> This project has been built by structuring modern technologies in the Frontend (React, Vite, Tailwind CSS 4) applied to algorithmic and statistical calculation.

