#Run me from project root please! Not inside docker!

cp ~/.aws/keys/mywell-docker.pem mywell-docker.pem
tar cvf secrets.tar mywell-docker.pem ./env/.env
travis encrypt-file secrets.tar --add
rm -f mywell-docker.pem
