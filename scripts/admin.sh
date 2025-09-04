docker run --rm \  
  --platform linux/amd64 \
  --network host \
  --name domus-service \
  registry.cn-hangzhou.aliyuncs.com/tongts/meida-admin-web:v1


docker buildx build \
  --platform linux/amd64 \
  -t registry.cn-hangzhou.aliyuncs.com/tongts/meida-admin-web:v1 \
  --load . -f Dockerfile