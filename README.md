# Library API

Este proyecto es un servidor web desarrollado con Express.js que funciona como un sistema de gestión para una biblioteca. Este servidor se conecta a una base de datos MongoDB y ofrece una serie de rutas API para administrar usuarios, libros, reservas y permisos.  Además, utiliza JWT para la autenticación, lo que agrega una capa de seguridad al sistema. Este proyecto fue el primero de dos proyectos finales para el curso de Backend. 


## Rutas CRUD

### 1. Create (Usuario):

Endpoint: POST /register

Ejemplo de solicitud:

```
Body:
{
  "name": "Carlos Lopez",
  "email": "carlos.lopez@example.com",
  "password": "miContraseñaSegura123",
  "role": "user" // o "admin"
}
```

### 2. Create (Libro):

Endpoint: POST /books/create

Ejemplo:

```
Body:
{
  "title": "Cien Años de Soledad",
  "author": "Gabriel García Márquez",
  "genre": "Novela",
  "publisher": "Editorial Sudamericana",
  "publicationDate": "1967-06-05",
  "number_copies": 5
}
```

### 3. Read (Usuario):

Endpoint: POST /login

Ejemplo de solicitud:

```
{
  "email": "laura.martinez@example.com",
  "password": "passwordSeguro123",
}
```

### 4. Read (Libro):

Endpoint: GET /books

Ejemplo de solicitud (búsqueda por ID):
```http://localhost:8080/books?id=64b8c44f5e8b12001abc1234```

Ejemplo de solicitud (búsqueda con filtros):
```http://localhost:8080/books?genre=Novela&author=Gabriel%20García%20Márquez&available=true```


### 5. Update (Usuario):

Endpoint: PUT /update/:mail

Ejemplo:
```http://localhost:8080/update/carlos.lopez@example.com```


```
{
  "name": "Carlos López Modificado",
  "email": "carlos.lopez@example.com",
  "role": "user"
}
```

### 6. Update (Libro):

Endpoint: PUT /books/update/:id
```http://localhost:8080/books/update/64b8c44f5e8b12001abc1234```


```
Body:
{
  "title": "Cien Años de Soledad - Edición Especial",
  "author": "Gabriel García Márquez",
  "genre": "Novela",
  "publisher": "Editorial Sudamericana",
  "publicationDate": "1967-06-05",
  "number_copies": 10,
  "available": true
}
```

### 7. Delete (Usuario):

Endpoint: DELETE /delete/:mail

Ejemplo de solicitud:
```http://localhost:8080/delete/carlos.lopez@example.com```

### 8. Delete (Libro):

Endpoint: DELETE /books/delete/:id

Ejemplo:
```http://localhost:8080/api/books/delete/64b8c44f5e8b12001abc1234```

