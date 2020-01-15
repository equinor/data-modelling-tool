// This file is tightly coupled with the settings.json file, which contain your application settings.
// The settings file has 'actions', they look like this;
//     {
//       "name": "Calculate",
//       "description": "Simulate 80kmh concrete crash. Fiat panda 2011.",
//       "input": "SSR-DataSource/CarPackage/Car",
//       "output": "SSR-DataSource/CarPackage/Result",
//       "method": "run"
//     },
//
// This action will be available on any entity of the type "SSR-DataSource/CarPackage/Car"(input).
// The name given in "method" must be the name of a function in this file, as well as being in the "runnableMethods" object at the end of this file.
// The main use case for this custom function is to call SIMOS calculations, and update result objects.
// The properties that are passed to the function looks like this;
//       type Input = {
//         blueprint: string
//         entity: any
//         path: string
//         id: string
//       }
//
//       type Output = {
//         blueprint: string
//         entity: any
//         path: string
//         dataSource: string
//         id: string
//       }
//
//       updateDocument(output: Output): Function
//
// Current limitations and caveats;
// * updateDocument is a callBack. That means that if the web-browser get's interrupted(refresh,closed, etc.) the callBack is lost.
// * The API uses a strict type system, so if the output entity does NOT match the output blueprint, that attribute will not be updated.
// * The API uses an "update" strategy when writing the output entity. This means that it merges the existing document with the provided output entity.
// * The output object must be left intact, and posted on every updateDocument call. Everything besides the output.entity object should be considered "read-only".
// Here are a few examples;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function myExternalSystemCall(input) {
  return {
    jobId: 'kk873ks',
    result: 123456,
    executionTime: '1233215.34234ms',
    progress: 100,
    status: 'done',
    message: 'job complete, no errors',
  }
}

async function run({ input, output, updateDocument }) {
  let entity = {
    ...output.entity,
    // This is an invalid attribute. Will not get written to database.
    hallo: 'Hey',
  }
  updateDocument({ ...output, entity })

  // If the browser is interrupted during this sleep, the rest of the function will NOT be executed.
  await sleep(10000)
  entity = { description: 'a' }
  updateDocument({ ...output, entity })
  // updateDocument({ ...output, entity: myExternalSystemCall(input) })

  await sleep(2000)
  entity = { description: 'b' }
  updateDocument({ ...output, entity })

  await sleep(5000)
  entity = { description: 'c' }
  updateDocument({ ...output, entity })
}

async function runResultFile({ input, output, updateDocument }) {
  let entity = { diameter: 1 }
  updateDocument({ ...output, entity })

  await sleep(5000)
  entity = { diameter: 999999999999 }
  updateDocument({ ...output, entity })
}

async function runNoResult({ input, output, updateDocument }) {
	await sleep(5000)
	alert('hallo')
  }
  
async function runResultInEntity({ input, output, updateDocument }) {
	let entity = input.entity
	entity.diameter = 1
	entity.status.progress = 50.12
	updateDocument({ ...output, entity })
  
	await sleep(5000)
	entity.diameter = 999999999999
	entity.status = { ...entity.status, progress: 100, message: 'Done!' }
	updateDocument({ ...output, entity, notify: true })
  }
  
//**************************************************************************//
//**************************************************************************//
//**************************************************************************//

var srs = require('./srs.js').srs;
//**************************************************************************//
const srs_run = async ({input, output, updateDocument}) => {
    console.log(input)

	var request = {input, output, updateDocument};
	request['task'] = 'SRS_Service';
	request['workflow'] = 'ULS_Intact';

	runWorkflow(request);
	
    return {}
}
//**************************************************************************//
const srs_cancel = async ({input, output, updateDocument}) => {
    return {}
}
//**************************************************************************//
const single_run = async ({input, output, updateDocument}) => {
    console.log(input)

	var request = {input, output, updateDocument};
	request['task'] = 'FRA_WS_SR_singleLine';
	request['workflow'] = 'WS_singleLineTension';

    runWorkflow(request);

    return {}
}
//**************************************************************************//
var test_srsRes = require('./test_srs_data.js').srsRes;

