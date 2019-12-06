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
  entity = { diameter: 1 }
  updateDocument({ ...output, entity })
  // updateDocument({ ...output, entity: myExternalSystemCall(input) })

  await sleep(2000)
  entity = { diameter: 6666666 }
  updateDocument({ ...output, entity })

  await sleep(5000)
  entity = { diameter: 999999999999 }
  updateDocument({ ...output, entity })
}

//**************************************************************************//
//**************************************************************************//
//**************************************************************************//

var srs = require('./srs.js').srs;


const srs_run = async ({input, output, updateDocument}) => {
    console.log(input)


    runWorkflow({input, output, updateDocument});

    return {}
}

const srs_cancel = async ({input, output, updateDocument}) => {
    return {}
}

const runnableMethods = {
  run,
  srs_run,
  srs_cancel
}

//**************************************************************************//
//**************************************************************************//
//**************************************************************************//

var address = 'http://localhost:8085';

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
	var sharedSecret = null;
	var commandId = 'no.marintek.sima.workflow.run.batch';
	//Example
	//var task = 'Workflow_Example';
	//var workflow = 'Workflow_Introduction';

	// //load json
	// var task = 'myTask';
	// var workflow = 'workflow';

	// //SRS
	// var task = 'SRS_Analysis';
	// var workflow = 'ULS_Intact';

	//FRA single line
	var task = 'FRA_WS_SR_singleLine';
	var workflow = 'WS_singleLineTension';

	//var task = 'SRS_Service';
	//var workflow = 'ULS_Intact';

	var parameters = new Map();
	parameters.set('task', task);
	parameters.set('workflow', workflow);
	parameters.set('distributed', 'false');
	parameters.set('recursive', 'true');
	
	// //Example
	//parameters.set('input', "Hs=3;Tp=10;waveDir=45");

	// //load json
	// //parameters.set('input', "myInput={\"container\":{\"number\":{\"name\":\"number\",\"unit\":\"m\",\"type\":\"marmo:containers:DimensionalScalar\",\"value\":2.0}}}");

	// var container = {}
	// container.sce = input.sce;
	
	// var sceTXT = JSON.stringify(container);
	// console.log(sceTXT);

	// parameters.set('input', "myInput=" + sceTXT);
	
	//SRS
	var container = {}
	container.sce = request.input.entity;	
	var sceTXT = JSON.stringify(container);
	console.log(sceTXT);
	parameters.set('input', "dmt_sce=" + sceTXT);
	//parameters.set('input', "lineNumber=16");

	
	//parameters.set('inputNode', "myinput");
	//parameters.set('inputData', JSON.stringify(input));


	srs.execute(progressId, address, sharedSecret, commandId, parameters
		/* progress handler */
		, function(progress){
            console.log("************    GETTING PROGRESS *****************");

            console.log(progress);
            console.log(request.output);

            var percentage = (progress.getWorked() * 100) / progress.getTotalwork();
            request.output.entity.status.progress = percentage;
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

				parseResults(result, request.output.entity);
				console.log(request.output);	

        //request.output.entity.env =JSON.parse(JSON.stringify(request.input.entity.env));

        //request.output.entity.results.safetyFactor = result.Heave.value[10];
        //for (var propName in result){
        //    var prop = result[propName];
        //    console.log(prop);
        //    if (prop.type == "marmo:containers:EquallySpacedSignal"){
        //        delete prop.attributes;
        //        console.log(prop);
        //        prop.type = "SSR-DataSource/marmo/containers/EquallySpacedSignal";   
        //        request.output.entity.results.signals.push(prop);
        //    }
        //}
				request.updateDocument(request.output);
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
								"tables": [] };

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
			var simaType = prop.attributes.value.type;
			console.log("   " + propName + ":" + simaType)

			if (simaType == 'plot'){
				myReport.plots.push(parsePlot(propName, prop));
			}
			else if (simaType == 'table'){
				parseTable(propName, prop);
			}
			else {
				parseReport(propName, prop, myReport);
			}

		}
	}

	return myReport; 
};

function parseTable(name, stable){
	return true;
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
				var line = parseNesSignal(propName, prop);
				line.xlabel = myplot.xlabel;
				line.label = myplot.ylabel;
				
				myplot.lines.push(line);
			}

		}
	}	
	console.log(myplot);	
	return myplot
}

function parseNesSignal(name, sline){
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
