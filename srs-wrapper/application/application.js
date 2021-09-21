// chart configurations
var config = {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{label: 'F-MIN',backgroundColor: window.chartColors.red,borderColor: window.chartColors.red,data: [],fill: false},
			{label: 'F-MAX',backgroundColor: window.chartColors.blue,borderColor: window.chartColors.blue,data: [],fill: false}]
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: true,
			text: ' '
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'm'
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'N'
				}
			}]
		}
	}
};

var lastProgress = 'undefined';
var lastExecutionId = 'undefined';
var task = 'Workflow_Example';
var workflow = 'Workflow_Introduction';
var address = '';
var cancelButton = 'cancelButton';
var progressId = 'progressbar';
var connectionLostTimer;

// utility function
function inputToString(input){
	if (input.type == 'number'){
		return input.name +'='+ input.value;
	}			
	return '';
}

function handleProgress(progress){
	lastProgress = progress;
	lastExecutionId = progress.getExecutionid();
	if (lastProgress.getCanceled() || lastProgress.getCompleted()){
		document.getElementById(cancelButton).disabled = true;
	}
}

function handleLog(response){
	var paragraph = document.getElementById("log-text");
	var date = new Date(response.getTimestamp());

	if (response.getText().match('File (.)+ uploaded')){
		var alertNode = document.getElementById("panel");
		var alertText = document.createTextNode(response.getText() + '\n');
		var div = document.createElement('div');
		div.setAttribute('role','alert');
		div.classList.add('alert')
		div.classList.add('alert-success')
		div.classList.add('fade')
		div.classList.add('show');
		alertNode.appendChild(div);
		div.appendChild(alertText);
		var btn = document.createElement('button');
		btn.classList.add('close');
		btn.setAttribute('type','button');
		btn.setAttribute('data-dismiss','alert');
		btn.setAttribute('aria-label','Close');
		btn.dataDismiss
		var span = document.createElement('span');
		span.setAttribute('aria-hidden','true');
		var content = document.createTextNode('×');
		span.appendChild(content);
		btn.appendChild(span);
		div.appendChild(btn);
	}
	
	switch (response.getLevel()){
		case 50000:
			style_class = 'fatal';
			level = '[FATAL] ';
			break;
		case 40000:
			style_class = 'error';
			level = '[ERROR] ';
			break;
		case 30000:
			style_class = 'warn';
			level = '[WARN ] ';
			break;
		case 20000:
			style_class = 'info';
			level = '[INFO ] ';
			break;
		case 10000:
			style_class = 'debug';
			level = '[DEBUG] ';
			break;
		case 5000:
			style_class = 'trace';
			level = '[TRACE] ';
			break;
		default:
			style_class = 'info';
			level = '[INFO] ';
	}
	clearTimeout(connectionLostTimer);
	if (response.getLevel() > 0){
		// add the date
		var datenode = document.createTextNode(date.toString());
		paragraph.appendChild(datenode)
		// add the type (with colour)
		var span = document.createElement('span');
		var levelNode = document.createTextNode(level);
		span.appendChild(levelNode);
		span.classList.add(style_class)
		paragraph.appendChild(span);
		// add the text
		var textNode = document.createTextNode(response.getText() + '\n');
		paragraph.appendChild(textNode)
		window.scrollTo(0, paragraph.scrollHeight);
	} else {
		if (connectionLostTimer !== null){
			clearTimeout(connectionLostTimer);
		}
		// heartbeat
		$("#heartbeat").fadeOut(1000);
		$("#heartbeat").fadeIn(1000);
		connectionLostTimer = setTimeout(connectionLost, 10000);
	}
}

function connectionLost(){
	$("#heartbeat").fadeIn(1000);
}

function handleStatus(status){
	if (status.code != 0){
		switch (status.code){
			case 13: 
				alert('Could not execute workflow due to a server error. Please make sure all parameters are within range.'); 
				break;
			default:
				alert(status.details);
		}
	}		
}

function handleCompleted(){
	srs.getWorkflowResult(address, null, task, workflow, 'output', function(rs){
		var result = JSON.parse(rs.getResult());
		// get the title text
		config.options.title.text = 'Force envelope curve';
		// get the time series container
		var signals = result['Simple_Flexible_Riser']['condition']['Dynamic']['RiserLine']['Force envelope curve'];
		// set the axis units, we assume they are the same for all series in this container
		config.options.scales.xAxes[0].scaleLabel.labelString = signals['F-MIN'].xunit;
		config.options.scales.yAxes[0].scaleLabel.labelString = signals['F-MIN'].unit;
		// set the x-axis values
		config.data.labels = signals['F-MIN'].xvalue;
		// set the y-axis values
		config.data.datasets[0].data = signals['F-MIN'].value;
		config.data.datasets[1].data = signals['F-MAX'].value;
		
		// redraw the chart
		window.myLine.update();
	});
}

function reconnect(url){
	address = url;
	srs.reconnect(address, progressId,
			handleProgress, handleLog, handleCompleted, handleStatus);
}

function cancelWorkflow(url) {
	address = url;
	srs.cancel(address, null, lastExecutionId);
}

function runWorkflow(url, command) {
	address = url;
	var parameters = new Map();
	parameters.set('task', task);
	parameters.set('workflow', workflow);
	parameters.set('distributed', 'false');
	parameters.set('recursive', 'true');
	parameters.set('computeService', 'local'); 
	
	document.getElementById(cancelButton).disabled = false;
	
	// figure out the input values and create a properly formatted string
	// to place in the 'input' parameter
	var forms = document.querySelectorAll('form');
	if (forms !== 'undefined') {
		var form = forms[0];
		var inputs = [];
		[...form.elements].forEach((input) => {
			inputs.push(inputToString(input));
		});
		parameters.set('input', inputs.join(';'));
	}
		
	srs.execute(progressId, address, null, command, parameters,
			handleProgress, handleLog, handleCompleted, handleStatus);
}