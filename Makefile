# Docker image and container configuration
IMAGE_NAME = m3u8-player
CONTAINER_NAME = m3u8-player-container
PORT = 3000

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the container in detached mode
run:
	docker run -d -p $(PORT):$(PORT) --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Stop and remove the container
stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Stop, remove, rebuild, and run the container
restart: stop build run

# Show container logs
logs:
	docker logs -f $(CONTAINER_NAME)

# Shell into the running container
shell:
	docker exec -it $(CONTAINER_NAME) /bin/sh

# Clean up all related Docker resources
clean: stop
	docker rmi $(IMAGE_NAME) || true

# Help command
help:
	@echo "Available commands:"
	@echo "  make build    - Build Docker image"
	@echo "  make run      - Run Docker container"
	@echo "  make stop     - Stop and remove container"
	@echo "  make restart  - Rebuild and restart container"
	@echo "  make logs     - Show container logs"
	@echo "  make shell    - Open shell in container"
	@echo "  make clean    - Remove container and image"

.PHONY: build run stop restart logs shell clean help 