FROM nginxinc/nginx-unprivileged:1.20
COPY nginx.conf /etc/nginx/nginx.conf
COPY security.conf /etc/nginx/security.conf
COPY default.nginx /etc/nginx/conf.d/default.conf
USER 1000