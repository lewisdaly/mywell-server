## Demoing Docker for AWS (CE)


###manager node:
docker@ec2-52-221-199-231.ap-southeast-1.compute.amazonaws.com

### default dns target:
Docker-ELB-1537108353.ap-southeast-1.elb.amazonaws.com

https://docs.docker.com/docker-for-aws/deploy/#running-apps
https://docs.docker.com/compose/compose-file/#update_config

## Portainer config

https://portainer.readthedocs.io/en/latest/deployment.html

docker service create \
    --name portainer \
    --publish 9000:9000 \
    --constraint 'node.role == manager' \
    --mount type=bind,src=//var/run/docker.sock,dst=/var/run/docker.sock \
    portainer/portainer \
    -H unix:///var/run/docker.sock


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
docker stack deploy --compose-file docker-compose.swarm.yml mywell-development
docker stack services mywell-development



TODO:
- get server working!
- Persist DB
- configure with circle? Or TravisCI?
- auto refresh?
- Auth stuff
- Set up backups with lambda etc.



### Setting up single lets encrypt and nginx, with multiple stacks - is it possible?
docker service create \
  --name=viz \
  --publish=8081:8080/tcp \
  --constraint=node.role==manager \
  --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
  dockersamples/visualizer

docker network create --driver overlay base-network
docker service create \
--name traefik \
--constraint 'node.role==manager' \
--publish 80:80 --publish 443:443 --publish 8080:8080 \
--mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
--mount type=bind,source=/var/tmp,target=/etc/traefik/acme \
--network base-network \
traefik:camembert \
--entryPoints='Name:http Address::80 Redirect.EntryPoint:https' \
--entryPoints='Name:https Address::443 TLS' \
--defaultEntryPoints=http,https \
--acme.entryPoint=https \
--acme.email=lewis@vesselstech.com \
--acme.storage=/etc/traefik/acme/acme.json \
--acme.domains=vessels.tech \
--acme.onHostRule=true \
--docker \
--docker.swarmmode \
--docker.domain=vessels.tech \
--docker.watch \
--logLevel=DEBUG \
--web

docker service create \
--name traefik \
--constraint=node.role==manager \
--publish 443:443 --publish 8080:8080 \
--mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock,readonly \
--mount type=bind,source=/var/tmp,target=/etc/traefik/acme \
--network base-network \
traefik:v1.1.0-rc3 \
--entryPoints='Name:https Address::443 TLS' \
--defaultEntryPoints=https \
--acme.entryPoint=https \
--acme.email=lewis@vesselstech.com \
--acme.storage=/etc/traefik/acme/acme.json \
--acme.domains=vessels.tech \
--acme.onHostRule=true \
--docker \
--docker.swarmmode \
--docker.domain=vessels.tech \
--docker.watch \
--logLevel=DEBUG \
--web

docker service create \
--name traefik \
--constraint 'node.role==manager' \
--publish 80:80 --publish 443:443 --publish 8080:8080 \
--mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
--mount type=bind,source=/var/tmp,target=/etc/traefik/acme \
--network base-network \
traefik:1.3.0 \
--entryPoints='Name:http Address::80' \
--defaultEntryPoints=http \
--docker \
--docker.swarmmode \
--docker.domain=vessels.tech \
--docker.watch \
--logLevel=DEBUG \
--web


##THIS ONE WORKS!!!
docker service create \
--name traefik \
--constraint 'node.role==manager' \
--publish 80:80 --publish 443:443 --publish 8080:8080 \
--mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
--mount type=bind,source=/var/tmp,target=/etc/traefik/acme \
--network base-network \
traefik:1.3.0 \
--entryPoints='Name:http Address::80 Redirect.EntryPoint:https' \
--entryPoints='Name:https Address::443 TLS' \
--defaultEntryPoints=http,https \
--acme.entryPoint=https \
--acme.email=lewis@vesselstech.com \
--acme.storage=/etc/traefik/acme/acme.json \
--acme.domains=vessels.tech \
--acme.onHostRule=true \
--docker \
--docker.swarmmode \
--docker.domain=vessels.tech \
--docker.watch \
--logLevel=DEBUG \
--web


docker stack deploy --compose-file docker-compose.swarm.yml mywell-development



##Installing cloudstor

docker plugin install docker4x/cloudstor:aws-v17.03.2-ce-rc1-aws2


doesnt work:
volumes:
  - type: volume
    source: db-data
    target: /db-data
    driver: docker4x/cloudstor:aws-v17.03.2-ce-rc1-aws2


try making manually, then adding external

type=volume,volume-driver=cloudstor:aws,source=sharedvol1,destination=/shareddata

##also doesn't work:
docker volume create --driver docker4x/cloudstor:aws-v17.03.2-ce-rc1-aws2 --name test-db

##We can make a service maybe...
docker service create --replicas 5 --name ping1 \
  --mount type=volume,volume-driver=cloudstor:aws,source=testvol1,destination=/shareddata \
  alpine ping docker.com
