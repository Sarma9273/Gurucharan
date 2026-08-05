$ErrorActionPreference = "Stop"

$repo = Get-Location
$loaderPath = Join-Path $repo "src\components\CinematicLoader.tsx"
$nodeConfigPath = Join-Path $repo "tsconfig.node.json"

if (-not (Test-Path $loaderPath)) {
  throw "Run this script from the repository root. Missing: $loaderPath"
}

if (-not (Test-Path $nodeConfigPath)) {
  throw "Run this script from the repository root. Missing: $nodeConfigPath"
}

$loader = Get-Content $loaderPath -Raw

$loader = $loader.Replace(
  "return () => tween.kill();",
  "return () => {`r`n      tween.kill();`r`n    };"
)

Set-Content -Path $loaderPath -Value $loader -Encoding utf8

@'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
'@ | Set-Content -Path $nodeConfigPath -Encoding utf8

Write-Host "Both build errors have been fixed." -ForegroundColor Green
Write-Host "Now run: npm run build" -ForegroundColor Cyan
