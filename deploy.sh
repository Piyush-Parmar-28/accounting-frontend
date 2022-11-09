#!/bin/bash
GIT_SSH_COMMAND='ssh -i /home/karan/.ssh/id_ed25519-2 -o IdentitiesOnly=yes' git pull &&
npm install &&
npm run build &&
rm -rf production &&
rm -f build/static/js/*.js.map &&
mv build production