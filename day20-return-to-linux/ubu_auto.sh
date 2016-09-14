#!/bin/bash

function is_program_installed {
    local result=1
    type $1>/dev/null 2>/dev/null || { local result=0; }
    echo $result
}

function install {
    if [ `is_program_installed $1` == 0 ]; then
	sudo apt-get -y install $1
    fi
}

install git
install node
install npm

if ! [ -d files ]; then
    git clone https://github.com/serhii-kobzin/day5-nodejs-basics.git files
fi

cd files && npm install
