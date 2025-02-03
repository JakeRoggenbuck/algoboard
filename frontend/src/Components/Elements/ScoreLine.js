import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const ScoreLine = (props) => {
  let data = props.data;

  let transformedData = data.reduce(
    (acc, [id, name, rank, easy, med, hard, date]) => {
      // Check if the name already exists in the accumulator
      if (!acc[name]) {
        acc[name] = []; // Initialize an empty array for this name if it doesn't exist
      }

      // Push the relevant attributes into the array associated with the name
      acc[name].push([rank, easy, med, hard, date]);

      return acc;
    },
    {},
  );

  const dates = data.map((item) => new Date(item[6]));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  minDate.setDate(minDate.getDate() - 1);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const generateChartDatasets = (transformedData) => {
      const datasets = Object.entries(transformedData).reduce(
        (acc, [name, records]) => {
          // Map the records to the desired data structure, e.g., extracting the rank and date
          const data_easy = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(".")[0], // Assuming you want to plot the date on the x-axis
            y: easy, // and the rank on the y-axis
          }));

          const data_med = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(".")[0], // Use the date as the x-axis value
            y: med, // Using the med value for the y-axis
          }));

          const data_hard = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(".")[0], // Use the date as the x-axis value
            y: hard, // Using the hard value for the y-axis
          }));

          const easyValues = data_easy.map((item) => item.y);
          const easy_min = Math.min(...easyValues);

          const adjustedDataEasy = data_easy.map((item) => ({
            x: item.x,
            y: item.y - easy_min,
          }));

          const medValues = data_med.map((item) => item.y);
          const med_min = Math.min(...medValues);

          const adjustedDataMed = data_med.map((item) => ({
            x: item.x,
            y: item.y - med_min,
          }));

          // Find the minimum y value for data_hard
          const hardValues = data_hard.map((item) => item.y);
          const hard_min = Math.min(...hardValues);

          // Subtract the minimum hard value from every y value in data_hard
          const adjustedDataHard = data_hard.map((item) => ({
            x: item.x,
            y: item.y - hard_min,
          }));

          // Check if all y values are the same for this user
          const allYValuesSame_easy = adjustedDataEasy.every(
            (val, _, arr) => val.y === arr[0].y,
          );

          const allYValuesSame_med = adjustedDataMed.every(
            (val, _, arr) => val.y === arr[0].y,
          );

          const allYValuesSame_hard = adjustedDataHard.every(
            (val, _, arr) => val.y === arr[0].y,
          );

          // If y values change, include this dataset
          if (!allYValuesSame_easy) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataEasy,
              backgroundColor: "#a3e78ecc",
              borderColor: "#a3e78e",
              borderWidth: 1,
              fill: false,
            });
          }

          if (!allYValuesSame_med) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataMed,
              backgroundColor: "#f3ea90cc",
              borderColor: "#f3ea90",
              borderWidth: 1,
              fill: false,
            });
          }

          if (!allYValuesSame_hard) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataHard,
              backgroundColor: "#f390cacc",
              borderColor: "#f390ca",
              borderWidth: 1,
              fill: false,
            });
          }

          return acc;
        },
        [],
      );

      return datasets;
    };

    let datasets = generateChartDatasets(transformedData);

    chartInstance.current = new Chart(myChartRef, {
      type: "line",
      data: {
        labels: data.map((item) => item["name"]), // Assuming 'name' is the category for each data point
        datasets: datasets,
      },
      options: {
        padding: {
          left: 0, // Reducing or removing padding on the left
        },
        responsive: true,
        plugins: {
          legend: {
            position: "top", // Adjust legend position as needed
          },
          title: {
            display: true,
            text: "Problems Solved This Week", // Update title to reflect your data context
          },
        },
        scales: {
          y: {
            beginAtZero: false, // Change this based on your data's needs
            title: {
              display: true,
              text: "Problems by difficulty", // Y-axis label
            },
            type: "logarithmic",
            min: 1,
          },
          x: {
            title: {
              display: true,
              text: "Date", // X-axis label
            },

            type: "time",
            time: {
              // unit: 'hour', // Change to hour
              // unitStepSize: 3,
              parser: "yyyy-MM-dd HH:mm:ss", // Parse with date and time
              tooltipFormat: "yyyy-MM-dd HH:mm", // Tooltip with date and time
            },
            min: minDate,
            max: maxDate,
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
      <h1 class="text-center">Problems Solved by Type in the Last Week</h1>
      <canvas ref={chartRef} width="400" height="110" class="m-4"></canvas>
    </div>
  );
};

export default ScoreLine;
