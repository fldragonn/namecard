# 오늘의 하늘

날씨와 오늘의 명언을 확인하는 작은 웹사이트입니다. 날씨는 Open-Meteo, 한국어 명언은 [Korean Advice Open API](https://korean-advice-open-api.vercel.app/api/advice)에서 가져옵니다.

## 로컬에서 실행하기

프로젝트 폴더에서 `start.bat`을 더블클릭하면 로컬 서버가 시작되고 브라우저가 열립니다. 서버를 종료하려면 열린 명령 프롬프트에서 `Ctrl+C`를 누르세요.

직접 실행하려면 프로젝트 폴더에서 아래 명령을 실행한 뒤 브라우저로 `http://localhost:8000`에 접속하세요.

```powershell
python -m http.server 8000
```

Python이 설치되어 있지 않다면 VS Code의 Live Server 확장으로 `index.html`을 열어도 됩니다. 브라우저 위치 정보를 사용하려면 `localhost` 또는 HTTPS에서 접속해야 합니다.

처음에는 서울 날씨를 표시합니다. 도시 검색으로 위치를 바꾸거나 **내 위치**를 눌러 현재 위치의 날씨를 확인할 수 있습니다. 명언은 해당 날짜에 처음 불러온 결과를 브라우저에 저장해 하루 동안 같은 문장을 보여줍니다.

## GitHub Pages 배포

사이트: <https://fldragonn.github.io/namecard/>

소스 코드는 [GitHub 저장소](https://github.com/fldragonn/namecard)에 있습니다. GitHub Actions가 `main` 브랜치에 푸시된 변경 사항을 자동으로 게시합니다. 배포 상태는 저장소의 **Actions** 탭에서 `Deploy static site to GitHub Pages` 워크플로로 확인할 수 있습니다.
