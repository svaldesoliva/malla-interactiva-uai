# Malla interactiva UAI

Adaptación del visualizador de mallas interactivo para la Universidad Adolfo Ibáñez. El proyecto original fue creado para la Universidad Técnica Federico Santa María.

# Índice
1. [Características de la malla](#Características-de-la-malla)
2. [¿Cómo funciona la malla?](#¿Cómo-funciona-la-malla?)
3. [Probar malla](#Probar-malla)
4. [Agradecimientos](#Agradecimientos)

# Características de la malla
- Visualiza los créditos de las asignaturas.
- Selecciona asignaturas para aprobarlas, a medida que vayas aprobando más ramos, podrás ver que ramos se desbloquean.
- Calcula tu ICA.
- Crear una malla personal que se adecue a tu recorrido en la Universidad.
- Cualquier cambio realizado queda guardado para la próxima visita a la página
- Modo oscuro y modo claro automático basado en la configuración del SO o explorador

## ¿Cómo funciona la malla?

Cada malla necesita de un archivo `.json` para que esta se muestre en el sitio. Este tiene por nombre
`data_CARR.json` y se ubica en el directorio `/data`. `CARR` corresponde a la abrebiatura de la carrera (por Ej: ICI para Ingeniería Civil en Informática).
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
3. ***Créditos***: Entero, la cantidad de créditos UAI.
4. ***Categoría***: Categoría del ramo al que pertenece (por ejemplo, *PC*: Plan Común).
5. ***Prerrequisitos***: Una lista de strings que contiene las siglas de los prerrequisitos del ramo.

Adicionalmente, se puede tener un archivo `colors_CARR.json` que contiene los colores para cada categoría.

## Probar malla
Para probar la malla, existen los siguientes métodos:

**NOTA:** Independientemente de la forma en que se prueba la malla, en caso de editar archivos `.js`, para que estos se reflejen, ejecute desde una terminal en la carpeta raíz
```shell
npm run devBuild
```

### Usando Python (preferido)
Lo ideal sería probarlo usando python, ya que permite levantar un mini servidor http lo que facilita la carga
para el navegador. Para esto, se tiene que **abrir una terminal, ir al directorio principal de la malla** y ejecutar lo siguiente:

* Si tiene **Python 3**:
    ```shell
    python -m http.server
    ```

Independiente de la version, una vez ejecutado la línea, después se debe abrir un navegador
e ir a la dirección http://localhost:8000 y ahí debería ver la malla.
Dependiendo de la malla a probar, deberá navegar agregando al final de la url `?m=CARR`. Por ejemplo,
para abrir `data_ICI.json` debería quedar algo como `http://localhost:8000/index.html?m=ICI`.

### Usando Browser-sync
Con *NPM* instalado en el equipo, ejecute desde una terminal en la carpeta raíz de el repo
```shell
npm install
npx browser-sync -w
```
Ejecutado lo anterior, se tendrá en su explorador favorito una
versión local de la página. La dirección por defecto es `http://localhost:3000`

---

