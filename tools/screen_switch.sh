#!/bin/bash

# read http://wiringpi.com/the-gpio-utility/

PIN=$1

# trigger the optocoupler
gpio write $PIN 1
# wait for the display to respond
sleep 0.05
# turn off the trigger
gpio write $PIN 0
