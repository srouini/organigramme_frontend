# Production stage
FROM nginx:alpine

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy built assets
COPY dist/ /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
