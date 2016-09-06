cd C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_piano_psd/bin
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova create visuala_piano_psd
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_piano_psd/preview" "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_piano_psd/bin/visuala_piano_psd/www"
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_piano_psd/config" "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_piano_psd/bin/visuala_piano_psd"
cd C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_piano_psd/bin/visuala_piano_psd
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova platform add android
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova plugin add cordova-plugin-crosswalk-webview
mkdir %userprofile%\visuala_temp
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_piano_psd/bin/visuala_piano_psd" %userprofile%\visuala_temp
cd %userprofile%/visuala_temp
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova build
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova run android
