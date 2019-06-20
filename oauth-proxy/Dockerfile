#
# Dockerfile for defining the oauth proxy
#
FROM  bitnami/oauth2-proxy:latest as base
#ENV OAUTH2_PROXY_CLIENT_ID
#ENV OAUTH2_PROXY_CLIENT_SECRET


# Generating cookie secret
FROM bitnami/python as cs
COPY ./oauth2_proxy.cfg /etc/oauth2_proxy.cfg.base
RUN set -e; \
    echo "\ncookie_secret = "\"""$(python -c 'import os,base64; print(base64.urlsafe_b64encode(os.urandom(16)))')""\"  > cs.txt; \
    cat /etc/oauth2_proxy.cfg.base cs.txt >> /etc/oauth2_proxy.cfg;

# Generating release image
FROM base as release
COPY --from=cs /etc/oauth2_proxy.cfg /etc/oauth2_proxy.cfg
WORKDIR /opt/bitnami/oauth2-proxy
USER 1001
ENTRYPOINT [ "oauth2_proxy" ]
CMD ["-config=/etc/oauth2_proxy.cfg"]
