/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

//import ReactDOM from 'react-dom';

//********************************************************//
const StatusView = ({ document }) => {
  //console.log(document)

  return (
    <div className="container">
      <Plot
        data={[
          {
            x: [document.progress],
            y: ['Progress'],
            type: 'bar',
            orientation: 'h',
          },
        ]}
        layout={{
          width: 600,
          height: 200,
          title: '',
          xaxis: {
            title: document.state,
            range: [0, 100],
          },
          yaxis: {
            title: '',
          },
        }}
      />
    </div>
  )
}
//********************************************************//
const RunOutputView = ({ document }) => {
  //console.log(document)

  let status = document.status

  var server_title =
    'Server : ' +
    document.serverConfig.address +
    ':' +
    document.serverConfig.port
  return (
    <div className="container">
      <Plot
        data={[
          {
            x: [status.progress],
            y: ['Progress'],
            type: 'bar',
            orientation: 'h',
          },
        ]}
        layout={{
          width: 600,
          height: 200,
          title: server_title,
          xaxis: {
            title: status.state,
            range: [0, 100],
          },
          yaxis: {
            title: '',
          },
        }}
      />
    </div>
  )
}

//********************************************************//
//********************************************************//

export { RunOutputView as SimposRunOutputView }
export { StatusView as SimposStatusView }
