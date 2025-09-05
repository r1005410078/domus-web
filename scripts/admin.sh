docker run --rm -d \
  --platform linux/amd64 \
  -e DOMUS_API_URL=http://192.168.2.10:8091 \
  -e USER_SYSTEM_API_URL=http://192.168.2.10:9999 \
  -p 3000:3000 \
  --name meida-admin-web \
  registry.cn-hangzhou.aliyuncs.com/tongts/meida-admin-web:v1


docker buildx build \      
  --platform linux/amd64 \
  -t registry.cn-hangzhou.aliyuncs.com/tongts/meida-admin-web:v1 \
  --load . -f Dockerfile