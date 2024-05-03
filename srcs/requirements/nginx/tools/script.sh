#!/bin/sh

echo "set openssl"
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
	-keyout ${SSL_KEY_OSL} \
	-out ${SSL_CRT_OSL} -sha256 \
	-subj "/C=KR/ST=Seoul/L=Gangnam/O=42Seoul/OU=Cadet/CN=jaehjoo/emailAddress=jaehjoo@email.net"
echo "complete openssl"

echo "start nginx"
exec "$@"