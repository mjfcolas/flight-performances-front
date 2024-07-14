FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY dist/performance-computer/browser .
COPY nginx.conf /etc/nginx/conf.d/default.conf
