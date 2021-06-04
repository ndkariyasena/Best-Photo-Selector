FROM      node:14.16.1

WORKDIR   /usr/src/app

COPY      package*.json ./

RUN       npm install

RUN       npm install react-scripts@4.0.3 -g

COPY      . .

EXPOSE    3000

CMD       ["npm", "start"]