Using DIFY
===

# Deploy
The simplest way of deploying DIFY on a local machine is to use Docker Compose. [Here is how](https://docs.dify.ai/getting-started/install-self-hosted/docker-compose). And [here is my docker-compose.yml file](docker-compose.yaml) to integrate local deployment of Ollama.

# Version
The latest version is 0.8.3. I deployed my local DIFY using Docker Compose, so the easiest way to upgrade is to modify the version numbers in the image item in the `services/api`, `services/worker`, and `services/web` sections.

# Ollama
## VPN
VPN should be turned off when using Ollama locally. I haven't figured out how to run the local service of Ollama with the VPN turned on.

## Trouble shooting
It is not straightforward to get Ollama running with DIFY. Here is a collection of useful links for troubleshooting:

- [docker-compose-ollama-gpu.yaml](https://github.com/valiantlynx/ollama-docker/blob/main/docker-compose-ollama-gpu.yaml)

- [From inside of a Docker container, how do I connect to the localhost of the machine?](https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach)

- [langgenius/dify ISSUE: Can't connect Dify with OLLAMA #2540](https://github.com/langgenius/dify/issues/2540)

## Docker operation and status test
To enter the Ollama Docker image, I use the command `sudo docker exec -it ollama /bin/sh`, from which I can use the command `ollama list` to check the available models, or pull models using the command `ollama pull [model-name]`.

To test the status of the Ollama local server, I use the command:

```curl http://127.0.0.1:11434/api/embed -d '{ "model":"nomic-embed-text", "input": "test" }'```

Or simply:

```curl http://127.0.0.1:11434```
