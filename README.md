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

## GitHub Pages에 게시하기

저장소는 GitHub Free에서 Pages를 사용할 수 있도록 **Public**으로 만드세요. 기존 파일을 올리면 `main` 브랜치의 변경 사항을 GitHub Actions가 자동으로 배포합니다.

1. GitHub에서 빈 Public 저장소를 만듭니다. README, `.gitignore`, 라이선스 파일은 새 저장소에 추가하지 마세요.
2. 이 프로젝트 폴더에서 `<사용자명>`과 `<저장소명>`을 본인 값으로 바꿔 아래 명령을 실행합니다.

   ```powershell
   git init
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/<사용자명>/<저장소명>.git
   git push -u origin main
   ```

3. GitHub 저장소에서 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
4. **Actions** 탭에서 `Deploy static site to GitHub Pages` 작업이 완료될 때까지 기다립니다. 게시 주소는 `https://<사용자명>.github.io/<저장소명>/` 형식입니다.

이후 `main` 브랜치에 변경 사항을 푸시할 때마다 자동으로 다시 배포됩니다. 현재 폴더는 아직 Git 저장소와 GitHub 원격 저장소에 연결되어 있지 않으므로, 위 단계의 저장소 생성 및 첫 푸시가 필요합니다.
