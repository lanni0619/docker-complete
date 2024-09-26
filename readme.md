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
  - [External data storage](#external-data-storage)

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

#### External Data Storage

- Volumes (Managed by Docker)
  - anonymous volume
    - Attached to a container
      - **Only exists as long as our container exists.**
      - The data's location is unknown to you.
      - Managed via docker volume command
        - docker vloume ls
        - docker volume prune
  - named volumes
    - Detached to a container
      - **Surviving after container being removed.**
      - Still can not access by you.
    - command
      - docker run -v volumes_name:/app/data
- Bind Mounts (Managed by yourself)
  - Command
    - docker run -v local_absolute_path:/app
      - Example: Bind entire folder to conatiner workdir
        - docker run -v "D:\coding\docker-complete:/app"
        - Quote to ensure that doesn't break in case your path include special char.
- [back to outline](#outline)
