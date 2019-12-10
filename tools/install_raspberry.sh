#!/usr/bin/env bash

# This is an installer script for TeleFrame. It works well enough
# that it can detect if you have Node installed, run a binary script
# and then download and run TeleFrame.

echo -e "\e[0m"
echo '_________ _______  _        _______  _______  _______  _______  _______  _______ '
echo '\__   __/(  ____ \( \      (  ____ \(  ____ \(  ____ )(  ___  )(       )(  ____ \'
echo '   ) (   | (    \/| (      | (    \/| (    \/| (    )|| (   ) || () () || (    \/'
echo '   | |   | (__    | |      | (__    | (__    | (____)|| (___) || || || || (__    '
echo '   | |   |  __)   | |      |  __)   |  __)   |     __)|  ___  || |(_)| ||  __)   '
echo '   | |   | (      | |      | (      | (      | (\ (   | (   ) || |   | || (      '
echo '   | |   | (____/\| (____/\| (____/\| )      | ) \ \__| )   ( || )   ( || (____/\'
echo '   )_(   (_______/(_______/(_______/|/       |/   \__/|/     \||/     \|(_______/'
echo -e "\e[0m"

# Define the tested version of Node.js.
NODE_TESTED="v10.15.2"

# Determine which Pi is running.
ARM=$(uname -m)

# Check the Raspberry Pi version.
if [ "$ARM" != "armv7l" ]; then
	echo -e "\e[91mSorry, your Raspberry Pi is not supported."
	echo -e "\e[91mPlease run TeleFrame on a Raspberry Pi 2 or 3."
	echo -e "\e[91mIf this is a Pi Zero, you are in the same boat as the original Raspberry Pi. You must run in server only mode."
	exit;
fi

# Get user wishes
read -p "Do you want to disable the screensaver (y/N)? " screensaverchoice
read -p "Do you want to your mouse pointer do be autohided (y/N)? " mousechoice
read -p "Do you want use pm2 for auto starting of your TeleFrame (y/N)? " pmchoice
if [[ $pmchoice =~ ^[Yy]$ ]]; then
    read -p "Do you want pm2 to wait for internet connection before auto starting your TeleFrame (y/N)? " pmchoiceInternet
fi
read -p "Please tell me your telegram bot token. Token:  " token

# Define helper methods.
function version_gt() { test "$(echo "$@" | tr " " "\n" | sort -V | head -n 1)" != "$1"; }
function command_exists () { type "$1" &> /dev/null ;}

# Update before first apt-get
echo -e "\e[96mUpdating packages ...\e[90m"
sudo apt-get update || echo -e "\e[91mUpdate failed, carrying on installation ...\e[90m"

# Installing helper tools
echo -e "\e[96mInstalling helper tools ...\e[90m"
sudo apt-get --assume-yes install curl wget git build-essential unzip unclutter x11-xserver-utils sox libsox-fmt-all || exit

# Enable the Open GL driver to decrease Electron's CPU usage
sudo /bin/su -c "echo 'dtoverlay=vc4-fkms-v3d' >> /boot/config.txt"

# Check if we need to install or upgrade Node.js.
echo -e "\e[96mCheck current Node installation ...\e[0m"
NODE_INSTALL=false
if command_exists node; then
	echo -e "\e[0mNode currently installed. Checking version number.";
	NODE_CURRENT=$(node -v)
	echo -e "\e[0mMinimum Node version: \e[1m$NODE_TESTED\e[0m"
	echo -e "\e[0mInstalled Node version: \e[1m$NODE_CURRENT\e[0m"
	if version_gt $NODE_TESTED $NODE_CURRENT; then
		echo -e "\e[96mNode should be upgraded.\e[0m"
		NODE_INSTALL=true

		# Check if a node process is currenlty running.
		# If so abort installation.
		if pgrep "node" > /dev/null; then
			echo -e "\e[91mA Node process is currently running. Can't upgrade."
			echo "Please quit all Node processes and restart the installer."
			exit;
		fi

	else
		echo -e "\e[92mNo Node.js upgrade necessary.\e[0m"
	fi

else
	echo -e "\e[93mNode.js is not installed.\e[0m";
	NODE_INSTALL=true
fi

# Install or upgrade node if necessary.
if $NODE_INSTALL; then

	echo -e "\e[96mInstalling Node.js ...\e[90m"

	# Fetch the latest version of Node.js from the selected branch
	# The NODE_STABLE_BRANCH variable will need to be manually adjusted when a new branch is released. (e.g. 7.x)
	# Only tested (stable) versions are recommended as newer versions could break TeleFrame.

	NODE_STABLE_BRANCH="10.x"
	curl -sL https://deb.nodesource.com/setup_$NODE_STABLE_BRANCH | sudo -E bash -
	sudo apt-get install -y nodejs
	echo -e "\e[92mNode.js installation Done!\e[0m"
fi

