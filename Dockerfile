FROM nginx:alpine
COPY docs/index.html /usr/share/nginx/html/

EXPOSE 3000

CMD ["node", "server.js"]
