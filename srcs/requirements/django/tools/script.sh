#!/bin/sh

sleep 5

export HOST_IP=$(ping -c 1 host.docker.internal | grep "PING" | cut -d "(" -f 2 | cut -d ")" -f 1)

python3 manage.py makemigrations
python3 manage.py collectstatic
python3 manage.py migrate
python3 manage.py createsuperuser --noinput

exec "$@"