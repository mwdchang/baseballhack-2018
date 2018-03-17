#!/usr/bin/env bash

PLAYER_ID=$1
IDX=${PLAYER_ID:0:1} 
URL="https://www.baseball-reference.com/players/${IDX}/${PLAYER_ID}.shtml"

IMG=`curl ${URL} | grep "og:image" | egrep -o "http.*cloud.*((jpg)|(png))"`
echo "${PLAYER_ID},${IMG}"

# curl ${URL} | grep "og:image" | egrep -o "http.*((jpg)|(png))" | xargs curl -o ${PLAYER_ID}
# sips -s format jpeg ${PLAYER_ID} --out ${PLAYER_ID}.jpg
