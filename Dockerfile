FROM node:16

# diretório alvo
RUN mkdir -p /usr/src/potty
WORKDIR /usr/src/potty

# copiar o projeto e instalar os pacotes com o yarn
COPY . /usr/src/potty/
RUN yarn install

# abrindo a porta 3001
EXPOSE 3001

RUN chmod +x ./scripts/init.sh
RUN chmod +x ./scripts/wait-for-it.sh

ENTRYPOINT ["./scripts/init.sh"]