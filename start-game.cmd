@echo off
setlocal
cd /d "%~dp0"
set "TOWN_NODE="
call :tryNode "%KNOWLEDGE_TOWN_NODE%"
call :tryNode "%~dp0runtime\node.exe"
for /f "delims=" %%N in ('%SystemRoot%\System32\where.exe node 2^>nul') do call :tryNode "%%N"
call :tryNode "%ProgramFiles%\nodejs\node.exe"
call :tryNode "%LOCALAPPDATA%\Programs\nodejs\node.exe"
call :tryNode "%NVM_SYMLINK%\node.exe"
call :tryNode "%VOLTA_HOME%\bin\node.exe"
call :tryNode "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined TOWN_NODE goto missingNode
echo Using Node.js: "%TOWN_NODE%"
if /i "%~1"=="--check-runtime" goto checked
if /i "%~1"=="--no-open" goto noOpen
"%TOWN_NODE%" "scripts\launch-game.cjs"
goto finished
:noOpen
"%TOWN_NODE%" "scripts\launch-game.cjs" --no-open
:finished
set "TOWN_EXIT=%errorlevel%"
if not "%TOWN_EXIT%"=="0" pause
exit /b %TOWN_EXIT%
:checked
"%TOWN_NODE%" --version
exit /b %errorlevel%
:tryNode
if defined TOWN_NODE exit /b 0
if "%~1"=="" exit /b 1
if /i not "%~x1"==".exe" exit /b 1
if not exist "%~1" exit /b 1
"%~1" -e "process.exit(Number(process.versions.node.split('.')[0]) >= 22 ? 0 : 1)" >nul 2>nul
if errorlevel 1 exit /b 1
set "TOWN_NODE=%~1"
exit /b 0
:missingNode
echo Could not find a working Node.js 22+ runtime in PATH or the standard local locations.
echo Set KNOWLEDGE_TOWN_NODE to an existing node.exe, or install Node.js 22+.
pause
exit /b 1
