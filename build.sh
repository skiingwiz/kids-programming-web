#!/bin/bash

dir=$(readlink -f $(dirname $0))

rm -rf $dir/build
mkdir -p $dir/build/dist

python3 -m venv .venv

.venv/bin/pip install -U Jinja2
./process_templates.py

cp $dir/src/js/* $dir/build/dist/
cp $dir/src/css/* $dir/build/dist/

