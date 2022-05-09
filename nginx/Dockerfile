FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

# configs
COPY config/general.conf /etc/nginx/config/general.conf
COPY config/security.conf /etc/nginx/config/security.conf
COPY config/proxy.conf /etc/nginx/config/proxy.conf
COPY config/websocket.conf /etc/nginx/config/websocket.conf

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy sites-available into sites-enabled
COPY sites-available/default.conf /etc/nginx/sites-enabled/default.conf

# Create pidfile, set permissions
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx