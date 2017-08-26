#!/bin/bash

artillery quick --duration 60 --rate 10 -n 1 https://mywell-server.marvi.org.in/api/resources?filter=%7B%22fields%22%3A%7B%22image%22%3Afalse%7D%7D
