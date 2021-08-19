REM del ".\dist\server\*.*" /F /Q

set folder=".\dist"
cd /d %folder%
for /F "delims=" %%i in ('dir /b') do (rmdir "%%i" /s/q || del "%%i" /s/q)

cd ../