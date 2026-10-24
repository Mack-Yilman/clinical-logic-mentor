# Instalador de la skill clinical-logic-mentor (https://github.com/Mack-Yilman/clinical-logic-mentor).
# Instala solo la skill (SKILL.md y LICENSE.txt), nunca el resto del repositorio.
#
#   Con menu:  irm https://raw.githubusercontent.com/Mack-Yilman/clinical-logic-mentor/main/install.ps1 | iex
#   Sin menu:  & ([scriptblock]::Create((irm https://raw.githubusercontent.com/Mack-Yilman/clinical-logic-mentor/main/install.ps1))) -Destino claude-code
#
# Destinos: claude-code, antigravity, gemini-app, claude-ai, todos.
# El archivo es solo ASCII a proposito: los textos con tilde usan \uXXXX (funcion T), asi funciona
# igual en Windows PowerShell 5.1 y PowerShell 7 sin depender de la codificacion. Nunca pases una
# ruta por T: Regex.Unescape fallaria con "\U" de C:\Users.
# Sin [ValidateSet]: con "irm | iex" el param se evalua como variable vacia y la validacion rompe el script.
param([string]$Destino)

# Todo corre en un ambito hijo para no dejar variables ni preferencias en la sesion de quien usa "irm | iex".
& {
    $ErrorActionPreference = 'Stop'
    $ProgressPreference = 'SilentlyContinue'
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

    $nombre = 'clinical-logic-mentor'
    $repo = 'Mack-Yilman/clinical-logic-mentor'
    $zipUrl = "https://github.com/$repo/releases/latest/download/$nombre.zip"
    $rawUrl = "https://raw.githubusercontent.com/$repo/main/skills/$nombre"

    function T([string]$texto) { [regex]::Unescape($texto) }

    function Ruta([string[]]$partes) {
        $ruta = $HOME
        foreach ($parte in $partes) { $ruta = Join-Path $ruta $parte }
        $ruta
    }

    function Get-Descargas {
        if ($env:OS -eq 'Windows_NT') {
            try {
                $ruta = (New-Object -ComObject Shell.Application).NameSpace('shell:Downloads').Self.Path
                if ($ruta) { return $ruta }
            } catch { }
        }
        Ruta 'Downloads'
    }

    # Descarga la skill en una carpeta temporal: primero la ultima Release; si no la hay, la rama main.
    function Get-Skill {
        $tmp = Join-Path ([IO.Path]::GetTempPath()) ("$nombre-" + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tmp | Out-Null
        $zip = Join-Path $tmp "$nombre.zip"
        try {
            Invoke-WebRequest -Uri $zipUrl -OutFile $zip -UseBasicParsing
            Expand-Archive -Path $zip -DestinationPath $tmp -Force
        } catch {
            $carpeta = Join-Path $tmp $nombre
            New-Item -ItemType Directory -Path $carpeta -Force | Out-Null
            foreach ($archivo in 'SKILL.md', 'LICENSE.txt') {
                Invoke-WebRequest -Uri "$rawUrl/$archivo" -OutFile (Join-Path $carpeta $archivo) -UseBasicParsing
            }
            Compress-Archive -Path $carpeta -DestinationPath $zip -Force
        }
        $carpeta = Join-Path $tmp $nombre
        if (-not (Test-Path (Join-Path $carpeta 'SKILL.md'))) { throw (T 'No se encontr\u00f3 SKILL.md en la descarga.') }
        [pscustomobject]@{ Temporal = $tmp; Carpeta = $carpeta; Zip = $zip }
    }

    function Write-Hecho([string]$plataforma, [string]$ruta) {
        Write-Host ('  [OK] ' + $plataforma + ' -> ' + $ruta) -ForegroundColor Green
    }

    # Copia la skill en una carpeta de skills. Reemplaza una instalacion anterior, salvo que sea un clon de git.
    function Copy-Skill($skill, [string]$base, [string]$plataforma) {
        $destino = Join-Path $base $nombre
        if (Test-Path (Join-Path $destino '.git')) {
            Write-Warning ((T 'Omitido ') + $plataforma + ': ' + $destino + (T ' es un clon de git; actual\u00edzalo con git pull.'))
            return
        }
        if (Test-Path $destino) { Remove-Item -Path $destino -Recurse -Force }
        New-Item -ItemType Directory -Path $base -Force | Out-Null
        Copy-Item -Path $skill.Carpeta -Destination $destino -Recurse
        Write-Hecho $plataforma $destino
    }

    function Install-Destino($skill, [string]$opcion) {
        switch ($opcion) {
            'claude-code' {
                Copy-Skill $skill (Ruta '.claude', 'skills') 'Claude Code'
                Write-Host (T '       Abre una sesi\u00f3n nueva y pega una pregunta de tu banco, o escribe /clinical-logic-mentor.')
            }
            'antigravity' {
                Copy-Skill $skill (Ruta '.gemini', 'config', 'skills') 'Antigravity'
                if (Test-Path (Ruta '.gemini', 'antigravity-cli')) {
                    Copy-Skill $skill (Ruta '.gemini', 'antigravity-cli', 'skills') 'Antigravity CLI'
                }
            }
            'gemini-app' {
                # Carpeta propia en Descargas: solo se sobrescriben estos dos archivos, nunca se borra nada.
                $carpeta = Join-Path (Get-Descargas) "$nombre-gemini"
                New-Item -ItemType Directory -Path $carpeta -Force | Out-Null
                Copy-Item -Path (Join-Path $skill.Carpeta '*') -Destination $carpeta -Force
                Write-Hecho 'App de Gemini y Gemini Spark' (Join-Path $carpeta 'SKILL.md')
                Write-Host (T '       S\u00fabelo en Gemini: Configuraci\u00f3n > Skills > Subir.')
                if ($env:OS -eq 'Windows_NT') { Invoke-Item $carpeta }
            }
            'claude-ai' {
                # La carpeta de Descargas puede no existir (perfil nuevo).
                $descargas = Get-Descargas
                New-Item -ItemType Directory -Path $descargas -Force | Out-Null
                $zip = Join-Path $descargas "$nombre.zip"
                Copy-Item -Path $skill.Zip -Destination $zip -Force
                Write-Hecho 'Claude.ai, Desktop y Cowork' $zip
                Write-Host (T '       S\u00fabelo en Claude: Configuraci\u00f3n > Capacidades > Skills > Subir.')
            }
        }
    }

    $opciones = [ordered]@{
        '1' = 'claude-code'
        '2' = 'antigravity'
        '3' = 'gemini-app'
        '4' = 'claude-ai'
        '5' = 'todos'
    }

    Write-Host ''
    Write-Host 'Clinical Logic Mentor: instalador' -ForegroundColor Cyan
    Write-Host ''

    if ($Destino -and -not ($opciones.Values -contains $Destino)) {
        throw ((T 'Destino no v\u00e1lido: ') + $Destino + '. Usa: ' + ($opciones.Values -join ', '))
    }
    if (-not $Destino) {
        Write-Host (T '\u00bfD\u00f3nde quieres instalar la skill?')
        Write-Host '  1) Claude Code'
        Write-Host '  2) Antigravity'
        Write-Host (T '  3) App de Gemini o Gemini Spark (deja SKILL.md en Descargas para subirlo)')
        Write-Host (T '  4) Claude.ai, Claude Desktop o Cowork (deja el .zip en Descargas para subirlo)')
        Write-Host '  5) Todos'
        $eleccion = "$(Read-Host (T 'Escribe un n\u00famero'))".Trim()
        if (-not $opciones.Contains($eleccion)) { throw ((T 'Opci\u00f3n no v\u00e1lida: ') + $eleccion) }
        $Destino = $opciones[$eleccion]
    }

    $skill = Get-Skill
    try {
        if ($Destino -eq 'todos') {
            foreach ($opcion in 'claude-code', 'antigravity', 'gemini-app', 'claude-ai') { Install-Destino $skill $opcion }
        } else {
            Install-Destino $skill $Destino
        }
        Write-Host ''
        Write-Host (T 'Listo. Licencia CC BY-NC-ND 4.0 \u00a9 2026 Mack Chirinos: uso libre, sin fines comerciales ni versiones modificadas.')
    } finally {
        Remove-Item -Path $skill.Temporal -Recurse -Force -ErrorAction SilentlyContinue
    }
}
