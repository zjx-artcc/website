#!/bin/sh
set -e
npx prisma migrate deploy
npx prisma generate
exec node server.js