const test_single_run = async ({input, output, updateDocument}) => {
    console.log(input)

	test_srsRes.name = output.entity.name;
	output.entity = {...test_srsRes};
    console.log(output)

	updateDocument(output);
	updateDocument(output);

    return {}
}
//**************************************************************************//

const runnableMethods = {
  run,
  runResultFile,
  runNoResult,
  runResultInEntity,
  srs_run,
  srs_cancel,
  single_run,
  test_single_run

}

//**************************************************************************//
//**************************************************************************//
//**************************************************************************//

//var address = 'http://localhost:8085';
var address = 'http://abel.sintef.no:8085';

var lastProgress = 'undefined';
var lastExecutionId = 'undefined';

//**************************************************************************//
function cancelWorkflow() {
	srs.cancel(address, null, lastExecutionId);
}
//**************************************************************************//
function runWorkflow(request) {
	// clear the log window
	var progressId = undefined;
	var sharedSecret = "s3cr3t-p4ssword";
	var commandId = 'no.marintek.sima.workflow.run.batch';

	var task = request.task;
	var workflow = request.workflow;

	var parameters = new Map();
	parameters.set('task', task);
	parameters.set('workflow', workflow);
	parameters.set('distributed', 'false');
	parameters.set('recursive', 'true');
	
	// //Example
	//parameters.set('input', "Hs=3;Tp=10;waveDir=45");

	// //load json
	// //parameters.set('input', "myInput={\"container\":{\"number\":{\"name\":\"number\",\"unit\":\"m\",\"type\":\"marmo:containers:DimensionalScalar\",\"value\":2.0}}}");

	//SRS
	var container = {}
	container.sce = request.input.entity;	
	var sceTXT = JSON.stringify(container);
	console.log(sceTXT);
	parameters.set('input', "dmt_sce=" + sceTXT);

	srs.execute(progressId, address, sharedSecret, commandId, parameters
		/* progress handler */
		, function(progress){
            console.log("************    GETTING PROGRESS *****************");

            console.log(progress);
            console.log(request.output);

            var percentage = (progress.getWorked() * 100) / progress.getTotalwork();
			request.output.entity.status.progress = percentage;
			request.output.entity.status.state = progress.array[1];
			request.updateDocument(request.output);
			
		}		
		/* log handler */
		, function(response){
			// copy the message to the log for reference
			//let percentage = (response.getWorked() * 100) / response.getTotalwork();
            console.log("************    GETTING RESPONSE *****************");
			
			console.log(response);
			console.log(response.getText());
		}
		/* workflow completed handler */
		, function(){
			console.log('Workflow execution has completed');
			var resPath = 'dmt_res';
			srs.getWorkflowResult(address,sharedSecret, task, workflow, resPath, function(rs){
				var result = JSON.parse(rs.getResult());
				console.log("************    READING RESULTS *****************");
				console.log(result);
				console.log(request.output);

				parseResults(result, request.output.entity);
				request.output.entity.status.state = "Finished.";				
				console.log(request.output);	

				request.updateDocument(request.output);
				//request.updateDocument(request.output);

			});
		}
		/* status handler */
		, function(status){
			if (status.code != 0){
				switch (status.code){
					case 13: 
						alert('Could not execute workflow due to a server error. Please make sure all parameters are within range.'); 
						break;
					default: 
						alert(status.metadata);
				}
			}		
		});
}
//**************************************************************************//
//**************************************************************************//

function parseResults(simaRes, dmtRes){
	console.log(simaRes);
	for (var propName in simaRes){
		var prop = simaRes[propName]
		var simaType = prop.attributes.value.type;

		if (simaType == 'report'){
			var myReport = { 	"name": propName,
								"description": "sima report.",
								"type": "SSR-DataSource/mooringSRS/report/Section",
								"title": propName,
								"plots": [],
								"tables": [],
								"sections": [] };

			dmtRes.report = parseReport(propName, prop, myReport);
			console.log(dmtRes);	

		}
	}	
}

