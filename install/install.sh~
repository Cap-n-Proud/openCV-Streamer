#!/bin/bash

# to download the latest repository: 
#git clone https://github.com/pfnegrini/bot-Pi.git /home/pi/bot-Pi

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
sudo cp bot-PiServer /etc/init.d/bot-PiServer
sudo chmod 0755 /etc/init.d/bot-PiServer
sudo update-rc.d bot-PiServer defaults

mkdir /home/pi/Documents
sudo chmod 0755 /home/pi/Documents

mkdir /home/pi/Documents/bot-Pi
sudo chmod 0755 /home/pi/Documents/bot-Pi

mkdir /home/pi/Documents/log/
sudo chmod 0755 /home/pi/Documents/log/


echo -e "***** Setting up  OpenCV *****"
sudo apt-get install -y build-essential cmake pkg-config
sudo apt-get install -y libjpeg8-dev libtiff4-dev libjasper-dev libpng12-dev
sudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
sudo apt-get install -y libgtk2.0-dev
sudo apt-get install -y libatlas-base-dev gfortran
wget https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py
sudo pip install virtualenv virtualenvwrapper
sudo rm -rf ~/.cache/pip

# virtualenv and virtualenvwrapper
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
source ~/.profile
mkvirtualenv cv

sudo apt-get install -y python2.7-dev
pip install numpy

wget -O opencv-2.4.11.zip http://sourceforge.net/projects/opencvlibrary/files/opencv-unix/2.4.11/opencv-2.4.11.zip/download
unzip opencv-2.4.11.zip
cd opencv-2.4.11

echo -e "***** Configuring make *****"
mkdir build
cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local -D BUILD_NEW_PYTHON_SUPPORT=ON -D INSTALL_C_EXAMPLES=ON -D INSTALL_PYTHON_EXAMPLES=ON  -D BUILD_EXAMPLES=ON ..


echo -e "***** Compiling *****"
make

sudo make install
sudo ldconfig

cd ~/.virtualenvs/cv/lib/python2.7/site-packages/
ln -s /usr/local/lib/python2.7/site-packages/cv2.so cv2.so
ln -s /usr/local/lib/python2.7/site-packages/cv.py cv.py

cd /home/pi/bot-Pi/server/app
npm install


exit 0
