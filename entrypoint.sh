#!/bin/sh
set -e
npx prisma@6.9.0 migrate deploy
npx prisma@6.9.0 generate
exec node server.js