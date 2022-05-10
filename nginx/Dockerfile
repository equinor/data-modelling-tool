FROM nginx:latest

# Copy configs
COPY nginx.conf /etc/nginx/nginx.conf

COPY config/general.conf /etc/nginx/config/general.conf
COPY config/security.conf /etc/nginx/config/security.conf
COPY config/proxy.conf /etc/nginx/config/proxy.conf
COPY config/websocket.conf /etc/nginx/config/websocket.conf

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy sites-available into sites-enabled
COPY sites-available/default.conf /etc/nginx/sites-enabled/default.conf

# Create log directory if not present, set permissions
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

# Create tmp directory if not present, set permissions
RUN mkdir -p /tmp/nginx && \
    chown -R nginx:nginx /tmp/nginx

# Create pidfile, set permissions
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Run master process as user nginx
USER nginx