# Malla interactiva UAI

Adaptación del visualizador de mallas interactivo para la Universidad Adolfo Ibáñez. El proyecto original fue creado para la Universidad Técnica Federico Santa María.

# Índice
0. [To-Do](#To-Do)
1. [Características de la malla](#Características-de-la-malla)
2. [¿Cómo funciona la malla?](#¿Cómo-funciona-la-malla?)
3. [Probar malla](#Probar-malla)
4. [Agradecimientos](#Agradecimientos)


# To-Do
- [ ] Simplificar proyecto, reestructurar carpetas.
- [ ] Eliminar cosas no relacionadas con la UAI 
  - [ ] Agregar logo institucional(?)
- [ ] Agregar más carreras
  - [ ] Google Forms para que usuarios suban capturas de Intranet>Plan de Estudios
  - [ ] Script en python para generar archivos de mallas




# Características de la malla
- Visualiza los créditos de las asignaturas.
- Selecciona asignaturas para aprobarlas, a medida que vayas aprobando más ramos, podrás ver que ramos se desbloquean.
- Calcula tu ICA *en progreso*.
- Modo oscuro y modo claro automático basado en la configuración del OS

## ¿Cómo funciona la malla?

Cada malla necesita de un archivo `.json` para que esta se muestre en el sitio. Este tiene por nombre
`data_CARR.json` y se ubica en el directorio `/data`. `CARR` corresponde a la abrebiatura de la carrera (por Ej: ICInf para Ingeniería Civil en Informática).
El archivo contiene la información de cada ramo y sus características agrupados por semestre. Se sigue la siguiente estructura:  
```json5
{
  "s2": [
    ["Cálculo I","MAT101",10,"PC",[]],
    ["Álgebra Lineal","MAT102",10,"PC",[]],
    ...
  ],
//  ...
}
```
En donde  
`s2` Corresponde al semestre, en este caso, Semestre II. `s2` contiene una lista de ramos, donde cada ramo tiene 5 items en el siguiente orden:
1. ***Ramo***: El nombre completo del ramo.
2. ***Sigla***: Sigla del ramo. **Única** para cada ramo, no se puede repetir y no puede contener espacios.
3. ***Créditos***: Entero, la cantidad de créditos.
4. ***Creditos #2*** : *falta quitar esto que se ocupaba en el de la usm, pero para efectos practicos duplicar el anterior hasta un update*
5. ***Categoría***: Categoría del ramo al que pertenece (por ejemplo, *PC*: Plan Común).
6. ***Prerrequisitos***: Una lista de strings que contiene las siglas de los prerrequisitos del ramo.
7. ***Cuando se da el ramo*** : *documentar dsp*

Adicionalmente, se debe tener un archivo `colors_CARR.json` que contiene los colores para cada categoría en formato hexadecimal.

## Probar malla 
Primero clonar el repositorio:
```bash
git clone https://github.com/svaldesoliva/malla-interactiva-uai.git
cd malla-interactiva-uai
```
Con *npm* instalado en el equipo, ejecutar en una terminal los siguientes comandos:
```bash
npm install
npm start
```
Luego, se debería ejecutar una instancia local de la página en `http://localhost:3000`

---
