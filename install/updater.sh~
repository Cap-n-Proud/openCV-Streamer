#!/bin/bash

#Parse data from the json config file
remoteRepository="https://github.com/pfnegrini/bot-Pi.git"
installPath="$(ruby -rjson -e 'j = JSON.parse(File.read("/home/pi/bot-Pi/server/app/config.json")); puts j["server"]["installPath"]')"
#Check installed release from config file
installedVersion="$(ruby -rjson -e 'j = JSON.parse(File.read("/home/pi/bot-Pi/server/app/config.json")); puts j["server"]["version"]')"

updateDir="/tmp/update"

#Check current release
latestVersion="$(git ls-remote $remoteRepository | grep -o 'refs/tags/[0-9]*' | sort -V | head | grep -o '[^\/]*$' | tail -1)" 

repositoryFile="https://github.com/pfnegrini/bot-Pi/archive/"$latestVersion".tar.gz"

echo current version $installedVersion latest $latestVersion
if [ "$latestVersion" -gt "$installedVersion" ]; 
then
    
    echo Need update
    mkdir $updateDir
    echo downloading repository $repositoryFile
    wget  $repositoryFile -P $updateDir
    rm -rf $installPath
    mkdir $installPath
    tar -xvf $updateDir/$latestVersion.tar.gz -C $installPath --strip 1
    rm -rf $updateDir
    
    else

    echo Software up-to-date
fi
