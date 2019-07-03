FROM  bitnami/oauth2-proxy:latest as base
WORKDIR /opt/bitnami/oauth2-proxy
ENTRYPOINT echo "redirect_url = '$OAUTH2_REDIRECT_URL'" >> /etc/oauth2_proxy.cfg && \
    oauth2_proxy -config=/etc/oauth2_proxy.cfg
USER 1001

# Generating cookie secret
FROM bitnami/python as cs
RUN set -e; \
    echo "\ncookie_secret = "\"""$(python -c 'import os,base64; print(base64.urlsafe_b64encode(os.urandom(16)))')""\"  > /tmp/cs.txt;

# Generating local-dev image
FROM base as local
COPY --chown=1001:1001 ./oauth2_proxy.local.cfg /etc/oauth2_proxy.cfg
COPY --from=cs /tmp/cs.txt /tmp/cs.txt
RUN cat /tmp/cs.txt >> /etc/oauth2_proxy.cfg
#USER 1001

# Generating release image
FROM base as release
COPY --chown=1001:1001 ./oauth2_proxy.cfg /etc/oauth2_proxy.cfg
COPY --from=cs /tmp/cs.txt /tmp/cs.txt
RUN cat /tmp/cs.txt >> /etc/oauth2_proxy.cfg
#USER 1001
