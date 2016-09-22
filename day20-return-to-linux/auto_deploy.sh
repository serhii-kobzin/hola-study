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
			if [ $installer == "yum" ]; then
				curl --silent --location https://rpm.nodesource.com/setup_4.x | bash -
			else
				curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
			fi
		fi
		if [ $1 == "nginx" ]; then
			if [ $installer == "yum" ]; then
				sudo mv $DEST_DIR/nginx.repo /etc/yum.repos.d
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
install_program nodejs
install_program git

# Get chat from GitHub server
if ! [ -d $DEST_DIR ]; then
	sudo git clone https://github.com/serhii-kobzin/day5-nodejs-basics.git $DEST_DIR
fi

# Install npm modules
cd $DEST_DIR
sudo npm install

# Install nginx
install_program nginx

#Apply nginx settings
if [ $installer == "yum" ]; then
	if [ -f $DEST_DIR/chat.conf ]; then
		sudo mv $DEST_DIR/chat.conf /etc/nginx/conf.d
	fi
	setenforce Permissive
	sudo systemctl restart nginx.service
else
	if [ -f $DEST_DIR/chat.conf ]; then
		sudo mv $DEST_DIR/chat.conf /etc/nginx/sites-available
	fi
	sudo ln -s /etc/nginx/sites-available/chat.io /etc/nginx/sites-enabled
	sudo service nginx restart
fi 

#Create daemon for node and start it
if [ -f $DEST_DIR/chat.conf ]; then
	sudo mv $DEST_DIR/chat /etc/init.d
	sudo chmod +x /etc/init.d/chat
fi
if [ $installer == "yum" ]; then
	sudo chkconfig --add chat
	sudo systemctl start chat.service
else
	sudo update-rc.d chat defaults
	sudo service chat start
fi
