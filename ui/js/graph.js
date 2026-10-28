
function drawPositionGraph(samples) {
  if (!samples || samples.length === 0) return;

  const time = samples.map(sample => sample.t);
  const leftPositions = samples.map(sample => sample.left);
  const rightPositions = samples.map(sample => sample.right);

  const data = [
    {
      x: time,
      y: leftPositions,
      type: "scatter",
      mode: "lines",
      name: "Левая машина"
    },
    {
      x: time,
      y: rightPositions,
      type: "scatter",
      mode: "lines",
      name: "Правая машина"
    }
  ];

  const layout = {
    title: "Координаты машин во времени",
    xaxis: {
      title: "Время, с"
    },
    yaxis: {
      title: "Координата, м"
    },
    autosize: true,
    margin: {
      l: 60,
      r: 30,
      t: 50,
      b: 60
    }
  };

  Plotly.newPlot("position-graph", data, layout, {
    responsive: true
  });
}
