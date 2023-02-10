# use node on debian to be able to get codeformer and its requirements
FROM node:16.18.0-bullseye-slim

RUN mkdir -p /home/code-former-ui
WORKDIR /home/code-former-ui

# install python and system libs for running code former
RUN apt-get update && apt-get -y install git wget xz-utils
RUN wget https://www.python.org/ftp/python/3.8.16/Python-3.8.16.tar.xz
RUN tar -xf Python-3.8.16.tar.xz
RUN apt-get install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev \
    libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev pkg-config ffmpeg libsm6 libxext6 lzma \
    liblzma-dev libbz2-dev make -y
RUN cd Python-3.8.16 && ./configure && make -j 4
RUN ldconfig /home/code-former-ui/Python-3.8.16
RUN cd Python-3.8.16 && make altinstall
RUN cp /usr/local/bin/python3.8 /usr/local/bin/python
RUN cp /usr/local/bin/pip3.8 /usr/local/bin/pip3

# get code former and setup
RUN git clone https://github.com/sczhou/CodeFormer
RUN cd CodeFormer && pip3 install -r requirements.txt
RUN cd CodeFormer && python basicsr/setup.py develop
 
# pull models
RUN cd CodeFormer/ && python scripts/download_pretrained_models.py facelib
RUN cd CodeFormer/ && python scripts/download_pretrained_models.py CodeFormer

# build the client
RUN mkdir -p /home/react && mkdir -p /home/react/client
WORKDIR /home/react/client

COPY client/package.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# install and run the server
WORKDIR /home/code-former-ui
COPY server/package.json ./
RUN npm install --omit=dev

ENV NODE_ENV=production
ENV PORT=5000

COPY server/ ./
RUN mkdir static && cp -r /home/react/client/dist/* static && rm -rf /home/react/client/client

ENV TZ=America/Barbados
EXPOSE 5000
CMD ["node", "app"]