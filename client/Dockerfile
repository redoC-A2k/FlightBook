# Using the latest node image on Alpine Linux
FROM node:22.0-alpine AS builder

# Set environment variable
ENV NODE_ENV=production

# Setting up the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY ./package.json ./
RUN npm install && npm install -g webpack webpack-cli --save-dev

# Copy application files
COPY public public
COPY src src
COPY README.md ./
COPY tsconfig.json ./
COPY webpack.config.js ./
COPY .babelrc ./

# Declaring ARGs for backend and frontend
ARG REACT_APP_BACKEND
ARG REACT_APP_FRONTEND

# Verify environment variables are passed
RUN echo "Backend URL: ${REACT_APP_BACKEND}" && \
    echo "Frontend URL: ${REACT_APP_FRONTEND}"

# Run the build, ensuring webpack-cli is available
RUN REACT_APP_BACKEND=${REACT_APP_BACKEND} \
    REACT_APP_FRONTEND=${REACT_APP_FRONTEND} \
    # webpack --mode production
    npm run build

# Using nginx for serving the application
FROM nginx:latest

# Copy built assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
