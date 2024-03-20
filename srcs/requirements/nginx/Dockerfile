FROM alpine:3.18

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache nginx bash openssl dumb-init
RUN mkdir -p /etc/nginx/ssl /run/nginx
RUN chown -R nginx:nginx /etc/nginx/ssl /run/nginx

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/nginx-app.conf /etc/nginx/sites-available/nginx-app.conf
COPY ./tools/script.sh /usr/local/bin/script.sh

RUN mkdir -p /etc/nginx/sites-enabled/ /etc/nginx/ssl/\
	&& ln -s /etc/nginx/sites-available/nginx-app.conf /etc/nginx/sites-enabled/

RUN chmod +x /usr/local/bin/script.sh

ENTRYPOINT [ "/usr/bin/dumb-init", "--", "sh", "/usr/local/bin/script.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]