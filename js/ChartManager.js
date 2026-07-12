/**
 * ChartManager.js — Improved
 * Manages Chart.js bar and pie charts safely with global context fallbacks.
 */
export class ChartManager {
  constructor() {
    this._barChart  = null;
    this._pieChart  = null;

    // Resolve Chart from the global window object explicitly to bypass ES Module namespace issues
    const GlobalChart = window.Chart;

    if (!GlobalChart) {
      console.warn("ChartManager: Chart.js dependency was not found globally. Charts will be disabled.");
      return;
    }

    // Common chart defaults (dark theme) using the resolved global reference
    GlobalChart.defaults.color = '#8a8790';
    GlobalChart.defaults.font.family = "'Syne', sans-serif";
    GlobalChart.defaults.font.size   = 12;

    this._initBarChart(GlobalChart);
    this._initPieChart(GlobalChart);
  }

  // ── Bar Chart: Income vs Expenses ────────────────────────────

  _initBarChart(GlobalChart) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    this._barChart = new GlobalChart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data:            [0, 0],
          backgroundColor: ['rgba(76,175,138,0.7)', 'rgba(224,92,92,0.7)'],
          borderColor:     ['#4caf8a', '#e05c5c'],
          borderWidth:     1,
          borderRadius:    6,
          borderSkipped:   false,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend:  { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ₹${ctx.raw.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#8a8790' },
          },
          y: {
            grid:      { color: 'rgba(255,255,255,0.04)' },
            ticks:     { color: '#8a8790',
              callback: v => '₹' + v.toLocaleString('en-IN'),
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  // ── Pie Chart: Expense Breakdown ─────────────────────────────

  _initPieChart(GlobalChart) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    this._pieChart = new GlobalChart(ctx, {
      type: 'doughnut',
      data: {
        labels:   [],
        datasets: [{
          data:            [],
          backgroundColor: [
            'rgba(201,168,76,0.8)',
            'rgba(224,92,92,0.8)',
            'rgba(76,175,138,0.8)',
            'rgba(100,140,230,0.8)',
            'rgba(200,100,200,0.8)',
            'rgba(255,160,80,0.8)',
          ],
          borderColor:  '#0e0f11',
          borderWidth:  2,
          hoverOffset:  8,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        cutout:              '60%',
        plugins: {
          legend: {
            position: 'right',
            labels:   {
              color:       '#8a8790',
              padding:     12,
              boxWidth:    12,
              borderRadius: 3,
            },
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ₹${ctx.raw.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            },
          },
        },
      },
    });
  }

  // ── Update ───────────────────────────────────────────────────

  /**
   * Refresh both charts with fresh data.
   * @param {{ totalIncome: number, totalExpenses: number }} summary
   * @param {Object.<string, number>} expenseBySubCat
   */
  update(summary, expenseBySubCat) {
    this._updateBar(summary.totalIncome, summary.totalExpenses);
    this._updatePie(expenseBySubCat);
  }

  _updateBar(income, expenses) {
    if (!this._barChart) return;
    this._barChart.data.datasets[0].data = [income, expenses];
    this._barChart.update('active');
  }

  _updatePie(expenseBySubCat) {
    if (!this._pieChart) return;
    const labels = Object.keys(expenseBySubCat);
    const data   = Object.values(expenseBySubCat);

    this._pieChart.data.labels                    = labels;
    this._pieChart.data.datasets[0].data          = data;
    this._pieChart.update('active');
  }

  destroy() {
    this._barChart?.destroy();
    this._pieChart?.destroy();
  }
}
