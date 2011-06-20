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

"""

import time
import datetime
import os
import ConfigParser
import simplejson
import traceback
import urllib
import urllib2
import cookielib
from libs import MultipartPostHandler


g_urls = {
	"gettask": "http://wiki.ued.taobao.net:8888/get/%(agent)s",
	"addtask": "http://wiki.ued.taobao.net:8888/add?url=%(url)s",
	"uploadfile": "http://wiki.ued.taobao.net:8888/upload/%s(agent)s/%(task_id)s",
}


def getConfig():
	u"""读取配置信息"""

	conf = ConfigParser.ConfigParser()
	conf.read("conf.ini")

	agent = conf.get("setting", "agent")
	capt_cmd = conf.get("setting", "capt_cmd")

	return {
		"agent": agent,
		"capt_cmd": capt_cmd,
	}


def uploadTask(configures, fn, task_id):
	u"""上传任务"""

	cookies = cookielib.CookieJar()
	opener = urllib2.build_opener(
		urllib2.HTTPCookieProcessor(cookies),
		MultipartPostHandler.MultipartPostHandler,
	)
	params = {
		"agent": configures["agent"],
		"task_id": task_id,
		"file": open(fn, "rb"),
	}
	opener.open(g_urls["uploadfile"] % params, params)


def handleOneTask(configures, task_url, task_id, out="out.png"):
	u"""处理一个任务"""

	print("> %s\t%s" % (task_id, task_url))

	capt_conf = {
		"out": out,
	}
	capt_conf.update(configures)

	c = os.system(configures["capt_cmd"] % capt_conf)
	print(c.read())

	if os.path.isfile(out):
		# 截图成功，处理当前截图
		pass
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


if __name__ == "__main__":
	main()
