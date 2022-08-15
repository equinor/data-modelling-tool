//import ReactDOM from 'react-dom';

const SIMA_Model_QuadCurrentCoeffPlot = ({ parent, document, children }) => {
  console.log(document)

  let doc = document
  let linesF = []
  let linesM = []

  let xlabel = 'direction'
  let ylabel = 'Current Coeff'
  let xunit = '[deg]'
  let yunit = '[N s^2/m^2]'

  let xlabelF = xlabel + ' ' + xunit
  let ylabelF = ylabel + ' ' + yunit

  //let colors = ['red', 'blue', 'green', 'black', 'orange', ]

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

  for (var i = 1; i <= 3; i++) {
    var line = {
      x: [],
      y: [],
      name: 'c2' + i,
      legend: 'C2' + i,
      type: 'scatter',
      mode: 'lines+points',
      marker: { color: colors[i] },
    }

    linesF.push(line)
  }

  for (var i = 0; i < doc.items.length; i++) {
    for (var li = 0; li < linesF.length; li++) {
      var line = linesF[li]
      var item = doc.items[i]

      console.log(line)
      line.x.push(item.direction)
      line.y.push(item[line.name])
    }
  }

  let xlabelM = xlabel + ' ' + xunit
  let ylabelM = ylabel + ' ' + '[N s^2/m]'

  for (var i = 4; i <= 6; i++) {
    var line = {
      x: [],
      y: [],
      name: 'c2' + i,
      legend: 'C2' + i,
      type: 'scatter',
      mode: 'lines+points',
      marker: { color: colors[i] },
    }

    linesM.push(line)
  }

  for (var i = 0; i < doc.items.length; i++) {
    for (var li = 0; li < linesM.length; li++) {
      var line = linesM[li]
      var item = doc.items[i]

      console.log(line)
      line.x.push(item.direction)
      line.y.push(item[line.name])
    }
  }

  return (
    <form>
      <Plot
        data={linesF}
        layout={{
          width: 820,
          height: 640,
          title: 'Current Forces',
          xaxis: {
            title: xlabelF,
            showgrid: true,
            zeroline: true,
          },
          yaxis: {
            title: ylabelF,
            showgrid: true,
            zeroline: true,
          },
        }}
      />
      <Plot
        data={linesM}
        layout={{
          width: 820,
          height: 640,
          title: 'Current Moments',
          xaxis: {
            title: xlabelM,
            showgrid: true,
            zeroline: true,
          },
          yaxis: {
            title: ylabelM,
            showgrid: true,
            zeroline: true,
          },
        }}
      />
    </form>
  )
}
export { SIMA_Model_QuadCurrentCoeffPlot }
