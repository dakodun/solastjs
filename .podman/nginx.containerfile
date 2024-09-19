FROM docker.io/library/nginx:1.27-alpine

# set project root as default via symlink
RUN rm -r /usr/share/nginx/html \
    && ln -s /workspace/solastjs /usr/share/nginx/html
