//import ReactDOM from 'react-dom';

function ModeData({ rao, motInd }) {
  console.log(rao)

  let fig = {}

  fig.traces = []

  fig.xlabel = 'frequencies [rad/s]'

  var modes = ['Surge', 'Sway', 'Heave', 'Roll', 'Pitch', 'Yaw']
  var units = ['m/m', 'm/m', 'm/m', 'deg/m', 'deg/m', 'deg/m']

  fig.ylabel = modes[motInd] + '[' + units[motInd] + ']'

  fig.title = modes[motInd] + ' RAO'

  let colors = [
    '#636EFA',
    '#EF553B',
    '#00CC96',
    '#AB63FA',
    '#FFA15A',
    '#19D3F3',
    '#FF6692',
    '#B6E880',
    '#FF97FF',
    '#FECB52',
  ]

  for (var i = 0; i < rao.directions.length; i++) {
    var trace = {
      x: rao.frequencies,
      y: [],
      name: 'WaveDir=' + rao.directions[i] + '[deg]',
      legend: 'WaveDir=' + rao.directions[i] + '[deg]',
      type: 'scatter',
      mode: 'lines+points',
      //marker: { color: colors[i] },
      line: { dash: 'solid' },
    }
    var stInd =
      motInd * rao.directions.length * rao.frequencies.length +
      i * rao.frequencies.length
    var enInd = stInd + rao.frequencies.length
    for (var j = stInd; j < enInd; j++) {
      trace.y.push(
        Math.sqrt(
          Math.pow(rao.realvalues[j], 2) + Math.pow(rao.imagValues[j], 2)
        )
      )
    }

    fig.traces.push(trace)
  }

  return (
    <Plot
      data={fig.traces}
      layout={{
        width: 820,
        height: 640,
        title: fig.title,
        xaxis: {
          title: fig.xlabel,
          showgrid: true,
          zeroline: true,
          range: [0, 2],
        },
        yaxis: {
          title: fig.ylabel,
          showgrid: true,
          zeroline: true,
        },
      }}
    />
  )
}

const SIMA_Model_FirstOrderMotionTransferFunction = ({ document }) => {
  console.log(document)

  return (
    <form>
      <ModeData rao={document} motInd={0} />
      <ModeData rao={document} motInd={1} />
      <ModeData rao={document} motInd={2} />
      <ModeData rao={document} motInd={3} />
      <ModeData rao={document} motInd={4} />
      <ModeData rao={document} motInd={5} />
    </form>
  )
}
export { SIMA_Model_FirstOrderMotionTransferFunction }
