FROM  bitnami/oauth2-proxy:3.2.0 as base
WORKDIR /opt/bitnami/oauth2-proxy
USER 1001
ENTRYPOINT sed -i 's@OAUTH2_REDIRECT_URL@'"$OAUTH2_REDIRECT_URL"''@g /tmp/oauth2_proxy.cfg && \
    oauth2_proxy -config=/tmp/oauth2_proxy.cfg

# Generating cookie secret
FROM bitnami/python as cs
RUN set -e; \
    echo "\ncookie_secret = "\"""$(python -c 'import os,base64; print(base64.urlsafe_b64encode(os.urandom(16)))')""\"  > /tmp/cs.txt;

# Generating local-dev image
FROM base as local
COPY --chown=1001:1001 ./oauth2_proxy.local.cfg /tmp/oauth2_proxy.cfg
COPY --from=cs /tmp/cs.txt /tmp/cs.txt
RUN cat /tmp/cs.txt >> /tmp/oauth2_proxy.cfg

# Generating release image
FROM base as release
COPY --chown=1001:1001 ./oauth2_proxy.cfg /tmp/oauth2_proxy.cfg
COPY --from=cs /tmp/cs.txt /tmp/cs.txt
RUN cat /tmp/cs.txt >> /tmp/oauth2_proxy.cfg
