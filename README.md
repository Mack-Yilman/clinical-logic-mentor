# 🩺 Clinical Logic Mentor

Una *skill* para asistentes de IA que convierte cada pregunta que fallaste (o acertaste con dudas) en el banco de preguntas en **aprendizaje accionable**: diagnostica por qué fallaste, te muestra cómo pensó el autor de la pregunta y te entrega **una flashcard lista para RemNote**.

Está pensada para los exámenes médicos del Perú: **ENCIB, ENAM, ENCAPS y ENARM (residentado)**. Prioriza las Normas Técnicas de Salud del MINSA y cubre preguntas clínicas, de ciencias básicas y de salud pública.

Funciona con **Gemini** (app, Spark y Antigravity), **Claude** (chat, Cowork y Claude Code) y cualquier otro asistente que acepte instrucciones personalizadas.

## 📦 Instalación

La skill es una carpeta con dos archivos: [`SKILL.md`](skills/clinical-logic-mentor/SKILL.md) y su licencia. Todas estas formas de instalar copian **solo esa carpeta**, no el resto del repositorio.

### Opción 1: PowerShell (Windows), en una línea

Abre PowerShell, pega esto y elige en el menú dónde instalarla:

```powershell
irm https://raw.githubusercontent.com/Mack-Yilman/clinical-logic-mentor/main/install.ps1 | iex
```

| Opción del menú | Qué hace |
|---|---|
| Claude Code | La instala en `~/.claude/skills/` |
| Antigravity | La instala en `~/.gemini/config/skills/` y, si tienes el CLI de Antigravity, también en el suyo |
| App de Gemini o Gemini Spark | Deja `SKILL.md` en *Descargas › clinical-logic-mentor-gemini*, listo para subir |
| Claude.ai, Desktop o Cowork | Deja `clinical-logic-mentor.zip` en *Descargas*, listo para subir |
| Todos | Todo lo anterior |

Para elegir el destino sin menú, por ejemplo Claude Code:

```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/Mack-Yilman/clinical-logic-mentor/main/install.ps1))) -Destino claude-code
```

Los destinos son `claude-code`, `antigravity`, `gemini-app`, `claude-ai` y `todos`. Volver a ejecutar el comando actualiza la skill a la última versión. Puedes [leer el instalador](install.ps1) antes de ejecutarlo.

### Opción 2: un comando para agentes de código

