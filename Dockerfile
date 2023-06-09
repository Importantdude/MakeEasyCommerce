FROM node:19
LABEL maintainer="Daniels Haitovs (daniel@goedgemerkt.nl)"
RUN mkdir /code
WORKDIR /code

COPY . /code/
RUN npm install --production

CMD ["npm", "start"]