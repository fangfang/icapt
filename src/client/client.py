# -*- coding: utf-8 -*-

u"""
下载一个任务列表并执行

# add task
curl http://wiki.ued.taobao.net:8888/add?url=http%3A%2F%2Fwww.taobao.com%2F

# get task
curl http://wiki.ued.taobao.net:8888/get/ie6

# upload files
curl -F "filename=@test.jpg" http://wiki.ued.taobao.net:8888/upload/ie6/12345
curl -F "filename=@test.jpg" http://wiki.ued.taobao.net:8888/upload/ie7/12345
curl -F "filename=@test.jpg" http://wiki.ued.taobao.net:8888/upload/ie8/12345


上传文件部分使用到了第三方模块 poster：
http://atlee.ca/software/poster/
"""

import time
import os
import ConfigParser
import simplejson
import traceback
import urllib
import urllib2
import re
import cookielib

from poster.encode import multipart_encode
from poster.streaminghttp import register_openers

g_urls = {
	"gettask": "http://wiki.ued.taobao.net:8888/get/%(agent)s",
	"addtask": "http://wiki.ued.taobao.net:8888/add?url=%(url)s",
	"uploadfile": "http://wiki.ued.taobao.net:8888/upload/%(agent)s/%(task_id)s",
#	"uploadfile": "http://wiki.ued.taobao.net:8888/upload/ie6/12345",
#	"uploadfile": "http://127.0.0.1:5000",
	}


def getConfig():
	u"""读取配置信息"""

	conf = ConfigParser.ConfigParser()
	conf.read("conf.ini")

	agent = conf.get("setting", "agent")
	capt_cmd = conf.get("setting", "capt_cmd")
	capt_cmd = re.sub(r"\${(\w+?)}", "%(\g<1>)s", capt_cmd)

	return {
		"agent": agent,
		"capt_cmd": capt_cmd,
		}


def uploadTask(configures, fn, task_id):
	u"""上传任务"""

	print("uploading...")
	register_openers()

	params = {
		"agent": configures["agent"],
		"task_id": task_id,
		}
	url = g_urls["uploadfile"] % params
	print(url)
	datagen, headers = multipart_encode({
		"file": open(fn, "rb"),
		"name": "capture.%s" % fn.split(".")[-1],
		})

	request = urllib2.Request(url, datagen, headers)

	print(urllib2.urlopen(request).read())


def handleOneTask(configures, task_url, task_id, out="out.png"):
	u"""处理一个任务"""

	print("> %s\t%s" % (task_id, task_url))

	capt_conf = {
		"url": task_url,
		"out": out,
		}
	capt_conf.update(configures)

	c = os.system(configures["capt_cmd"] % capt_conf)
	print(c)

	if os.path.isfile(out):
		# 截图成功，处理当前截图
		uploadTask(configures, out, task_id)
	else:
		# 截图失败，在当前目录下未找到截图

		print("Capture Error!")


def getAndDo(configures):
	u"""取得并处理任务"""

	u = urllib.urlopen(g_urls["gettask"] % configures)
	try:
		c = u.read()
		tasks = simplejson.loads(c.strip())
	except Exception:
		print("-" * 50)
		print(traceback.format_exc())
		print("-" * 50)
		return

	print("%d tasks!" % len(tasks))

	for task_url, task_id in tasks:
		handleOneTask(configures, task_url, task_id)


def main():
	configures = getConfig()
#	print(configures)

	while True:
		getAndDo(configures)
		time.sleep(10) # 每次任务之后暂停 10 秒

	# upload test
#	uploadTask(configures, "out.png", "12345")


if __name__ == "__main__":
	main()
