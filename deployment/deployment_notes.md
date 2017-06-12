## Demoing Docker for AWS (CE)


###manager node:
docker@ec2-52-221-199-231.ap-southeast-1.compute.amazonaws.com

### default dns target:
Docker-ELB-1537108353.ap-southeast-1.elb.amazonaws.com

https://docs.docker.com/docker-for-aws/deploy/#running-apps

## Portainer config

https://portainer.readthedocs.io/en/latest/deployment.html

docker service create \
    --name portainer \
    --publish 9000:9000 \
    --constraint 'node.role == manager' \
    --mount type=bind,src=//var/run/docker.sock,dst=/var/run/docker.sock \
    portainer/portainer \
    -H unix:///var/run/docker.sock

initial pwd:
lewisdaly




##Deployment?

nginx-letsencrypt:
  image: jrcs/letsencrypt-nginx-proxy-companion
  container_name: nginx-letsencrypt
  volumes:
      - /var/run/docker.sock:/tmp/docker.sock:rw
      - /var/run/docker.sock:/var/run/docker.sock:ro
  volumes_from:
      - nginx-proxy
  links:
      - nginx-proxy


docker service create \
  --name nginx-letsencrypt \


docker service create \
  --name mywell-db \
  --

docker service create \
  --name mywell-server \
  --publish 3000:3000 \
  --env TERM=xterm-256color \
        VIRTUAL_HOST=mywell-server.vesselstech.com \
        HTTPS_METHOD=redirect \
        VIRTUAL_PORT=3000 \
        LETSENCRYPT_EMAIL=lewis@vesselstech.com \
        LETSENCRYPT_HOST=mywell-server.vesselstech.com \
        ENABLE_NOTIFICATIONS=false \


### Deploying with docker swarm:
docker stack deploy --compose-file docker-compose.swarm.yml mywell-test
docker stack services mywell-test
