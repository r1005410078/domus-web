# 默认参数
TAG ?= v1
IMAGE_REGISTRY ?= registry.cn-hangzhou.aliyuncs.com/tongts

MEIDA_ADMIN_WEB_IMAGE := $(IMAGE_REGISTRY)/meida-admin-web:$(TAG)
MEIDA_WEBSITE_IMAGE := $(IMAGE_REGISTRY)/meida-website:$(TAG)

.PHONY:	meida-admin-web meida-website all

meida-admin-web:
	docker build -t $(MEIDA_ADMIN_WEB_IMAGE) --load -f Dockerfile .
	docker push $(MEIDA_ADMIN_WEB_IMAGE)

meida-website:
	docker build  --build-arg APP=website -t $(MEIDA_WEBSITE_IMAGE) --load -f Dockerfile .
	docker push $(MEIDA_WEBSITE_IMAGE)

.PHONY: clean
clean:
	docker rmi -f $(MEIDA_ADMIN_WEB_IMAGE)
	docker rmi -f $(MEIDA_WEBSITE_IMAGE)

.PHONY: all
all: meida-admin-web meida-website
