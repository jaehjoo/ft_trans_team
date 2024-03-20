#!/bin/sh

sleep 5

python3 manage.py makemigrations
python3 manage.py collectstatic
python3 manage.py migrate
python3 manage.py createsuperuser --noinput

exec "$@"