#Run me from project root please! Not inside docker!

tar cvf secrets.tar ~/.aws/keys/mywell-docker.pem ./env/.env
travis encrypt-file secrets.tar --add