| Herramienta | Comando |
|---|---|
| Cualquier agente (Claude Code, Antigravity, Cursor, Codex, Copilot…) con el [CLI de skills](https://github.com/vercel-labs/skills) | `npx skills add Mack-Yilman/clinical-logic-mentor` |

### Opción 3: pedírselo a tu agente con el enlace

En Antigravity, Claude Code u otro agente con acceso a archivos, pega este mensaje:

> Instala la skill de https://github.com/Mack-Yilman/clinical-logic-mentor. Copia solo la carpeta `skills/clinical-logic-mentor` (contiene `SKILL.md` y `LICENSE.txt`) dentro de tu carpeta de skills globales. No copies el resto del repositorio.

### Opción 4: descarga directa para la app de Gemini y Claude.ai

| Plataforma | Descarga | Dónde subirla |
|---|---|---|
| App de Gemini y Gemini Spark | [`SKILL.md`](https://github.com/Mack-Yilman/clinical-logic-mentor/releases/latest/download/SKILL.md) | Configuración › Skills › Subir |
| Claude.ai, Claude Desktop y Cowork | [`clinical-logic-mentor.zip`](https://github.com/Mack-Yilman/clinical-logic-mentor/releases/latest/download/clinical-logic-mentor.zip) | Configuración › Capacidades › Skills › Subir |

Los enlaces siempre descargan la última versión. Sube el `.zip` tal cual, sin descomprimirlo.

### Opción 5: un Gem, un GPT u otro asistente

Pega el contenido de `SKILL.md` como instrucciones del Gem, del GPT o del proyecto. Ya no hace falta subir un archivo de conocimiento aparte: la taxonomía de errores está dentro de `SKILL.md`.

### En macOS o Linux

Con PowerShell 7 (`pwsh`) funciona el mismo instalador. Sin PowerShell, para Claude Code:

```bash
mkdir -p ~/.claude/skills && curl -fsSL https://github.com/Mack-Yilman/clinical-logic-mentor/releases/latest/download/clinical-logic-mentor.zip -o /tmp/clm.zip && unzip -o /tmp/clm.zip -d ~/.claude/skills
```

Cambia `~/.claude/skills` por `~/.gemini/config/skills` (Antigravity).

## ✨ Cómo se usa

Pega (o fotografía) la pregunta con sus alternativas y di qué marcaste:

| Si escribes… | El tutor usa… |
|---|---|
| «Marqué la B, la correcta es la C» | **Modo A (error):** 📝 pregunta → 🔍 diagnóstico del error → ⚔️ análisis de contraste → 🧠 flashcard |
| «Marqué la C y era la correcta, pero no sé por qué» | **Modo B (duda):** 📝 pregunta → ⚔️ análisis de contraste → 🎯 refuerzo → 🧠 flashcard |
| Solo la pregunta, o lo que marcaste sin la clave | Te pide lo que falta |
| «Mi banco no trae la clave» | Propone la clave y te pide verificarla |

- **Imágenes:** si la pregunta trae una radiografía, un EKG o una lámina, primero hace una lectura sistemática de la imagen (🖼️).
- **Clave dudosa:** si la clave del banco contradice la evidencia, te avisa y explica cuál respalda la norma o la guía.
- **Varias preguntas a la vez:** analiza la primera; escribe «siguiente» para pasar a la próxima.
- **Repreguntas:** puedes preguntar sobre el mismo caso («¿y si fuera un niño?»); responde breve, sin repetir todo el análisis.

### Qué contiene el análisis

- **🔍 Diagnóstico del error:** uno de 14 tipos de error en 3 dimensiones (conocimiento, razonamiento clínico y técnica de examen), con la justificación, el algoritmo mental que debiste seguir y una estrategia de estudio concreta.
- **⚔️ Análisis de contraste:** el dato pivote del enunciado, la evidencia que respalda la clave y **por qué el distractor te engañó**, desde el diseño de la pregunta.
- **🧠 Flashcard:** una sola tarjeta, sobre el punto exacto donde fallaste, no sobre el tema general.

### La flashcard

Sigue las reglas de formulación del conocimiento de SuperMemo: una pregunta, una respuesta atómica, sin listas ni preguntas negativas, legible en voz alta y sin que el título delate la respuesta. Se entrega en un bloque de código listo para pegar en RemNote:

```markdown
🦠 Sífilis temprana en gestante con alergia a penicilina
    - En una gestante con sífilis temprana y antecedente de anafilaxia a la penicilina, el manejo de elección antes de tratarla es la {{desensibilización}}
        - Fundamento Biomédico: solo la penicilina trata de forma fiable la infección fetal; la doxiciclina está contraindicada en la gestación y los macrólidos no protegen al feto. #[[Extra Card Detail]]
        - Si la paciente no tuviera alergia a la penicilina ➞ penicilina benzatínica 2,4 millones UI IM, sin desensibilización. #[[Extra Card Detail]]
        - ⚠️ Perla: tratamiento materno adecuado ➞ penicilina benzatínica iniciada al menos 4 semanas antes del parto. #[[Extra Card Detail]]
```

- **Cloze** (`{{…}}`) para conductas y diagnósticos; **básica** (`>>`) para valores literales como dosis o cifras.
- **Extras** que RemNote muestra al responder, gracias a la etiqueta `#[[Extra Card Detail]]`: el fundamento (siempre), un escenario de contraste (solo si una variable del caso cambia la respuesta) y hasta 2 perlas de examen.
- **Para importar:** copia el contenido del bloque (con el botón de copiar del bloque, si tu asistente lo tiene) y pégalo en un documento de RemNote con **Ctrl+Shift+V** (en Mac, **Cmd+Shift+V**), que pega sin formato. Así RemNote lee la sangría (4 y 8 espacios) y arma la jerarquía título → tarjeta → extras. Con Ctrl+V normal, el texto puede llegar con formato del chat y quedar todo al mismo nivel, con los guiones visibles.

### ¿Qué modelo usar?

La versión 2.0 se probó con 11 preguntas inventadas (clínicas, de ciencias básicas, de salud pública, con clave errónea, con órdenes inyectadas y con varias preguntas a la vez), en 3 rondas de mejora:

| Modelo | Resultado |
|---|---|
| Claude Sonnet | El más preciso: tarjetas sobre el punto exacto del error y contrastes correctos |
| Gemini 4 Argon, razonamiento medio | Estructura impecable; tarjetas algo más cargadas (suele usar los 3 o 4 extras) |
| Gemini 3.8 Flash, razonamiento medio | Estructura impecable; a veces propone un escenario de contraste con una alternativa que no es la de primera elección |

Los tres modelos asignaron el mismo tipo de error en casi todos los casos, siguieron las líneas fijas y rechazaron las órdenes inyectadas. Con cualquier modelo, **verifica las dosis y las conductas** antes de estudiarlas. Además se probó en la app de Gemini (Flash, razonamiento medio) con la foto de una pregunta, y la flashcard se importó en RemNote con la jerarquía, el cloze y los extras correctos. La lectura de imágenes clínicas (radiografías, EKG, láminas) aún no se ha probado.

## 🗂️ Contenido del repositorio

| Ruta | Contenido | ¿Se instala? |
|---|---|---|
| `skills/clinical-logic-mentor/` | La skill: `SKILL.md` y `LICENSE.txt` | ✅ Sí, es lo único |
| `install.ps1` | Instalador de PowerShell | No |
| `README.md`, `CHANGELOG.md`, `LICENSE` | Documentación, historial de versiones y licencia completa | No |
| `tests/`, `ejemplos/`, `.github/`, `package.json` | Pruebas automáticas, casos de prueba y publicación de versiones | No |

## 🧪 Pruebas

Las pruebas automáticas revisan que `SKILL.md` sea coherente: la taxonomía completa y literal, los ejemplos de flashcard con su propio formato de importación, las líneas fijas idénticas y la carpeta instalable solo con la skill. Requieren Node.js 22 o superior y no tienen dependencias:

```bash
npm test
```

El comportamiento del tutor se prueba con los casos de [`ejemplos/`](ejemplos/), preguntas inventadas al estilo de los exámenes peruanos, contra la [checklist de calidad](ejemplos/checklist.md).

## 📄 Licencia

© 2026 Mack Chirinos. [Creative Commons Atribución-NoComercial-SinDerivadas 4.0 Internacional (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.es).

| Puedes | No puedes, sin autorización escrita del autor |
|---|---|
| ✅ Usar la skill gratis, para estudiar o enseñar | ❌ Venderla ni usarla con fines comerciales |
| ✅ Compartirla sin cambios, citando al autor y este repositorio | ❌ Distribuir versiones modificadas |

Los análisis y las flashcards que generes con la skill son tuyos. Para pedir una autorización, abre un *issue* en este repositorio.

> La skill es una herramienta de estudio. No reemplaza las normas oficiales ni el criterio clínico: verifica las dosis y las conductas en la fuente antes de aplicarlas.
