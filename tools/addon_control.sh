#!/bin/bash
node -e "require('$(realpath $(dirname $0))/../js/addonInterface').addonControl('$1', '$2', '$3', $4)"
