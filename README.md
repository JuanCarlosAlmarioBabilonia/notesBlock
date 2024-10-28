***BLOCK DE NOTAS***

# CONSULTAS A REALIZAR

## Crear Usuario

***METHOD***

`POST`

***URL*** 

`https://localhost:3000/users`

***DATA DEL USUARIO A CREAR***
 
```json
{
    "nombre": "Mercedes",
    "apellido": "Arteaga",
    "email": "mercedes@gmail.com",
    "username": "mercedesA123",
    "password": "mercedes123"
}
```

***STATUS***

`201`

```json
{
  "message": "Usuario creado",
  "data": {
    "nombre": "Mercedes",
    "apellido": "Arteaga",
    "email": "mercedes@gmail.com",
    "username": "mercedesA123",
    "password": "$2b$10$BfifFFK2M5Np0JHNCk2leOOXDm6esLMWJ2iqAMg3FebNtPvIfU2sq",
    "rol": "Usuario",
    "_id": "671ef26934a89c6d65ff790b"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWVmMjY5MzRhODljNmQ2NWZmNzkwYiIsInJvbCI6IlVzdWFyaW8iLCJpYXQiOjE3MzAwODEzODYsImV4cCI6MTc0ODA4MTM4Nn0.W5Kc7WWdTrAiCE1KcUsoLi-ex9-grTYAKLpCUH-rIVs"
}
```


## Iniciar Sesión

***METHOD***

`POST`

***URL*** 

`https://localhost:3000/users/login`

***DATA DEL USUARIO A LOGUEAR***
 
```json
{
    "username": "mercedesA123",
    "password": "mercedes123"
}
```

***STATUS***

`200`

```json
{
  "message": "Inicio de sesión exitoso",
  "_id": "671ef26934a89c6d65ff790b",
  "username": "mercedesA123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzFlZjI2OTM0YTg5YzZkNjVmZjc5MGIiLCJyb2wiOiJVc3VhcmlvIiwiaWF0IjoxNzMwMDgxNDU4LCJleHAiOjE3NDgwODE0NTh9.lMsbFwoFEdxvqPoo_yRsIUhzrVk0uJCAGW247LBBgXE"
}
```


**IMPORTANTE**

Es necesario que despues de haber creado un usuario o de haberse logueado, se coloque en **Headers** dentro de Thunder Client lo siguiente:

**Authorization** - En la columna izquierda y **Bearer (token)** - En la columna derecha

***Ejemplo:***

```json
Authorization - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzFlZjI2OTM0YTg5YzZkNjVmZjc5MGIiLCJyb2wiOiJVc3VhcmlvIiwiaWF0IjoxNzMwMDgxNDU4LCJleHAiOjE3NDgwODE0NTh9.lMsbFwoFEdxvqPoo_yRsIUhzrVk0uJCAGW247LBBgXE
```

**¿Esto por qué se hace?**

Basicamente para autenticar al usuario que se logueó y solo tenga acceso a la informacion de notas que le corresponde solo a el


## Crear Nota

***METHOD***

`POST`

***URL*** 

`https://localhost:3000/notes`

***DATA A CREAR***
 
```json
{
    "titulo": "README.md del proyecto de Express",
    "descripcion": "El readme esta incompleto, debo terminarlo"
}
```

***STATUS***

`200`

```json
{
  "message": "Nota creada",
  "data": {
    "id_usuario": "671ef26934a89c6d65ff790b",
    "titulo": "README.md del proyecto de Express",
    "descripcion": "El readme esta incompleto, debo terminarlo",
    "cambios": [],
    "estado": "Visible",
    "_id": "671ef51134a89c6d65ff790e"
  }
}
```


## Obtener Todas las Notas

***METHOD***

`GET`

***URL*** 

`https://localhost:3000/notes`

***STATUS***

`200`

```json
{
  "message": "Lista de notas obtenidas",
  "data": [
    {
      "_id": "671ef51134a89c6d65ff790e",
      "titulo": "README.md del proyecto de Express",
      "descripcion": "El readme esta incompleto, debo terminarlo",
      "fecha": "28/10/2024"
    }
  ]
}
```


## Obtener Nota Específica

***METHOD***

`GET`

***URL*** 

`https://localhost:3000/notes/:id`

En este caso, el ejemplo es: **671ef51134a89c6d65ff790e**

***STATUS***

`200`

```json
{
  "message": "Nota obtenida",
  "data": {
    "_id": "671ef51134a89c6d65ff790e",
    "titulo": "README.md del proyecto de Express",
    "descripcion": "El readme esta incompleto, debo terminarlo",
    "fecha": "28/10/2024"
  }
}
```


## Actualizar Nota

***METHOD***

`PUT`

***URL*** 

`https://localhost:3000/notes/:id`

En este caso, el ejemplo es: **671ef51134a89c6d65ff790e**

***DATA A ACTUALIZAR***
 
```json
{
    "titulo": "README.md del proyecto de Express incompleto",
    "descripcion": "El readme esta incompleto, debo terminarlo hoy"
}
```

***STATUS***

`200`

```json
{
  "message": "Nota actualizada con cambios registrados",
  "data": {
    "_id": "671ef51134a89c6d65ff790e",
    "id_usuario": "671ef26934a89c6d65ff790b",
    "titulo": "README.md del proyecto de Express",
    "descripcion": "El readme esta incompleto, debo terminarlo",
    "cambios": [
      {
        "titulo": "README.md del proyecto de Express incompleto",
        "descripcion": "El readme esta incompleto, debo terminarlo hoy",
        "fecha": "27/10/2024"
      }
    ],
    "estado": "Visible"
  }
}
```


## Buscar Notas

***METHOD***

`GET`

***URL*** 

`https://localhost:3000/notes/search/:busqueda`

En este caso, el ejemplo es: **readme**

***STATUS***

`200`

```json
{
  "message": "Notas encontradas",
  "data": [
    {
      "_id": "671ef51134a89c6d65ff790e",
      "titulo": "README.md del proyecto de Express incompleto",
      "descripcion": "El readme esta incompleto, debo terminarlo hoy",
      "fecha": "27/10/2024"
    }
  ]
}
```

**EN CASO DE ERROR**

***URL*** 

`https://localhost:3000/notes/search/:busqueda`

En este caso, el ejemplo es: **ola**

***STATUS***

`404`

```json
{
  "message": "No se encontraron notas con ese término"
}
```


## Eliminar Nota

***METHOD***

`DELETE`

***URL*** 

`https://localhost:3000/notes/:id`

En este caso, el ejemplo es: **671ef51134a89c6d65ff790e**

***STATUS***

`200 `

```json
{
  "message": "Estado de la nota cambiado a 'No visible'",
  "data": {
    "_id": "671ef51134a89c6d65ff790e",
    "id_usuario": "671ef26934a89c6d65ff790b",
    "titulo": "README.md del proyecto de Express",
    "descripcion": "El readme esta incompleto, debo terminarlo",
    "cambios": [
      {
        "titulo": "README.md del proyecto de Express incompleto",
        "descripcion": "El readme esta incompleto, debo terminarlo hoy",
        "fecha": "27/10/2024"
      }
    ],
    "estado": "No visible"
  }
}
```


## Cerrar Sesión

***METHOD***

`POST`

***URL*** 

`https://localhost:3000/users/logout`

***STATUS***

`200`

```json
{
  "message": "Sesión cerrada correctamente"
}
```

En caso de que se quiera hacer alguna consulta sin estar logueado:

***STATUS***

`401`

```json
{
  "message": "Token inválido o sesión expirada"
}
```