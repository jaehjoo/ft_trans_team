#!/bin/sh

export HOST_IP=$(ping -c 1 host.docker.internal | grep "PING" | cut -d "(" -f 2 | cut -d ")" -f 1)

echo "set nginx configure"
sed -i "s/listen s ssl;/listen ${NGINX_PORT} ssl;/g" /etc/nginx/sites-available/nginx-app.conf
sed -i "s/listen \[::\]: s ssl;/listen \[::\]:${NGINX_PORT} ssl;/g" /etc/nginx/sites-available/nginx-app.conf
sed -i "s/ssl_certificate s;/ssl_certificate ${SSL_CRT};/g" /etc/nginx/sites-available/nginx-app.conf
sed -i "s/ssl_certificate_key s;/ssl_certificate_key ${SSL_KEY};/g" /etc/nginx/sites-available/nginx-app.conf

echo "set openssl"
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
	-keyout ${SSL_KEY_OSL} \
	-out ${SSL_CRT_OSL} -sha256 \
	-subj "/C=KR/ST=Seoul/L=Gangnam/O=42Seoul/OU=Cadet/CN=jaehjoo/emailAddress=jaehjoo@email.net"
echo "complete openssl"

echo "start nginx"
exec "$@"