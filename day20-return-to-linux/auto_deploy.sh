#!/bin/bash

DEST_DIR="/var/www/chat.io"

function is_program_installed {
  local result=1
  type $1>/dev/null 2>/dev/null || { local result=0; }
  echo $result
}

function install_program {
  if [ `is_program_installed $1` == 0 ]; then
    if [ $1 == "nodejs" ]; then
      if [$installer == "apt-get"]; then
      	curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
      else
      	curl --silent --location https://rpm.nodesource.com/setup_4.x | bash -
      fi
    fi
    sudo $installer -y install $1
  fi
}

# Define OS version
grep Ubuntu /etc/*-release > /dev/null && { installer="apt-get"; }
grep CentOS /etc/*-release > /dev/null && { installer="yum"; }

# Install soft
install_program mc
install_program git
install_program nodejs
install_program npm
install_program nginx

# Get chat from GitHub server
if ! [ -d $DEST_DIR ]; then
  git clone https://github.com/serhii-kobzin/day5-nodejs-basics.git $DEST_DIR
fi

# Install npm modules
cd $DEST_DIR
npm install

# Apply nginx settings
cp $DEST_DIR/chat.io /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/chat.io /etc/nginx/sites-enabled
sudo service nginx restart
