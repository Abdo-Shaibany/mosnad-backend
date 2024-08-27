TO setup this project 

``npm install``

then create a postgresql database called mosnad

then run:

``npx prisma migrate dev``

give the migration a name 

then run: 
``npx prisma db seed``

to create the default values and user

then run :
``npm start``

default user is admin@admin.com with "password" as password