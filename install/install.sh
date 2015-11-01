#!/bin/bash

# to download the latest repository: 
#git clone https://github.com/pfnegrini/openCV-Streamer.git

asd() {
cat <<"EOT"




                         .^.
                         /   \
                        /     \
                *******/       \*******
           ***** *****/         \***** *****
       ***** ********/           \******** *****
      *** **********/             \********** ***
       ***** ******/               \****** *****
           ***** */        _**_     \* *****
                */      _-******\    \*
                /    _-" *****   "\   \
                \__-"              "\_/



EOT
}

asd

echo -n "Want to confgure RaspberryPi? [Y/N]"
read BUILDUP


if [ "$BUILDUP" == "Y" ]
then
  git clone https://github.com/pfnegrini/BuildUP.git /home/pi/BuildUP
  sudo bash /home/pi/BuildUP/RPi-init.sh
fi

echo -e "***** Setting up  bot-Pi server *****"
sudo cp openCV-StreamerServer /etc/init.d/openCV-StreamerServer
sudo chmod 0755 /etc/init.d/openCV-StreamerServer
sudo update-rc.d openCV-StreamerServer defaults

mkdir /home/pi/Documents
sudo chmod 0755 /home/pi/Documents

mkdir /home/pi/Documents/openCV-StreamerServer
sudo chmod 0755 /home/pi/Documents/openCV-StreamerServer

mkdir /home/pi/Documents/log/
sudo chmod 0755 /home/pi/Documents/log/

cd /home/pi/openCV-Streamer/server/app
npm install


exit 0
