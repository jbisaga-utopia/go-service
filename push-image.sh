docker build --platform linux/amd64 --rm -t go-service .
docker tag go-service us-central1-docker.pkg.dev/elaborate-leaf-361121/go-service-image/test-image
docker push us-central1-docker.pkg.dev/elaborate-leaf-361121/go-service-image/test-image
