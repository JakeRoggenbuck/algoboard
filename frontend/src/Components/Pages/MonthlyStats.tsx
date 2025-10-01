import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js/auto';

export default function ProblemsChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchAndProcessData();
  }, []);

  const fetchAndProcessData = async () => {
    try {
      const response = await fetch('https://api.algoboard.org/entries/everyone');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      // Process data: each entry is [id, username, rank, easy, medium, hard, timestamp]
      // Group by user and sort by timestamp to calculate deltas
      const userEntries = {};
      
      data.forEach(entry => {
        const username = entry[1];
        if (!userEntries[username]) {
          userEntries[username] = [];
        }
        userEntries[username].push({
          timestamp: entry[6],
          easy: entry[3] || 0,
          medium: entry[4] || 0,
          hard: entry[5] || 0
        });
      });
      
      // Calculate deltas for each user and aggregate by month
      const monthlyData = {};
      
      Object.keys(userEntries).forEach(username => {
        const entries = userEntries[username].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const date = new Date(entry.timestamp);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { easy: 0, medium: 0, hard: 0 };
          }
          
          if (i === 0) {
            // First entry for this user - count all problems
            monthlyData[monthKey].easy += entry.easy;
            monthlyData[monthKey].medium += entry.medium;
            monthlyData[monthKey].hard += entry.hard;
          } else {
            // Calculate delta from previous entry
            const prev = entries[i - 1];
            monthlyData[monthKey].easy += Math.max(0, entry.easy - prev.easy);
            monthlyData[monthKey].medium += Math.max(0, entry.medium - prev.medium);
            monthlyData[monthKey].hard += Math.max(0, entry.hard - prev.hard);
          }
        }
      });
      
      // Sort months and get last 12 months
      const sortedMonths = Object.keys(monthlyData).sort();
      const last12Months = sortedMonths.slice(-12);
      
      // Prepare data for chart
      const labels = last12Months.map(month => {
        const [year, m] = month.split('-');
        const date = new Date(year, m - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      });
      
      const easyData = last12Months.map(month => monthlyData[month].easy);
      const mediumData = last12Months.map(month => monthlyData[month].medium);
      const hardData = last12Months.map(month => monthlyData[month].hard);
      
      // Calculate totals
      const totalEasy = easyData.reduce((a, b) => a + b, 0);
      const totalMedium = mediumData.reduce((a, b) => a + b, 0);
      const totalHard = hardData.reduce((a, b) => a + b, 0);
      
      setStats({
        totalEasy,
        totalMedium,
        totalHard,
        grandTotal: totalEasy + totalMedium + totalHard
      });
      
      setLoading(false);
      
      // Create chart
      if (chartRef.current) {
        // Destroy previous chart instance if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart.Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Easy',
                data: easyData,
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
              },
              {
                label: 'Medium',
                data: mediumData,
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                borderColor: 'rgba(255, 152, 0, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
              },
              {
                label: 'Hard',
                data: hardData,
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                borderColor: 'rgba(244, 67, 54, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: false,
                grid: {
                  display: false
                }
              },
              y: {
                stacked: false,
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: {
                    size: 14
                  },
                  padding: 20
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          📊 Problems Solved by Difficulty
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Monthly breakdown for the past year
        </p>
        
        {loading && (
          <div className="text-center py-20 text-gray-600 text-lg">
            Loading data...
          </div>
        )}
        
        {error && (
          <div className="text-center py-20 text-red-600 text-base">
            Error loading data: {error}
          </div>
        )}
        
        {!loading && !error && (
          <>
            <div className="relative h-96 mb-8">
              <canvas ref={chartRef}></canvas>
            </div>
            
            {stats && (
              <div className="flex flex-wrap justify-around gap-4">
                <div className="text-center p-6 bg-gray-50 rounded-xl min-w-36">
                  <div className="text-gray-600 text-sm mb-2">Total Easy</div>
                  <div className="text-4xl font-bold text-green-600">
                    {stats.totalEasy.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gray-50 rounded-xl min-w-36">
                  <div className="text-gray-600 text-sm mb-2">Total Medium</div>
                  <div className="text-4xl font-bold text-orange-500">
                    {stats.totalMedium.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gray-50 rounded-xl min-w-36">
                  <div className="text-gray-600 text-sm mb-2">Total Hard</div>
                  <div className="text-4xl font-bold text-red-600">
                    {stats.totalHard.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gray-50 rounded-xl min-w-36">
                  <div className="text-gray-600 text-sm mb-2">Grand Total</div>
                  <div className="text-4xl font-bold text-gray-800">
                    {stats.grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
