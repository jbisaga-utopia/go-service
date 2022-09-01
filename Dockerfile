FROM golang:1.18-bullseye as build-env

# Set environment variable
ENV APP_NAME go-service
ENV CMD_PATH main.go

# Copy application data into image
COPY . $GOPATH/src/$APP_NAME
WORKDIR $GOPATH/src/$APP_NAME

RUN CGO_ENABLED=0 go build -v -o /$APP_NAME $GOPATH/src/$APP_NAME/$CMD_PATH

# run stage
FROM alpine:3.14
# Set environment variable
ENV APP_NAME go-service

# Copy only required data into this image
COPY --from=build-env /$APP_NAME .
COPY ./conf  ./conf
# Expose application port
EXPOSE 8081

# Start app
CMD ./$APP_NAME