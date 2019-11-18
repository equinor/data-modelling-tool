#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Create a virtual environment pro Project specific tools
[[ -d .venv ]] || {
  echo "Creating a virtual environment" ;
  python3 -m venv .venv ;
}
source .venv/bin/activate

# Install dependencies for build scripts
# We are using doit (https://pydoit.org), as an alternative to Makefile
echo "Installing doit"
pip install doit \
            lxml \
>/dev/null
doit initialize_ide

# Install the pre-commit hooks
if [[ ! $(command -v pre-commit) ]]; then
  echo "Installing pre-commit"
  pip install pre-commit >/dev/null
fi
pre-commit install

# Create the Python classes of the SIMOS, and DMT schemas
doit create:system:blueprints
