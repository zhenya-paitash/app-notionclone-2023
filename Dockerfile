# FROM oven/bun:1.0.7 as base
# WORKDIR /usr/src/app
#
# # install DEV build
# FROM base AS install
# RUN mkdir -p /temp/dev
# COPY package.json bun.lockb /temp/dev/
# RUN cd /temp/dev && bun install --frozen-lockfile
#
# # install PROD build
# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile --production
#
#
# # copy node_modules from temp directory
# # then copy all (non-ignored) project files into the image
# FROM install AS prerelease
# COPY --from=install /temp/prod/node_modules node_modules
# COPY . .
#
# # environment
# ENV NODE_ENV=production
#
# # build
# RUN bun run build
# RUN bun run db:deploy
#
# # copy PROD dependencies and source code into final image
# FROM base AS release
# COPY --from=install /temp/prod/node_modules node_modules
# COPY --from=prerelease /usr/src/app/package.json .
#
# # run the app
# USER bun
# EXPOSE 3000/tcp
# ENTRYPOINT [ "bun", "run", "start" ]


# WARN: EDGESTORE cannot work with this Docker configuration
# if you need images, use manual installation on your system
# or try to fix it and give me feedback. I will appreciate your help
FROM oven/bun:1.0.7 as base
WORKDIR /usr/src/app/
COPY . .
ENV NODE_ENV=production
RUN bun install && bun run build && bun run db:deploy
CMD ["bun", "run", "start"]

