//import ReactDOM from 'react-dom';

const ESSPlotPlugin = ({ document }) => {
  console.log(document)

  let doc = document
  let line = {}
  line['x'] = [0]
  line['y'] = [0]

  if (Array.isArray(doc.value)) {
    line['y'] = doc.value
    line['x'] = []
    for (var i = 0; i < doc.value.length; i++) {
      line.x.push(doc.xstart + i * doc.xdelta)
    }
  }

  let xlabel = doc.xname
  let ylabel = doc.name
  let xunit = ''
  let yunit = ''

  if (doc.xlabel != '') xlabel = doc.xlabel
  if (doc.label != '') ylabel = doc.label

  if (doc.xunit != '') xunit = '[' + doc.xunit + ']'
  if (doc.unit != '') yunit = '[' + doc.unit + ']'

  line['xlabel'] = xlabel + ' ' + xunit
  line['ylabel'] = ylabel + ' ' + yunit

  console.log(line)

  return (
    <Plot
      data={[
        {
          x: line.x,
          y: line.y,
          type: 'scatter',
          mode: 'lines+points',
          marker: { color: 'red' },
        },
      ]}
      layout={{
        width: 620,
        height: 440,
        title: doc.name,
        xaxis: {
          title: line.xlabel,
          showgrid: true,
          zeroline: true,
        },
        yaxis: {
          title: line.ylabel,
          showgrid: true,
          zeroline: true,
        },
      }}
    />
  )
}
export { ESSPlotPlugin as SignalPlot }
