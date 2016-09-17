server {
   listen 80;
   listen [::]:80;

   root /var/www/chat.io;
   index index.html index.htm;

   server_name chat.io www.chat.io;

   location / {
       try_files $uri $uri/ =404;
   }
}