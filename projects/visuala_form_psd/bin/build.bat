cd C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_form_psd//bin
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova create visuala_form_psd
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_form_psd//preview" "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_form_psd//bin/visuala_form_psd/www"
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_form_psd//config" "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_form_psd//bin/visuala_form_psd"
cd C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_form_psd//bin/visuala_form_psd
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova platform add android
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova plugin add cordova-plugin-crosswalk-webview
mkdir %userprofile%\visuala_temp
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_form_psd//bin/visuala_form_psd" %userprofile%\visuala_temp
cd %userprofile%/visuala_temp
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova build
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova run android
