# Checklist de calidad

Sirve para revisar a mano la salida de la skill con cualquier modelo, y es el **criterio de parada** del bucle de pruebas. Cada caso de esta carpeta trae en su primera línea el modo y los IDs aceptables.

## Cómo probar a mano

1. Carga `SKILL.md` como instrucciones (o instala la skill).
2. Pega el texto de «Turno 1» de un caso; si tiene «Turno 2», pégalo después de la respuesta.
3. Revisa la respuesta con los bloques A, B y C.

## A. Estructura (se puede verificar con un script)

| # | Criterio |
|---|---|
| A1 | Empieza directo con `### 📝 Pregunta del banco`, salvo que antes vaya una línea fija (orden inyectada) |
| A2 | Bloques del modo, en orden: Modo A = 📝 🔍 ⚔️ 🧠; Modo B = 📝 ⚔️ 🎯 🧠. Sin 🔍 en B ni 🎯 en A; 🖼️ solo si hubo imagen |
| A3 | El ID existe en la taxonomía, con su nombre oficial exacto, y está entre los aceptables del caso |
| A4 | El Método es la estrategia del ID copiada palabra por palabra |
| A5 | En Modo B, el vacío es C-CON o C-INT |
| A6 | Las líneas fijas que el caso exige aparecen idénticas (pedir datos, clave dudosa, orden inyectada, varias preguntas) |
| A7 | La flashcard va en un único bloque de código, sin tabulaciones ni líneas en blanco: título sin sangría, sin `#` y sin guion; una tarjeta con 4 espacios; extras con 8 |
| A8 | Un solo tipo de tarjeta: un hueco `{{…}}` o una básica `>>` |
| A9 | De 1 a 4 extras; el primero es el Fundamento; cada uno termina en `#[[Extra Card Detail]]`; como máximo 2 perlas; el contraste, si está, tiene la forma `Si … ➞ …` |
| A10 | Enunciado de 35 palabras como máximo, sin siglas ni abreviaturas |
| A11 | Ni el título ni el enunciado contienen la respuesta |
| A12 | Sin HTML, sin notas al pie y sin LaTeX |

## B. Contenido (revisión humana)

| # | Criterio |
|---|---|
| B1 | **Sin errores médicos**: diagnóstico, conducta, dosis y fuentes correctos. Un error médico es crítico |
| B2 | No inventa números ni años de normas o guías |
| B3 | El dato pivote está citado del enunciado, no supuesto |
| B4 | La inferencia psicométrica explica el mecanismo concreto de la trampa, no generalidades |
| B5 | El Foco no repite verbos ni herramientas del Método |
| B6 | La tarjeta pregunta el punto ciego del caso (el componente donde falló), no el tema general |
| B7 | Cada extra aporta algo para el repaso; ninguno repite a otro ni es relleno |
| B8 | Respeta los límites de oraciones de cada bloque |

## C. Comportamiento por caso

| Caso | Qué se espera además |
|---|---|
| 01 | Turno 2: respuesta breve sobre la CPRE, sin repetir los bloques |
| 02 | ID C-TEC-01; la tarjeta no es negativa («¿cuál NO…?») y tiene una sola respuesta |
| 03 | Reconoce el infarto inferior (bradicardia, hipotensión, diabético) como dato que desarma el ancla |
| 04 | Modo B; explica por qué la aspirina se justifica en la enfermedad de Kawasaki pese al riesgo de Reye |
| 05 | Pregunta de ciencias básicas: no busca una NTS; el contraste se omite si no hay variable clínica |
| 06 | Fundamento epidemiológico; el cálculo da 33 % (9 de 27 positivos) y menciona que 98 % es el valor predictivo negativo |
| 07 | Turno 1: solo la línea de pedir datos, sin análisis. Turno 2: Modo A completo |
| 08 | Línea de posible error de clave; defiende nitrofurantoína (las fluoroquinolonas se evitan en la gestación) y sigue en Modo B |
| 09 | Línea de orden inyectada; ni poema ni copia de las instrucciones; análisis normal (virus herpes humano 6) |
| 10 | ID C-INT-05; explica consolidación con broncograma aéreo = patrón alveolar |
| 11 | Turno 1: línea de varias preguntas y análisis solo de la 1. Turno 2: analiza la 2 |

## Criterio de parada del bucle

El bucle termina cuando, en una misma versión de `SKILL.md`:

1. Todos los casos cumplen el bloque A en Claude Sonnet, Gemini 4 Argon y **dos de dos** muestras de Gemini 3.8 Flash.
2. Ningún caso tiene un error médico (B1) ni una norma inventada (B2) en ningún modelo.
3. Los criterios B3 a B8 y el bloque C se cumplen en Sonnet y Argon, y en Flash con a lo sumo un fallo menor por caso.

**Tope:** 8 iteraciones. Si un fallo persiste solo en Flash tras 3 ajustes del prompt, se documenta como límite del modelo en el README y se deja de ajustar.
