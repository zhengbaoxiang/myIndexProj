@echo off
%1(start /min cmd.exe /c %0 :&exit)
cmd /k "cd /d %~dp0&&npm run dev"
