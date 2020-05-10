@echo off
cls
::::::::::::::::::::::::::::::::::::::::::::
:: Alex's final revision elevated perms checker and requester
::  ; note that it does restart the batch file if it does have to request.
::  ; it's a good idea to run this at the beginning of the main script.
::  ; cscript "%temp%\getadmin.vbs" ""%~s0"" %*
::    ; will call for the current script to be ran elevated in a new window, given the vbscript exists.
set "KeepScript=y"
::::::::::::::::::::::::::::::::::::::::::::
:checkPrivileges
echo.
echo  // Checking for admin permissions...
NET FILE 1>NUL 2>NUL
if '%errorlevel%' == '0' ( goto gotPrivileges ) else ( goto getPrivileges )
:getPrivileges
echo    // Requesting for elevated permissions... [UAC Prompt]
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
echo For Each strArg in WScript.Arguments >> "%temp%\getadmin.vbs"
echo If strArg = WScript.Arguments.Item^(0^) Then d = Left^(strArg, InStrRev^(strArg,"\"^) - 1^) >> "%temp%\getadmin.vbs"
echo args = args ^& " " ^& strArg  >> "%temp%\getadmin.vbs"
echo Next >> "%temp%\getadmin.vbs"
echo UAC.ShellExecute "cmd.exe", ^("/c start /D """ ^& d ^& """ /B" ^& args ^& " ^& exit"^), , "runas", 4 >> "%temp%\getadmin.vbs"
cscript "%temp%\getadmin.vbs" ""%~s0"" %*
if NOT defined KeepScript (del /q "%temp%\getadmin.vbs")
exit /B
:gotPrivileges
::::::::::::::::::::::::::::::::::::::::::::
:: V3.1
::::::::::::::::::::::::::::::::::::::::::::
title installer...
cls
WHERE npm install >nul
IF %ERRORLEVEL% NEQ 0 goto :nodeinstall


::::::::::::::::::::::::::::::::::::::::: Node.js installed.
title Installing packages...
@echo on
npm install -d
@echo off
echo.
pause
exit 


::::::::::::::::::::::::::::::::::::::::: Node.js not installed.
:nodeinstall
cls
echo . %*
echo. 
echo  Node is not installed, it's needed^!
echo.
echo  I can automatically install it, but I'll install a lightweight package manager called chocolatey.
echo  Otherwise, you need to download and install Node.js, and open a terminal in the bot folder and type "npm install -d" without quotes.
echo    Note: I have not tested this so if you could comment on github if it works or not that'd be cool.
choice /N /C:YN /M "What do you say^? (YN)"
IF ERRORLEVEL ==1 GOTO MAKE
IF ERRORLEVEL ==2 GOTO NO

:NO
start "" https://nodejs.org/en/
exit

:MAKE
echo.
title Installing Chocolatey...
powershell Set-ExecutionPolicy AllSigned
powershell Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
title Preparing to continue...
echo @echo off>tmp.bat
echo setlocal ^& pushd .>>tmp.bat
echo cd /d "%CD%">>tmp.bat
echo cls>>tmp.bat
echo title Installing Node.js>>tmp.bat
echo choco install nodejs-lts -y --force>>tmp.bat
echo echo. >>tmp.bat
echo echo  That should do it ^^^! >>tmp.bat
echo echo. >>tmp.bat
echo cscript "%temp%\getadmin.vbs" ""%CD%\tmp2.bat"" ^%^*^>NUL >>tmp.bat
echo echo. >>tmp.bat
echo goto :eof>>tmp.bat

echo @echo off>tmp2.bat
echo setlocal ^& pushd .>>tmp2.bat
echo cd /d "%CD%">>tmp2.bat
echo cls>>tmp2.bat
echo title Installing packages...>>tmp2.bat
echo npm install -d>>tmp2.bat
echo echo. >>tmp2.bat
echo echo  Whoo ^^^! >>tmp2.bat
echo echo. >>tmp2.bat
echo pause>>tmp2.bat
echo del "%temp%\getadmin.vbs">>tmp2.bat
echo del /Q tmp.bat>>tmp2.bat
echo del /Q tmp2.bat>>tmp2.bat


cscript "%temp%\getadmin.vbs" ""%CD%\tmp.bat""
echo.
exit