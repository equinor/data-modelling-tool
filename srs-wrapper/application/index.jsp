<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>${title}</title>
	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" 
		integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" 
		crossorigin="anonymous">
	<link rel="stylesheet" href="dist/sticky-footer-navbar.css">
	<style type="text/css">
		.fatal {
			color: red;
		}
		.error {
			color: crimson;
		}
		.warn {
			color: darkkhaki;
		}
		.info {
			color: royalblue;
		}
		.debug {
			color: burlywood;
		}
		.debug {
			color: lightgray;
		}
		.chart-container {
			position: relative;
			margin: auto;
			height: 400px;
		}
	</style>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/site.webmanifest">
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="theme-color" content="#ffffff">
</head>
<body>
	<header>
		<div class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="navbar-brand">${title}</div>
			<img src="dist/sima-128x32bit.png" width="64px" style="right: 0px; top: 2px; position: absolute" />
			<div class="collapse navbar-collapse" id="nav-tab">
				<ul class="nav navbar-nav" id="navbar-tablist" role="tablist" >
					<li class="nav-item">
						<a class="nav-link active" id="nav-home-tab" data-toggle="tab" 
							href="#nav-home" role="tab" aria-controls="home"
							aria-selected="true">Home<span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item">
						<a class="nav-link" id="nav-log-tab" data-toggle="tab" 
							href="#nav-log" role="tab" aria-controls="log" 
							aria-selected="false">Log</a>
					</li>
				</ul>
			</div>
		</div>
	</header>

	<main class="container-fluid" style="margin-top: 4em;">
		<div class="tab-content">
			<div class="tab-pane fade active show" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
				<div class="row">
					<div class="col-8">
						<p>This web application demonstrates a SIMA
							Runtime Application operated using a Web UI. The entire example is
							running in a Docker container.</p>
						<p>
							Every time you press <kbd>Start Workflow</kbd>, 
							a workflow execution will be started in the SIMA instance within the
							container. The log and progress bar will update according to the actual
							state of the progress within SIMA. In this case the <i>simple
								flexible riser</i> example case will be executed. Putting the browser in
							debug mode will allow you to look at the log messages. Try looking at
							the contents of the <a href="${service_url}/workspace/">workspace
								folder</a> before and after running the workflow.</p>
					</div>
					<div class="col-4">
						<img src="simple_flexible_riser.png" class="img-fluid"></img>
					</div>
				</div>
				<div class="row">
					<div class="col-4">
						<form>
							<h5>Input values</h5>
							<div class="form-group row">
								<label
									for="Hs"
									class="col-sm-4 col-form-label">Hs:</label>
								<div class="col-sm-8">
									<input
										type="number"
										class="form-control"
										id="Hs"
										name="Hs"
										aria-describedby="HsHelp"
										value="3.0"
										placeholder="3.0"> <small
										id="HsHelp"
										class="form-text text-muted">Significant wave height.</small>
								</div>
							</div>
							<div class="form-group row">
								<label
									for="Tp"
									class="col-sm-4 col-form-label">Tp:</label>
								<div class="col-sm-8">
									<input
										type="number"
										class="form-control"
										id="Tp"
										name="Tp"
										aria-describedby="TpHelp"
										value="10.0"
										placeholder="10.0"> <small
										id="TpHelp"
										class="form-text text-muted">Peak period.</small>
								</div>
							</div>
							<div class="form-group row">
								<label
									for="waveDir"
									class="col-sm-4 col-form-label">waveDir:</label>
								<div class="col-sm-8">
									<input
										type="number"
										class="form-control"
										id="waveDir"
										name="waveDir"
										aria-describedby="waveDirHelp"
										value="45.0"
										placeholder="45"> <small
										id="waveDirHelp"
										class="form-text text-muted">Wave direction.</small>
								</div>
							</div>
						</form>
						<div>
							<div class="col" id="panel">
								<div
									class="progress"
									style="margin-bottom: 1em">
									<div
										id="progressbar"
										class="progress-bar"
										role="progressbar"
										style="height: 32px; width: 0%; aria-valuenow: 0; aria-valuemin: 0; aria-valuemax: 100; font-size: 8px"></div>
								</div>
								<div
									class="btn-group"
									role="group">
									<button
										id="startButton"
										type="button"
										class="btn btn-sm btn-primary"
										onclick="runWorkflow('${service_url}','run')">Start workflow locally</button>
										<!-- 
									<button
										id="startButton"
										type="button"
										class="btn btn-sm btn-primary"
										onclick="runWorkflow('${service_url}','remote-run')">Start workflow on cluster</button>
										 -->
									<button
										id="cancelButton"
										disabled="true"
										type="button"
										class="btn btn-sm btn-danger"
										data-progress=""
										onclick="cancelWorkflow('${service_url}')">Stop workflow</button>
								</div>
								<br/> <br/>
							</div> <!-- col -->
						</div>
					</div> <!-- col -->
					<div class="col-8 chart-container">
							<canvas
								id="chart-area">
							</canvas>
					</div> <!-- col -->
				</div> <!-- row -->
				<div class="row">
					<div
						class="col card collapse"
						id="log-container">
						<div class="card-body">
							<h5 class="card-title">Workflow execution log</h5>
							<div
								id="log"
								class="card-text"
								contenteditable="true"
								style="border: 0px; font-size: 8pt; font-family: monospace"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane fade" id="nav-log" role="tabpanel" aria-labelledby="nav-log-tab">
				<pre id="log-text" style="font-size: 8pt"></pre>
			</div>
		</div>
	</main>	
	<footer class="footer">
		<div class="container">
			<span class="text-muted font-weight-light" style="font-size: 0.9em;">Built on ${buildtime} using SIMA Runtime Environment version ${git_build_version} (${git_build_host} ${git_build_time})</span>
			<img src="dist/heartbeat.svg" 
				id="heartbeat" height="24px" width="24px" 
				style="right: 8px; top: 16px; position: absolute; display: block;"/>
		</div>
	</footer>
</body>
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script
	src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
	integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
	crossorigin="anonymous"></script>
<script
	src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
	integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
	crossorigin="anonymous"></script>
<!-- SIMA Runtime client library -->
<script
	type='text/javascript'
	src="./dist/srs.js"></script>

<!-- Charting library -->
<script
	type='text/javascript'
	src="./dist/Chart.bundle.min.js"></script>

<!-- Utilities for the charting library -->
<script
	type='text/javascript'
	src="./dist/util.js"></script>

<!-- The actual application code -->
<script
	type='text/javascript'
	src="application.js"></script>
<script>
	window.onpageshow = function() {
		var ctx = document.getElementById('chart-area').getContext('2d');
		window.myLine = new Chart(ctx, config);
		reconnect('${service_url}');
	};
</script>
</html>