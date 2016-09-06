@echo off
echo Visuala: PUBLISHING...
echo Visuala: The build log is located in 'build_log'. In case of issues please send this log to us.
cd C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin
echo Visuala: Creating project (0 / 5)...
echo Visuala: Creating project (0 / 5)... >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova create visuala_hog_psd >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
echo Visuala: Copying files (1 / 5)...
echo Visuala: Copying files (1 / 5)... >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/preview" "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/visuala_hog_psd/www" >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/config" "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/visuala_hog_psd" >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
cd C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/visuala_hog_psd >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
echo Visuala: Adding platform Android (2 / 5)...
echo Visuala: Adding platform Android (2 / 5)... >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova platform add android >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova plugin add cordova-plugin-crosswalk-webview >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
echo Visuala: Moving project to user folder (3 / 5)...
echo Visuala: Moving project to user folder (3 / 5)... >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
mkdir %userprofile%\visuala_temp >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
xcopy /s /Y "C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/visuala_hog_psd" %userprofile%\visuala_temp >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
cd %userprofile%/visuala_temp >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
echo Visuala: Building (4 / 5)...
echo Visuala: Building (4 / 5)... >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova build >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
echo Visuala: Launching (5 / 5)...
echo Visuala: Launching (5 / 5)... >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
call C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/node_modules/cordova/bin/cordova run android >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
cscript C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/js/MessageBox.vbs "Publishing finished." >>"C:/Users/Pavel/AppData/Roaming/Adobe/CEP/extensions/Visuala/projects/visuala_hog_psd/bin/build_log" 2>&1
