#!/usr/bin/env bash

EXTENSION=pdf

if [ "$1" == "word" ]; then
  EXTENSION=docx
fi

pandoc -s -S --bibliography ./biblio.yaml --filter pandoc-citeproc --csl ieee.csl paper.md -o paper."$EXTENSION" || exit 1
open paper."$EXTENSION"
