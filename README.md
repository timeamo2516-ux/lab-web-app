# Tech Store Web

Aplicación Angular 19 mínima para consultar inventario y registrar ventas.

- Puerto: `8080`
- `/api/products` se proxifica al microservicio de inventario.
- `/api/sales` se proxifica al microservicio de ventas.

El contenedor usa Nginx sin privilegios y una construcción multistage.
