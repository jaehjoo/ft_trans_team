SRCS = ./srcs
NETWORK = intra
NGINX_IMAGE = ./nginx.tar
DJANGO_IMAGE = ./django.tar
POSTGRES_IMAGE = ./postgres.tar

all:
	@make up
up:
	# @mkdir -p $(VOLUME)
	@docker load -i $(NGINX_IMAGE)
	@docker load -i $(DJANGO_IMAGE)
	@docker load -i $(POSTGRES_IMAGE)
	@docker-compose -f $(SRCS)/docker-compose.yml up -d --build
down:
	@docker-compose -f $(SRCS)/docker-compose.yml down
clean:
	@if [ -n "$$(docker ps -qa)" ]; then \
		docker stop $$(docker ps -qa); \
		docker rm $$(docker ps -qa); \
	fi
	@if [ -n "$$(docker images -qa)" ]; then \
		docker rmi $$(docker images -qa); \
	fi
	@if [ -n "$$(docker volume ls -q)" ]; then \
	 	docker volume rm $$(docker volume ls -q); \
	fi
fclean:
	# @rm -rf $(VOLUME)
	@make clean
re:
	@make fclean
	@make all
