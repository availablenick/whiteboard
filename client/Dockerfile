FROM node:12.22.12

ARG USER_ID=1000
ARG GROUP_ID=1000

WORKDIR /newdir

RUN userdel node && \
	groupadd -g ${GROUP_ID} newgroup && \
	useradd -g ${GROUP_ID} -u ${USER_ID} -m newuser && \
	chown ${USER_ID}:${GROUP_ID} /newdir

USER newuser

COPY --chown=newuser:newgroup package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
