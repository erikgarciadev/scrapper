Scrapper
====================

Crea un archivo `.env` escribe esto con sus respectivos valores, tambien puede guiarse del archivo `.env.template`
El valor prod en deployment hace que al generar la carpeta dist, los archivos generados sean minificados.

La variable MAX_CANDIDATES , es para scrappear un maximo de usuarios debido a que linkedin detecto que se esta automatizando el obtener la informacion del usuario
```
DEPLOYMENT=PROD
MAX_CANDIDATES=1
```

### <a>Generar carpeta dist</a>

Ejecutar el siguiente comando
```
npm run dev
```

Esto generara una carpeta dist en caso de no realizarlo cree la carpeta dist y vuelva a correr el comando de arriba.

Despues de tener la carpeta dist con sus archivos en la carpeta lib , copiar el archivo `manifest.example.json` a la carpeta dist y cambiarle el nombre a `manifest.json`.

Despues esa carpeta puede ser subida a las extensiones de chrome

### <a>Levantar api de json-server</a>

Ejecutar el siguiente comando en otra consola 

```
npm run dbjson
```

Y despues de realizar el scrapper se podria observar la informacion en el archivo `mock/db.json`.

