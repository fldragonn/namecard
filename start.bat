@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if not errorlevel 1 goto use_python

where py >nul 2>nul
if not errorlevel 1 goto use_py

echo Python을 찾을 수 없습니다. Python 3을 설치한 뒤 다시 실행해 주세요.
pause
exit /b 1

:use_python
set "PYTHON_CMD=python"
goto start_server

:use_py
set "PYTHON_CMD=py -3"

:start_server
echo 오늘의 하늘 사이트를 시작합니다.
echo 브라우저에서 http://localhost:8000 에 접속하세요.
echo 서버를 종료하려면 이 창에서 Ctrl+C를 누르세요.
start "" "http://localhost:8000"
%PYTHON_CMD% -m http.server 8000

if errorlevel 1 (
  echo.
  echo 서버를 시작하지 못했습니다. Python 설치와 8000 포트 사용 여부를 확인해 주세요.
  pause
)
