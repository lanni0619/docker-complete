#### Outline

- How to use Docker Container & Image
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

#### Command of Managing

- docker --help
  Showing all docker commands
- docker ps --help
  Showing all options of ps

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

#### Removing stopped container automatically

- docker run --help => --rm
  - Automatically remove the container and its associated anonymous volumes when it exits
  - docker run -p 3000:80 -d --rm image

#### Inspecting image

- docker inpsect image
  - Get full id of image
  - Get created time
  - Get configuration for container
  - OS: linux
  - different layers of this image => different command make up it

#### Copying file into or from a container

- Some situation you need to change or copy file in the container
- docker cp SRC_LOCAL_PATH CONTAINER:DEST_PATH
- docker cp CONTAINER:SRC_PATH DEST_LOCAL_PATH

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

#### Sharing Images

- Share a dockerfile (Not a convention)
  - Simply run docker build .
  - The dockerfile instruction might need surrounding files (source code)
- Share a Image (convention)
  - download image and run a container base on it.
  - No build step required.

#### Pushing/Pulling

- Two place to push/pull (dockerhub / private registry)
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
    - - docker run -p 3000:3000 --rm -d lanni0619/node-hello-world