function parseReport(name, repFrag, myReport){
	console.log(name + " : parsing report fragment")
	for (var propName in repFrag){
		if (propName != 'attributes'){
			var prop = repFrag[propName]
			var simaType = 'undefined';
			if (typeof prop.attributes !== 'undefined') {
				simaType = prop.attributes.value.type;
			}
			console.log("   " + propName + ":" + simaType)

			if (simaType == 'plot'){
				myReport.plots.push(parsePlot(propName, prop));
			}
			else if (simaType == 'table'){
				myReport.tables.push(parseTable(propName, prop));
			}
			else if (simaType == 'section'){
				var mysec = {
					"name": propName,
					"description": "report section.",
					"type": "SSR-DataSource/mooringSRS/report/Section",
					"title": propName,
					"plots": [],	
					"tables": [],
					"sections": []};

				myReport.sections.push(mysec)
				parseReport(propName, prop, mysec);
			}		
			else {
				if (typeof prop === 'object' && prop !== null) {
					parseReport(propName, prop, myReport);
				}
			}

		}
	}

	return myReport; 
};

function parseTable(name, stable){
	var mytable = {
		"name": name,
		"description": "table.",
		"type": "SSR-DataSource/mooringSRS/report/table/ColTable",
		"title": name,
		"caption": stable.attributes.value.caption,	
		"transposed": ((String(stable.attributes.value.transposed) == 'true') ? true : false),
		"strColumns": [],
		"numColumns": [] }   

	for (var propName in stable){
		if (propName != 'attributes'){
			var prop = stable[propName]
			var simosType = prop.type;

			if ( (simosType == 'marmo:containers:NonEquallySpacedSignal') ||
				 (simosType == 'marmo:containers:EquallySpacedSignal') ){
				//var numCol = numSignal_to_NumberColumn(propName, prop);
				//mytable.numColumns.push(numCol);

				var strCol = numSignal_to_StringColumn(propName, prop);
				mytable.strColumns.push(strCol);

			}	
			else if (simosType == 'marmo:containers:DimensionalScalar'){
				var strCol = numScalar_to_StringColumn(propName, prop);
				mytable.strColumns.push(strCol);				
			}	
			else if (simosType == 'marmo:containers:SimpleString'){
				var strCol = strSingle_to_StringColumn(propName, prop);
				mytable.strColumns.push(strCol);				
			}							
			else if (simosType == 'marmo:containers:StringArray'){
				var strCol = strSignal_to_StringColumn(propName, prop);
				mytable.strColumns.push(strCol);				
			}			
			else {
				console.log("type: " + simosType + " on a column of a table is not known.");
			}			

		}
	}	
	return mytable;
}

function numSignal_to_NumberColumn(name, scol){
	console.log("      " + name + " : parsing num column.")

	var mycol = {
    "name": scol.name,
    "description": ((scol.description == undefined) ? "" : scol.description),
	"type": "SSR-DataSource/mooringSRS/report/table/NumberColumn",
	"header": ((scol.attributes.value.header == undefined) ? scol.name : scol.attributes.value.header),
	"label": ((scol.label == undefined) ? "" : scol.label),
	"fontSize": ((scol.attributes.value.fontsize == undefined) ? 10 : scol.attributes.value.fontsize),
	"value": scol.value.slice()
	};

	return mycol;

}

function numScalar_to_StringColumn(name, scol){
	console.log("      " + name + " : parsing num column.")

	var mycol = {
    "name": scol.name,
    "description": ((scol.description == undefined) ? "" : scol.description),
	"type": "SSR-DataSource/mooringSRS/report/table/StringColumn",
	"header": ((scol.attributes.value.header == undefined) ? scol.name : scol.attributes.value.header),
	"label": ((scol.label == undefined) ? "" : scol.label),
	"fontSize": ((scol.attributes.value.fontsize == undefined) ? 10 : scol.attributes.value.fontsize),
	"value": [( (isNaN(scol.value)) ? "NaN" : String(Number(Number(scol.value).toFixed(2))) )]
	};

	return mycol;

}

