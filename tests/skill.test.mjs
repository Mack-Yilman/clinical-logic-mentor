// Verificaciones estáticas de SKILL.md. No prueban el comportamiento del modelo
// (eso se hace con ejemplos/ y ejemplos/checklist.md), solo que el prompt sea coherente consigo mismo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (...ruta) => readFileSync(join(repo, ...ruta), 'utf8').replace(/\r\n/g, '\n');
// La skill instalable vive en skills/<nombre>/; el resto del repo es del proyecto.
const [carpetaSkill] = readdirSync(join(repo, 'skills'));
const raiz = join(repo, 'skills', carpetaSkill);
const texto = leer('skills', carpetaSkill, 'SKILL.md');

const [, frontmatter, cuerpo] = texto.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];

// Taxonomía de la v1 (Error-log.md del Gem). La estrategia se copia palabra por palabra en la salida,
// así que cualquier cambio aquí debe ser intencional. Único cambio respecto de la v1: C-CON-03 nombraba
// solo Anki, y la skill genera tarjetas de RemNote.
const TAXONOMIA = {
  'C-CON-01': ['Vacío Epistémico Total', 'Lectura de manuales base actualizados + Videoclases introductorias (ej. Osmosis, Ninja Nerd).'],
  'C-CON-02': ['Obsolescencia de la Evidencia', 'Revisión directa de Guías Clínicas Actualizadas (AHA, ADA, KDIGO) o plataformas como UpToDate.'],
  'C-CON-03': ['Falla de Retención Declarativa', 'Creación de tarjetas de repetición espaciada (RemNote o Anki) y uso estricto de Repetición Espaciada (Spaced Repetition).'],
  'C-CON-04': ['Confusión Conceptual (Interferencia)', 'Creación de tablas de diagnóstico diferencial y cuadros comparativos destacando hallazgos patognomónicos.'],
  'C-CON-05': ['Jerarquización Deficiente (Semaforización)', 'Estudio activo de flujogramas y algoritmos de decisión clínica (Paso 1, Paso 2, Gold Standard).'],
  'C-INT-01': ['Falla en Reconocimiento de Patrones', 'Resolución masiva e intensiva de Qbanks (Bancos de Preguntas) priorizando viñetas clínicas complejas.'],
  'C-INT-02': ['Anclaje Prematuro (Cierre Cognitivo)', 'Entrenamiento de lectura completa del caso clínico antes de ver las opciones ("Hide options strategy").'],
  'C-INT-03': ['Disociación Fisiopatológica', 'Aprendizaje Basado en Problemas (ABP) o autoexplicación mediante mapas fisiopatológicos (Técnica Feynman).'],
  'C-INT-04': ['Ceguera al Contexto Epidemiológico', 'Técnica de subrayado o resaltado sistemático del perfil del paciente (edad, sexo, ocupación, procedencia) antes del síntoma.'],
  'C-INT-05': ['Error de Interpretación Auxiliar', 'Repaso activo con atlas de imágenes (ej. Radiopaedia, tiras de EKG) y uso de métodos sistemáticos de lectura (ej. ABCDE).'],
  'C-TEC-01': ['Negligencia de Lectura (Keyword Blindness)', 'Lectura guiada (con puntero o lápiz) e identificación consciente de palabras clave (EXCEPTO, MÁS PROBABLE).'],
  'C-TEC-02': ['Fatiga Decisional (Agotamiento)', 'Entrenamiento de resistencia cognitiva mediante bloques completos sin pausa (ej. 50 preguntas seguidas) y optimización del descanso.'],
  'C-TEC-03': ['Duda Obsesiva (Cambio de Respuesta)', 'Aplicación de la regla de oro: "Nunca cambiar la primera respuesta instintiva salvo que se detecte un dato objetivo nuevo".'],
  'C-TEC-04': ['Mala Gestión del Tiempo', 'Uso estricto de cronómetro (1 minuto por pregunta) y sistema de "Triaje": responder fáciles, marcar las difíciles y avanzar.'],
};

// Líneas del cuerpo que quedan fuera de bloques de código.
function lineasFueraDeCodigo() {
  let dentro = false;
  return cuerpo.split('\n').filter((linea) => {
    if (linea.startsWith('```')) {
      dentro = !dentro;
      return false;
    }
    return !dentro;
  });
}

function seccion(inicio, fin) {
  const desde = cuerpo.indexOf(inicio);
  assert.notEqual(desde, -1, `falta la sección «${inicio}»`);
  const hasta = fin ? cuerpo.indexOf(fin, desde) : cuerpo.length;
  assert.notEqual(hasta, -1, `falta la sección «${fin}»`);
  return cuerpo.slice(desde, hasta);
}

const literales = (bloque) =>
  new Set(bloque.split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2)));

const bloquesDeCodigo = () => [...cuerpo.matchAll(/^```markdown\n([\s\S]*?)^```$/gm)].map((m) => m[1]);

