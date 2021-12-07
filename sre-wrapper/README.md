# Data Modelling Tool SIMA Runtime Engine Job Wrapper

That's long for _DMTSREJW_

This component builds a Docker container that is based on a container for Sintef's SIMA (https://www.sintef.no/en/software/sima/) product.  
This container creates a wrapper that prepares the container before the SIMA run, and uploads the result when the run is complete.

## Setup
Two environment variables must be passed to the container:  
* `SIMA_LICENSE`: The entire content of a valid SIMA licence file.  
* `DMSS_HOST`: Complete URL for the DMSS API to connect to for stask and results

## Commands
The python based wrapper script has two commands;

### Run

```text
Usage: job_wrapper.py run [OPTIONS]

Prepares the local environment with the given stask and workflow
configuration

Options:
-t, --stask TEXT     DataSource and UUID to the stask entity in DMSS
(DS/UUID)  [required]
-w, --workflow TEXT  Name of the workflow defined in the stask to run
[required]
-i, --input TEXT     DataSource and UUID to the input entity in DMSS
(DS/UUID)
--help               Show this message and exit.
```

### Upload

```text
Usage: job_wrapper.py upload [OPTIONS]

Uploads the simulation results to $DMSS_HOST

Options:
--help  Show this message and exit.
```

## Example

```bash
docker build -t sre-wrapper .
docker run -e SIMA_LICENSE=a_very_long_string -e DMSS_HOST=http://localhost:5000 sre-wrapper run --stask=DemoDS/8ec0d646-907c-4eba-9e65-24106236d61c --workflow=wave_180
```