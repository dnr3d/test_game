@echo off
echo Building Web App...
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 exit /b %errorlevel%

echo Fixing OneDrive File Sync Attributes...
node -e "const fs=require('fs'); const path=require('path'); function walk(d) { if(!fs.existsSync(d)) return; fs.readdirSync(d).forEach(f => { const p = path.join(d, f); if(fs.statSync(p).isDirectory()) walk(p); else { const buf = fs.readFileSync(p); fs.writeFileSync(p, buf); } }); } walk('android/app/src/main/res');"

echo Building Android APK...
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
cd android
call gradlew assembleDebug
