FROM node:10.15.3-alpine

# Create node folders
RUN mkdir -p /var/www/node_modules && \
    mkdir -p /home/node/.npm-global && \
    mkdir -p /home/node/.npm-global/lib && \
    chown -R node:node /var/www && \
    chown -R node:node /home/node

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Set working directory
WORKDIR /var/www

# Set yarn version
ENV YARN_VERSION 1.5.1

# Install dependencies
RUN apk add --no-cache --virtual .build-deps-yarn curl \
    && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz \
    && apk del .build-deps-yarn

# Copy directory
COPY . /var/www

# Copy existing application directory permissions
COPY --chown=node:node . /var/www

# Change current user to node
USER node

# Install npm dependencies
RUN npm i && \
    npm i -g nodemon

# Expose port 9000
EXPOSE 9000

# Start and watch nodemon file
CMD nodemon index.js
