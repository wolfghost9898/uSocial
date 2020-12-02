# uSocial
## ARQUITECTURA
![image](https://user-images.githubusercontent.com/20384738/98549833-f191c880-2260-11eb-84c0-4a2b9500eaef.png)

## VPC
![image](https://user-images.githubusercontent.com/20384738/98549735-d6bf5400-2260-11eb-9456-b3ffd2162a01.png)

## Integrantes

- Carlos Eduardo Hernandez Molina-201612118
- Jeralmy Alejandra de León Samayoa-201612139

## Usuarios IAM

Account Administrador_201612119

| Nombre                  | Grupo         | Descripción                                                                                                                                                                                                                                           | Permisos |
|-------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Administrador_201612118 | Administrador | Usuario para administrar los recursos de IAM y AWS. Desde esta cuenta se crearon los servicios al  API  Server, la configuración  de permisos para acceder a los  servicios, seguridad y la creación de las instancias EC2 implementando Load Balancer. | Todos    |
| pro1-user-grupo26       | Ninguno       | Usuario con permisos para acceder a las instancias EC2 y al bucket del sitio web.                                                                                                                                                                     | EC2, S3   |
    
Account Administrador_201612139

| Nombre                  | Grupo         | Descripción                                                                                                                                                                     | Permisos                       |
|-------------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|
| Administrador_201612139 | Administrador | Usuario para administrar los recursos de IAM y AWS. Desde esta cuenta se crearon los servicios al API  Serverless y la  configuración de permisos para acceder a los servicios.  | Todos                          |
| dynamoDB-semi1-key      | Ninguno       | Llaves de acceso para la conexion de API  Server con la base de  datos y el bucket  S3  de las imágenes.                                                                        | DynamoDB S3                    |
| pro1-user-grupo26       | Ninguno       | Usuario con permisos para administrar la API Gateway, base  de datos y el bucket  de las imágenes.                                                                              | DynamoDB S3 API Gateway Lambda |    
      