function strSingle_to_StringColumn(name, scol){
	console.log("      " + name + " : parsing num column.")

	var mycol = {
    "name": scol.name,
    "description": ((scol.description == undefined) ? "" : scol.description),
	"type": "SSR-DataSource/mooringSRS/report/table/StringColumn",
	"header": ((scol.attributes.value.header == undefined) ? scol.name : scol.attributes.value.header),
	"label": ((scol.label == undefined) ? "" : scol.label),
	"fontSize": ((scol.attributes.value.fontsize == undefined) ? 10 : scol.attributes.value.fontsize),
	"value": [String(scol.value)]
	};

	return mycol;

}

function numSignal_to_StringColumn(name, scol){
	console.log("      " + name + " : parsing num column.")

	var mycol = {
    "name": scol.name,
    "description": ((scol.description == undefined) ? "" : scol.description),
	"type": "SSR-DataSource/mooringSRS/report/table/StringColumn",
	"header": ((scol.attributes.value.header == undefined) ? scol.name : scol.attributes.value.header),
	"label": ((scol.label == undefined) ? "" : scol.label),
	"fontSize": ((scol.attributes.value.fontsize == undefined) ? 10 : scol.attributes.value.fontsize),
	"value": scol.value.map(function(val) {
								if (isNaN(val)){
									return("NaN");
								}
								else {
									return (String(Number(Number(val).toFixed(2))));
								}
							}) 
	};

	return mycol;

}

function strSignal_to_StringColumn(name, scol){
	console.log("      " + name + " : parsing str column.")

	var mycol = {
		"name": scol.name,
		"description": ((scol.description == undefined) ? "" : scol.description),
		"type": "SSR-DataSource/mooringSRS/report/table/StringColumn",
		"header": ((scol.attributes.value.header == undefined) ? scol.name : scol.attributes.value.header),
		"label": ((scol.attributes.value.label == undefined) ? "" : scol.attributes.value.label),
		"fontSize": ((scol.attributes.value.fontsize == undefined) ? 10 : scol.attributes.value.fontsize),
		"value": scol.value.slice()
		};
	return mycol;

}

function parsePlot(name, splot){
	console.log("   " + name + " : parsing plot.")

	var myplot = {
		"name": name,
		"description": "plot.",
		"type": "SSR-DataSource/mooringSRS/report/plot/XYPlot",
		"xlabel": splot.attributes.value.xlabel,
		"ylabel": splot.attributes.value.ylabel,
		"title": splot.attributes.value.title,
		"caption": splot.attributes.value.caption,
		"lines": [] }                    

	for (var propName in splot){
		if (propName != 'attributes'){
			var prop = splot[propName]
			var simosType = prop.type;

			if (simosType == 'marmo:containers:NonEquallySpacedSignal'){
				var line = nesSignal_to_Line(propName, prop);
				line.xlabel = myplot.xlabel;
				line.label = myplot.ylabel;
				
				myplot.lines.push(line);
			}

		}
	}	
	console.log(myplot);	
	return myplot
}

function nesSignal_to_Line(name, sline){
	console.log("      " + name + " : parsing line.")

	var myline = {
    "name": sline.name,
    "description": sline.description,
	"type": "SSR-DataSource/mooringSRS/report/plot/Line",
	"xname": sline.xname,
	"xlabel": sline.xlabel,
	"xdescription": sline.xdescription,
	"xunit": sline.xunit,
	"xvalue": sline.xvalue.slice(),
	"value": sline.value.slice(),
	"unit": sline.unit,
	"label": sline.label,
	"legend": sline.attributes.value.legend,
	"style": getLineStyle(sline.attributes.value.lineStyle),
	"width": sline.attributes.value.lineWidth,
	"pointSize": sline.attributes.value.pointSize,
	"pointStyle": getPointStyle(sline.attributes.value.pointStyle)
	}

	return myline;

}

function getLineStyle(sstyle){
	if (sstyle == "Solid line"){
		return "solid";
	}
	else {
		return sstyle
	}
}

function getPointStyle(sstyle){
	return sstyle
}
//**************************************************************************//
//**************************************************************************//
export default runnableMethods
