#!/usr/bin/env bash


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ "$1" == "development" ]; then
  source "$DIR/../env/envdevelopment.sh"
else
  source "$DIR/../env/envproduction.sh"
fi


cd $DIR/../mywell-ui/src

#update config.xml and AndroidManifest.xml
echo '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<widget id="com.ionicframework.ionicrainapp175406" version="'$VERSION_NUMBER'" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">' > /tmp/config.xml
tail -n +3 config.xml >> /tmp/config.xml
mv /tmp/config.xml ./config.xml


#build and stuff
cordova build --release android
rm -rf myWell_${VERSION_NUMBER}.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore ~/Developer/lewisdaly-release-key.keystore \
  ./platforms/android/build/outputs/apk/android-release-unsigned.apk \
  lewisdaly_aliaz
~/Library/Android/sdk/build-tools/24.0.2/zipalign -v 4 ./platforms/android/build/outputs/apk/android-release-unsigned.apk myWell_${VERSION_NUMBER}.apk

open .
