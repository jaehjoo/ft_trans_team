FROM python:3.11.8-alpine3.18

WORKDIR /app/src/django

COPY ./requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN django-admin startproject config .
RUN python3 manage.py startapp users
RUN mkdir -p /app/src/django/.static /app/src/django/tools /app/src/django/.media


COPY ./src/ /app/src/django/
COPY ./tools/script.sh /app/src/django/tools/

RUN pip install gunicorn
RUN chmod +x /app/src/django/tools/script.sh

EXPOSE $DJANGO_PORT

ENTRYPOINT ["sh", "/app/src/django/tools/script.sh"]
CMD [ "gunicorn", "--bind", "0:8000", "config.wsgi:application" ]