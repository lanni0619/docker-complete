### Outline

- Container & Image
  - [Basic command](#basic-command)
  - [Command of Managing](#command-of-managing)
  - [Attached/detached mode](#attacheddetached-mode)
  - [Interactive Mode](#Interactive-Mode)
  - [Deleting](#Deleting)
  - [Removing stopped container automatically](#removing-stopped-container-automatically)
  - [Inspecting image](#inspecting-image)
  - [Copying file into or from a container](#copying-file-into-or-from-a-container)
  - [Naming & Tagging](#naming--tagging)
  - [Sharing Images](#sharing-images)
  - [Pushing/Pulling](#pushingpulling)
- Managing data & Volumes
  - [Intro - data](#intro---data)
  - [Data Categories](#data-categories)
  - [Volumes](#volumes)
  - [Anonymous, Named & bind-mount](#anonymous-named--bind-mount)
  - [Read-Only Volume](#read-only-volume)
  - [Snapshot for production](#snapshot-for-production)
  - [ARG & ENV Variables](#arg--env-variables)
- Networks
  - [Containers & Network Requests](#containers--network-requests)
  - [How Docker Resolves IP Address](#how-docker-resolves-ip-address)
- Multi-Container Application
  - [Containers & Network Requests](#containers--network-requests)
  - [How Docker Resolves IP Address](#how-docker-resolves-ip-address)
  - [Network Project-05](#network-project-05)
- Docker Compose
  - [project-05-yaml-instruction](#project-05-yaml-instruction)

### Container & Image

#### Basic command

- docker ps
  find running containers
- docker ps -a
  find all containers (both running and stopping)
- docker stop "name"
  stop container
- docker build .
  The dot means the root folder where the image be stored at
- docker run "image_id"
  create & start a new container running in the foreground => terminal attached mode
- docker run -p 3000:80 "image_id"
  - -p stands for publish
  - connect local port & expose port
  - syntax: -p local_port:exposed_port
- [back to outline](#outline)

#### Command of Managing

- docker --help
  Showing all docker commands
- docker ps --help
  Showing all options of ps
- [back to outline](#outline)

#### Attached/detached mode

- attached means we're listening the output of container
- docker run image
  attached mode (running in foreground)
- docker run -d image
  detached mode
- docker start container
  default detached mode (running in background)
- dockerstart -a container
  attached mode
- docker logs container
  fetch the logs of container
- docker logs container -f
  follow log output => attach again
- docker attach container
  attach to a running container
- [back to outline](#outline)

#### Interactive Mode

- Build a "python project with input instruction" to a image.
- If run command directly => docker run image => You'll get error msg about input
- Because the container is not able to connect with input.
- Active the interactive mode using -i flag
  - docker run --help
  - STDIN mean standard input
- Using -i combine with -t => in the end this means it creates a terminal
- docker run -i -t image => docker run -it image
- If restart the container => Cannot interact with it again
  - docker start --help
  - Also have -i option to active interactive mode.
  - docker start -i container
- [back to outline](#outline)

#### Deleting

- container
  - Can not remove a container which still running.
  - Should stop the container before removing the image.
  - docker rm container1 container2 ... => remove container
  - docker container prune => To remove all stopped container at once.
- image
  - Can not remove a image which still belong to a container.
  - Should remove the container before removing the image.
  - docker images => list images
  - docker rmi image1 image2 ... => remove image
  - docker image prune => To remove all unused images
- [back to outline](#outline)

#### Removing stopped container automatically

- docker run --help => --rm
  - Automatically remove the container and its associated anonymous volumes when it exits
  - docker run -p 3000:80 -d --rm image
- [back to outline](#outline)

#### Inspecting image

- docker inpsect image
  - Get full id of image
  - Get created time
  - Get configuration for container
  - OS: linux
  - different layers of this image => different command make up it
- [back to outline](#outline)

#### Copying file into or from a container

- Some situation you need to change or copy file in the container
- docker cp SRC_LOCAL_PATH Container_name/id:DEST_PATH
- docker cp Container_name/id:SRC_PATH DEST_LOCAL_PATH
- [back to outline](#outline)

#### Naming & Tagging

- docker run --name string
- docker run -p 3000:80 -d --rm --name goalsAPP 66aa8ee81dc3
- Understanding Image Tags => name : tag
  - [Supported tags of Node](https://hub.docker.com/_/node)
  - node:22, node:current, node:latest ...
  - Build image with name:tag
    - docker build -t goalapp:latest .
  - Run container by image's name:tag
    - docker run -p 8000:80 -d --rm --name goalapp goalapp:latest
- [back to outline](#outline)

#### Sharing Images

- Share a dockerfile (Not a convention)
  - Simply run docker build .
  - The dockerfile instruction might need surrounding files (source code)
- Share a Image (convention)
  - download image and run a container base on it.
  - No build step required.
- [back to outline](#outline)

#### Pushing/Pulling

- Two place to push/pull (dockerhub / private registry in later course)
- dockerhub
  - Create a repo
  - Push
    - docker push lanni0619/node-hello-world (default command)
  - login/logout
    - docker login
    - docker logout
  - Change local image_name
    - docker build -t/--tag node-hello-world .
    - docker tag origin_name:tag new_name:tag
      - Actually create a clone of old image
  - Pull
    - docker pull lanni0619/node-hello-world
    - No need to login (public repo)
    - Always pull the latest
  - Run container directly
    - No need to pull image before running.
    - Updating to local automatically.
    - Check for the latest version at dockerhub repo.
    - It's will not check for latest version if running image in local.
    - docker run -p 3000:3000 --rm -d lanni0619/node-hello-world
- [back to outline](#outline)

### Managing data & Volumes

#### Intro - data

- Understanding different kind of data
- Images, Containers & Volumes
- Using Arguments & Environment Variables

#### Data categories

- application (code + environment)
  - written by developer
  - Fixed: Can not be changed once image is built
- temporary App data
  - Stored in memory or temporary files
  - Dynamic and changing, but cleared regularly
  - Read + Write, temporary, hence stored in Container
    - extra, read-write layer
    - neither local machine nor image layer
- Permanent App Data
  - e.g. user accounts
  - Stored in files or a database
  - Must not be lost if stops / restrarts
  - Read + Write, permanent, hence stored with Containers & Volumes
- Demonstrating project
  - data-volumes-01
  - Problem: The permanent data will be removed along with container.
  - Solution: Volume
- [back to outline](#outline)

#### Volumes

- Folders on your host machine
  - Mounted(made available, mapped) into containers
  - Volumes persist if a container is removed.
  - Container can write data into or read data from volumes.
- Setting Volume (dockerfile)
  - Following "data-volumes-01" project
  - Instruction of anonymous volume: VOLUME ["/app/feedback"]
- [back to outline](#outline)

#### Anonymous, Named & Bind Mount

- Volume (Managed by Docker)
  - anonymous volume
    - Attached to a container
      - **Only exists as long as our container exists.**
      - The data's location is unknown to you.
      - Managed via docker volume command
        - docker vloume ls
        - docker volume prune
  - named volume
    - Detached to a container
      - **Surviving after container being removed.**
      - Still can not access by you.
    - command
      - docker run -v volumes_name:/app/data
  - Bind Mount (Managed by yourself)
    - feature
      - Not managed by docker
    - Command
      - docker run -v local_absolute_path:/app
        - Example: Bind entire folder to conatiner workdir
          - docker run -v "D:\coding\docker-complete:/app"
          - Quote to ensure that doesn't break in case your path include special char.
    - Differents
      - Volume outsource certain data to local machine.
      - Bind Mount overwrite local file to container.
      - Using anonymous volume to avoid overwriting node_modules
  - NodeJS specific adjustment: nodemon
    - wsl2-file-events.pdf
  - Summary (Detail in pdf)
    |Comparison| Anonymous | Named | Bind Mount |
    | ---------| --------- | ----- |----------- |
    | container | attached | dettached | Not tied to specific container|
    | handy feature | lock exist file | Can be re-used | Can be re-used |
    | | outsource certain data| shared across containers | shared across containers|
- [back to outline](#outline)

#### Read-Only Volume

- Read-write
  - The default for Volume is read-write.
- The ideas of bind mount
  - We only want to change those files by myself.
  - Ensuring that docker will not be able to write into /app.
- Use Ready-only instruction
  - docker run -v "local_path:/app:ro"
  - But some files should writable.
    - add anonymous volume for specific file (temp) after bind mount.
    - To override bind mount setting.
    - docker run -v local_path:/app:ro -v /app/temp
- [back to outline](#outline)

#### Snapshot for production

- Only use bind mount in development.
- When we deploy a container, we will not use bind mount.
- There is no connection between running container & our code.
- We always want to have a snapshot of our code to spin up production.
- [back to outline](#outline)

#### ARG & ENV Variables

Prodiving developer build flexible image & container
We don't have to hard-code everything into image & container

- ARG
  - Build-time variable
  - Available
    - Inside of Dockerfile
  - Setting
    - Via Command
    - ducker build . --build-arg
- ENV
  - Available
    - Inside of Dockerfile
    - Application code
  - Setting
    - Via Dockerfile
    - Via Command: [docker run container --env path]
    - Via ".env" file: Using --env-file options
- [back to outline](#outline)

### Network

#### Containers & Network Requests

- Requests from Container to WWW
  - Container can do it natively
- Requests from Container to host machine
  - Use special domain
    - host.docker.internal
  - Origin: mongodb://localhost:27017/swfavorites
  - Modify: mongodb://host.docker.internal:27017/swfavorites
- Requests from Container to Other Container
- [back to outline](#outline)

#### How Docker Resolves IP Address

- Docker will not replace your source code.
- Docker resolves it when the request leaves the container.
- [back to outline](#outline)

#### Network Project-05

- Build mongo, node & react container & communicate with each other.
- [back to outline](#outline)

### docker compose

#### project-05-yaml-instruction

- Create compose file
  - File extension is yaml or yml.
- Command
  - docker compose up -d
  - docker compose down
  - detail in 05-multi-setup\docker-compose.yaml
- [back to outline](#outline)

### Utility Container

#### Introduction

- Utility Container is named by instructor & not a offical term.
- The main idea is that we don't need to install tools in our host machine.
- With utility container, we don't need to install environment like node.js in host machine.
- [back to outline](#outline)

#### Different ways of running command in container

- Way 1: Run node in foreground
  - docker run -it node
- Way 2: Run node in background
  - docker run -it -d node
  - docker exec -it container_name npm init
  - Syntax: exec
    - Execute a command in a running container
- Way 3: Override the default command
  - docker run -it node npm init
  - The container is closed immediately after npm init
  - Because we override the interactive mode command
- [back to outline](#outline)

#### Build utility Container

- Create a dockerfile
  - node-apline
  - Not specify a fixed command
  - build image
- Run container
  - Mirror container to local by bind-mount
  - docker run -it -v D:\docker-complete\06-utility:/app node-util npm init
  - "npm init" will override CMD in dockerfile
- [back to outline](#outline)

#### dockerfile-ENTRYPOINT

- Syntax
  - ENTRYPOINT [ "npm" ]
  - We can append command after ENTRYPOINT
- Command
  - docker run -it -v D:\docker-complete\06-utility:/app mynpm init
  - docker run -it -v D:\docker-complete\06-utility:/app mynpm install
- With this, we don't need node in host machine to create project.
