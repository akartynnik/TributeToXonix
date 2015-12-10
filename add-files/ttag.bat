@echo off
cd C:\WEB\TTAG\
for /F "tokens=3 delims=/" %%i in (.git/HEAD) do prompt $P (%%i)