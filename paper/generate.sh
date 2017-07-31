#!/usr/bin/env bash

pandoc -s -S --bibliography ./biblio.yaml --filter pandoc-citeproc --csl ieee.csl paper.md -o paper.pdf || exit 1
open paper.pdf
