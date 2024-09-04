FROM docker.io/library/nginx:latest
RUN rm -r /usr/share/nginx/html \
    && ln -s /workspace/solastjs /usr/share/nginx/html
