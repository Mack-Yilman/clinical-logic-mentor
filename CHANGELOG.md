# Historial de versiones

## 2.0.0 — 2026-10-24

Primera versión como skill. La 1.0 era un Gem: un prompt y un archivo de conocimiento con la taxonomía de errores.

### Portabilidad

- La taxonomía de 14 tipos de error va dentro de `SKILL.md`, porque muchos asistentes cargan un solo archivo. Los IDs, los nombres y las estrategias son los mismos de la 1.0.
- Sin nombres de plataformas en el prompt; funciona pegado como instrucciones en cualquier asistente.

### Alcance

- Cubre ENCIB, ENAM, ENCAPS y ENARM de residentado, en el contexto peruano, incluidas las preguntas de ciencias básicas y de salud pública.
- Las repreguntas sobre el mismo caso se responden sin repetir el análisis; cada pregunta nueva empieza de cero.
- Casos nuevos: falta la clave o la alternativa marcada, banco sin clave, clave que contradice la evidencia, varias preguntas a la vez e imagen ilegible.

### Evidencia

- Prohibido inventar el número o el año de una norma o guía.
- La descripción de la imagen va siempre justo después de la pregunta, en ambos modos.

### Flashcard

- Reglas de SuperMemo: información mínima, sin listas ni preguntas negativas, enunciado legible en voz alta de 35 palabras como máximo, sin spoiler en el título ni en el enunciado.
- Sangría solo con espacios (4 y 8). Los ejemplos de la 1.0 usaban tabulaciones y contradecían la regla.
- El título de la tarjeta va sin `###`: al pegar, RemNote no interpreta los títulos de markdown y los dejaba como texto.
- Cada extra lleva `#[[Extra Card Detail]]`, para que RemNote lo muestre al responder.
- Extras más cortos: Fundamento siempre, Contraste solo si una variable del caso cambia la respuesta y de 0 a 2 perlas.
- «Oclusión» pasa a llamarse «cloze», como en RemNote. Se agregan las pistas de cloze.
- La tarjeta de lectura (C-TEC-01) se formula en positivo, con una sola respuesta.
