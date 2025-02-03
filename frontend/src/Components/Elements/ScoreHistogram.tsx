import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const ScoreHistogram = (props) => {
  let data = props.data;

  data = data.slice(0, 7);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const dataA = data.map((item) => item["solved"]["easy"]);
    const dataB = data.map((item) => item["solved"]["medium"]);
    const dataC = data.map((item) => item["solved"]["hard"]);

    chartInstance.current = new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: data.map((item) => item["name"]),
        datasets: [
          {
            label: "Easy",
            data: dataA,
            backgroundColor: "#a3e78ecc",
            borderColor: "#a3e78e",
            borderWidth: 1,
          },
          {
            label: "Medium",
            data: dataB,
            backgroundColor: "#f3ea90cc",
            borderColor: "#f3ea90",
            borderWidth: 1,
          },
          {
            label: "Hard",
            data: dataC,
            backgroundColor: "#f390cacc",
            borderColor: "#f390ca",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]); // Make sure to include 'data' in the dependency array if it's dynamic

  return (
    <div>
      <h1 class="text-center">Problems Solved by Type</h1>
      <canvas ref={chartRef} width="400" height="110" class="m-4"></canvas>
    </div>
  );
};

export default ScoreHistogram;