# Install TeleFrame
cd ~
if [ -d "$HOME/TeleFrame" ] ; then
	echo -e "\e[93mIt seems like TeleFrame is already installed."
	echo -e "To prevent overwriting, the installer will be aborted."
	echo -e "Please rename the \e[1m~/TeleFrame\e[0m\e[93m folder and try again.\e[0m"
	echo ""
	echo -e "If you want to upgrade your installation run \e[1m\e[97mgit pull\e[0m from the ~/TeleFrame directory."
	echo ""
	exit;
fi

echo -e "\e[96mCloning TeleFrame ...\e[90m"
if git clone --depth=1 https://github.com/LukeSkywalker92/TeleFrame.git; then
	echo -e "\e[92mCloning TeleFrame Done!\e[0m"
else
	echo -e "\e[91mUnable to clone TeleFrame."
	exit;
fi

cd ~/TeleFrame  || exit
echo -e "\e[96mInstalling dependencies ...\e[90m"
# if npm_config_arch is'nt set add it to users .profile
[ -z "$npm_config_arch" ] && (echo -e "# npm archive configuration\nexport npm_config_arch=\$(uname -m)" >> ~/.profile)
if npm install --arch=$ARM; then
	echo -e "\e[92mDependencies installation Done!\e[0m"
else
	echo -e "\e[91mUnable to install dependencies!"
	exit;
fi

echo -e "\e[96mInstalling electron globally ...\e[90m"
if sudo npm install --arch=$ARM -g electron --unsafe-perm=true --allow-root; then
	echo -e "\e[92mElectron installation Done!\e[0m"
else
	echo -e "\e[91mUnable to install electron!"
	exit;
fi

# Use sample config for start TeleFrame
cp config/config.example.js config/config.js
# Put token into config
sed -i "s/\(botToken *: *\).*/\1'$token',/" config/config.js

# Create image directory
echo -e "\e[96mCreating image directory ...\e[90m"
mkdir images

# Check if plymouth is installed (default with PIXEL desktop environment), then install custom splashscreen.
echo -e "\e[96mCheck plymouth installation ...\e[0m"
if command_exists plymouth; then
	THEME_DIR="/usr/share/plymouth/themes"
	echo -e "\e[90mSplashscreen: Checking themes directory.\e[0m"
	if [ -d $THEME_DIR ]; then
		echo -e "\e[90mSplashscreen: Create theme directory if not exists.\e[0m"
		if [ ! -d $THEME_DIR/TeleFrame ]; then
			sudo mkdir $THEME_DIR/TeleFrame
		fi

		if sudo cp ~/TeleFrame/splashscreen/splash.png $THEME_DIR/TeleFrame/splash.png && sudo cp ~/TeleFrame/splashscreen/TeleFrame.plymouth $THEME_DIR/TeleFrame/TeleFrame.plymouth && sudo cp ~/TeleFrame/splashscreen/TeleFrame.script $THEME_DIR/TeleFrame/TeleFrame.script; then
			echo -e "\e[90mSplashscreen: Theme copied successfully.\e[0m"
			if sudo plymouth-set-default-theme -R TeleFrame; then
				echo -e "\e[92mSplashscreen: Changed theme to TeleFrame successfully.\e[0m"
			else
				echo -e "\e[91mSplashscreen: Couldn't change theme to TeleFrame!\e[0m"
			fi
		else
			echo -e "\e[91mSplashscreen: Copying theme failed!\e[0m"
		fi
	else
		echo -e "\e[91mSplashscreen: Themes folder doesn't exist!\e[0m"
	fi
else
	echo -e "\e[93mplymouth is not installed.\e[0m";
fi

# Autohide mouse cursor
if [[ $mousechoice =~ ^[Yy]$ ]]; then
    sudo /bin/su -c "echo '@unclutter -display :0 -idle 3 -root -noevents' >> /etc/xdg/lxsession/LXDE-pi/autostart"
fi

# Disable screensaver
if [[ $screensaverchoice =~ ^[Yy]$ ]]; then
    sudo /bin/su -c "echo '@xset s noblank' >> /etc/xdg/lxsession/LXDE-pi/autostart"
		sudo /bin/su -c "echo '@xset s off' >> /etc/xdg/lxsession/LXDE-pi/autostart"
		sudo /bin/su -c "echo '@xset -dpms' >> /etc/xdg/lxsession/LXDE-pi/autostart"
		sudo /bin/su -c "echo 'xserver-command=X -s 0 -dpms' >> /etc/lightdm/lightdm.conf"
fi

# Use pm2 control like a service TeleFrame
if [[ $pmchoice =~ ^[Yy]$ ]]; then
    sudo npm install -g pm2
    sudo su -c "env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi"
		if [[ $pmchoiceInternet =~ ^[Yy]$ ]]; then
    	pm2 start ~/TeleFrame/tools/pm2_TeleFrame_waitForInternet.json
		else
			pm2 start ~/TeleFrame/tools/pm2_TeleFrame.json
		fi
    pm2 save
fi

echo " "
echo -e "\e[92mWe're ready! Run \e[1m\e[97mDISPLAY=:0 npm start\e[0m\e[92m from the ~/TeleFrame directory to start your TeleFrame.\e[0m"
echo " "
echo " "
