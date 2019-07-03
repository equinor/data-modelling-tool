#
# Dockerfile for defining the oauth proxy
#
FROM  bitnami/oauth2-proxy:latest as base
# Set in .env
#ENV OAUTH2_PROXY_CLIENT_ID
#ENV OAUTH2_PROXY_CLIENT_SECRET
WORKDIR /opt/bitnami/oauth2-proxy
ENTRYPOINT [ "oauth2_proxy" ]
USER 0
CMD ["-config=/etc/oauth2_proxy.cfg"]


# Generating cookie secret
FROM bitnami/python as cs
RUN set -e; \
    echo "\ncookie_secret = "\"""$(python -c 'import os,base64; print(base64.urlsafe_b64encode(os.urandom(16)))')""\"  > /tmp/cs.txt;

# Generating local-dev image
FROM base as local
COPY ./oauth2_proxy.local.cfg /etc/oauth2_proxy.cfg
COPY --from=cs /tmp/cs.txt /tmp/cs.txt
RUN cat /tmp/cs.txt >> /etc/oauth2_proxy.cfg
RUN ls -lah /etc/
RUN id
USER 1001

# Generating release image
FROM base as release
COPY ./oauth2_proxy.cfg /etc/oauth2_proxy.cfg
COPY --from=cs /tmp/cs.txt /tmp/cs.txt
RUN cat /tmp/cs.txt >> /etc/oauth2_proxy.cfg
USER 1001
