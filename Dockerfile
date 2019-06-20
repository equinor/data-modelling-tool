FROM nginx:latest
CMD ["nginx", "-g", "daemon off;"]

# docker build -t data-modelling-tool .
# docker run -p 80:80 data-modelling-tool