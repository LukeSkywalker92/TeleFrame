#!/bin/bash
node -e "requrire('$(basename $0)/../js/addonHandler').addonControl('$1', '$2', '$3', '$4')"
