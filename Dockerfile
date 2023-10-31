FROM oven/bun:latest AS bun
WORKDIR /app/
COPY . .

# # FROM oven/bun:latest as base
# WORKDIR /usr/src/app
#
# # install DEV build
# FROM base AS install
# # RUN mkdir -p /temp/dev
# # COPY package.json bun.lockb /temp/dev/
# # RUN cd /temp/dev && bun install --frozen-lockfile
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

# -- environment
ENV NODE_ENV=production
# CONVEX https://www.convex.dev/
# ENV CONVEX_DEPLOYMENT=""
# ENV NEXT_PUBLIC_CONVEX_URL=""
# # CLERK https://clerk.com/
# ENV CLERK_SECRET_KEY=""
# ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
# # EDGESTORE https://edgestore.dev/
# ENV EDGE_STORE_ACCESS_KEY=""
# ENV EDGE_STORE_SECRET_KEY=""

# # build
# RUN bun run build
# # RUN bun x convex deploy
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

RUN bun install --frozen-lockfile --production
RUN bun x next build
CMD ["bun", "x", "next", "start"]