test('el frontmatter cumple el estándar Agent Skills', () => {
  assert.ok(frontmatter, 'SKILL.md debe empezar con frontmatter entre ---');
  const nombre = frontmatter.match(/^name:\s*(.+)$/m)?.[1].trim();
  const descripcion = frontmatter.match(/^description:\s*"(.+)"$/m)?.[1];
  assert.match(nombre ?? '', /^[a-z0-9]+(-[a-z0-9]+)*$/, 'name en minúsculas con guiones');
  assert.ok(nombre.length <= 64, 'name de 64 caracteres como máximo');
  assert.equal(nombre, basename(raiz), 'name debe coincidir con el nombre de la carpeta');
  assert.ok(descripcion, 'description entre comillas dobles y en una sola línea');
  assert.ok(descripcion.length <= 1024, `description de 1024 caracteres como máximo (tiene ${descripcion.length})`);
  assert.doesNotMatch(descripcion, /"/, 'description sin comillas dobles internas');
  assert.doesNotMatch(frontmatter, /[<>]/, 'el frontmatter no admite < ni >');
});

test('el cuerpo no usa título de nivel 1, nivel 4 ni divisores', () => {
  for (const linea of lineasFueraDeCodigo()) {
    assert.doesNotMatch(linea, /^#\s/, `título de nivel 1: ${linea}`);
    assert.doesNotMatch(linea, /^####/, `título de nivel 4: ${linea}`);
    assert.doesNotMatch(linea, /^\s*([-*_])(\s*\1){2,}\s*$/, `divisor horizontal: ${linea}`);
  }
});

test('la taxonomía tiene los 14 IDs con su nombre oficial y la estrategia literal de la v1', () => {
  const tabla = seccion('## 🗂️ Taxonomía del error', '## 🧭');
  for (const [id, [nombre, estrategia]] of Object.entries(TAXONOMIA)) {
    const fila = tabla.split('\n').find((l) => l.startsWith(`| ${id} |`));
    assert.ok(fila, `falta la fila de ${id}`);
    const celdas = fila.split(' | ');
    assert.equal(celdas[1], nombre, `nombre oficial de ${id}`);
    assert.equal(celdas[3].replace(/ \|$/, ''), estrategia, `estrategia de ${id}`);
  }
  const ids = [...tabla.matchAll(/^\| (C-[A-Z]{3}-\d{2}) \|/gm)].map((m) => m[1]);
  assert.deepEqual(ids.sort(), Object.keys(TAXONOMIA).sort(), 'ni IDs de más ni repetidos');
});

test('el Modo B excluye los IDs de técnica de examen', () => {
  assert.match(seccion('### 🎯 Refuerzo pedagógico', '### 🧠 Flashcard'), /Solo IDs C-CON o C-INT/);
});

test('la imagen se lee después de 📝 en ambos modos', () => {
  const modos = seccion('## 🧭', '## 🛠️');
  assert.match(modos, /Modo A\*\* \(error\): 📝 → 🖼️ si hay imagen → 🔍 → ⚔️ → 🧠/);
  assert.match(modos, /Modo B\*\* \(duda\): 📝 → 🖼️ si hay imagen → ⚔️ → 🎯 → 🧠/);
});

test('los ejemplos de flashcard respetan su propio formato de importación', () => {
  const bloques = bloquesDeCodigo();
  assert.equal(bloques.length, 2, 'un ejemplo cloze y uno básico');
  const tipos = [];
  for (const bloque of bloques) {
    const lineas = bloque.trimEnd().split('\n');
    assert.doesNotMatch(bloque, /\t/, 'la sangría es solo con espacios');
    assert.doesNotMatch(bloque, /\n\s*\n/, 'sin líneas en blanco dentro del bloque');
    // RemNote no interpreta los # al pegar: un título «### …» queda como texto literal.
    assert.match(lineas[0], /^[^\s#-]/, 'el título va sin sangría, sin # y sin guion');
    const tarjetas = lineas.filter((l) => /^ {4}- /.test(l));
    assert.equal(tarjetas.length, 1, 'una sola tarjeta, con 4 espacios');
    const [tarjeta] = tarjetas;
    const cloze = (tarjeta.match(/\{\{/g) ?? []).length;
    const basica = tarjeta.includes(' >> ');
    assert.ok((cloze === 1) !== basica, 'un solo tipo: un hueco cloze o una básica');
    tipos.push(basica ? 'básica' : 'cloze');
    const extras = lineas.slice(2);
    assert.ok(extras.length >= 1 && extras.length <= 4, 'de 1 a 4 extras');
    assert.match(extras[0], /^ {8}- Fundamento (Biomédico|Epidemiológico|Normativo): /, 'el primer extra es el Fundamento');
    for (const extra of extras) {
      assert.match(extra, /^ {8}- .+ #\[\[Extra Card Detail\]\]$/, `extra con 8 espacios y la etiqueta: ${extra}`);
    }
    assert.ok(extras.filter((l) => l.includes('⚠️ Perla: ')).length <= 2, 'como máximo 2 perlas');
    const enunciado = tarjeta.replace(/^ {4}- /, '').split(/ >> |\{\{/)[0];
    assert.ok(enunciado.split(/\s+/).length <= 35, 'enunciado de 35 palabras como máximo');
  }
  assert.deepEqual(tipos.sort(), ['básica', 'cloze']);
});

test('cada línea fija aparece idéntica en el recordatorio final', () => {
  const flujo = literales(
    seccion('## 🔒 Límite entre dato y orden', '## 📚') +
      seccion('## 🗂️ Taxonomía del error', '## 🧭') +
      seccion('## 🧭', '## 🛠️'),
  );
  const recordatorio = literales(seccion('## 🔚 Recordatorio final'));
  assert.equal(flujo.size, 7, `se esperaban 7 líneas fijas, hay ${flujo.size}`);
  assert.deepEqual([...flujo].sort(), [...recordatorio].sort());
});

test('ninguna regla cita una línea fija recortada', () => {
  // Una copia parcial es una segunda versión del literal, y el modelo mezcla ambas.
  const reglas = cuerpo.split('\n').filter((l) => !l.startsWith('> '));
  for (const literal of literales(seccion('## 🔚 Recordatorio final'))) {
    const inicio = literal.replace(/^⚠️\s/, '').slice(0, 25);
    const cita = reglas.find((l) => l.includes(inicio));
    assert.equal(cita, undefined, `la línea fija «${inicio}…» aparece fuera de su lugar: ${cita}`);
  }
});

test('sin restos de la v1: archivo externo, «oclusión» ni umbrales numéricos de ajuste', () => {
  assert.doesNotMatch(cuerpo, /error_log\.md|Error-log/i, 'la taxonomía está embebida');
  assert.doesNotMatch(cuerpo, /oclusi[oó]n/i, 'en RemNote, {{…}} es cloze; la oclusión es de imágenes');
  assert.doesNotMatch(cuerpo, /\d+\s?% de ajuste/, 'un LLM no mide porcentajes de ajuste');
});

test('es portable: no nombra plataformas de IA ni herramientas propias de una', () => {
  assert.doesNotMatch(cuerpo, /\b(Gemini|Claude|ChatGPT|OpenAI|Anthropic|Google|Copilot|Canvas|Artifacts?|Gems?)\b/i);
});

test('cabe en el límite recomendado de 500 líneas', () => {
  assert.ok(texto.split('\n').length <= 500);
});

test('la carpeta instalable solo contiene la skill y su licencia', () => {
  assert.deepEqual(readdirSync(join(repo, 'skills')), [carpetaSkill], 'una sola skill en skills/');
  assert.deepEqual(readdirSync(raiz).sort(), ['LICENSE.txt', 'SKILL.md']);
});

test('la licencia es CC BY-NC-ND 4.0 a nombre de Mack Chirinos en todas partes', () => {
  assert.match(frontmatter, /^license: CC BY-NC-ND 4\.0/m);
  for (const archivo of [leer('LICENSE'), leer('skills', carpetaSkill, 'LICENSE.txt')]) {
    assert.match(archivo, /Copyright \(c\) \d{4} Mack Chirinos/);
    assert.match(archivo, /by-nc-nd\/4\.0/);
  }
  assert.match(leer('LICENSE'), /Attribution-NonCommercial-NoDerivatives 4\.0\s+International Public\s+License/);
  assert.equal(JSON.parse(leer('package.json')).license, 'CC-BY-NC-ND-4.0');
});

test('la versión de package.json es la primera del CHANGELOG', () => {
  const { version } = JSON.parse(leer('package.json'));
  assert.equal(leer('CHANGELOG.md').match(/^## (\d+\.\d+\.\d+)/m)?.[1], version);
});

test('el instalador de PowerShell apunta a la skill y no lleva BOM', () => {
  const bytes = readFileSync(join(repo, 'install.ps1'));
  assert.notDeepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf], 'un BOM rompe «irm | iex» en PowerShell 7');
  const ps = bytes.toString('utf8');
  assert.ok(ps.includes(`$nombre = '${carpetaSkill}'`), '$nombre debe ser el nombre de la skill');
  assert.ok(ps.includes('/main/skills/$nombre'), 'debe descargar desde skills/<nombre>');
  assert.ok(ps.includes('/releases/latest/download/$nombre.zip'), 'debe usar el .zip de la Release');
  assert.ok(![...bytes].some((b) => b > 127), 'solo ASCII: las tildes van como \\uXXXX');
  assert.doesNotMatch(ps, /transcriptor|transcripci/i, 'sin restos del instalador copiado');
});
