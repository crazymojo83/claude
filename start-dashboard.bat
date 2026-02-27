@echo off
title Zendesk Dashboard
cd /d C:\Users\steve\stevemojica.github.io
echo Starting Zendesk Dashboard...
start "" http://localhost:5173/zendesk
npm run dev
