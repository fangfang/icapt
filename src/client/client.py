# -*- coding: utf-8 -*-

u"""
下载一个任务列表并执行，
按 Ctrl+C 退出任务。

@author: oldj <oldj.wu@gmail.com>
@blog: http://oldj.net/

--------------------------------------------------

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

import datetime
import time
import os
import sys
import shutil
import ConfigParser
import simplejson
import traceback
import urllib
import urllib2
import re
import signal

from poster.encode import multipart_encode
from poster.streaminghttp import register_openers

g_urls = {
	"gettask": "%(server)s/get/%(agent)s",
	"addtask": "%(server)s/add?url=%(url)s",
	"uploadfile": "%(server)s/upload/%(agent)s/%(task_id)s",
#	"uploadfile": "http://127.0.0.1:5000",
	}


def log(msg):
	u"""显示消息"""

	now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

	print("> [%s] %s" % (now, msg))


def getConfig():
	u"""读取配置信息"""

	conf = ConfigParser.ConfigParser()
	conf.read("conf.ini")

	agent = conf.get("setting", "agent")
	server = conf.get("setting", "server")
	capt_cmd = conf.get("setting", "capt_cmd")
	capt_cmd = re.sub(r"\${(\w+?)}", "%(\g<1>)s", capt_cmd)

	return {
		"agent": agent,
		"server": server,
		"capt_cmd": capt_cmd,
		}


def uploadTask(configures, fn, task_id):
	u"""上传任务"""

	log("uploading...")
	register_openers()

	params = {
		"task_id": task_id,
		}
	params.update(configures)
	url = g_urls["uploadfile"] % params
	print(url)
	datagen, headers = multipart_encode({
		"file": open(fn, "rb"),
		"name": os.path.split(fn)[-1],
		})

	request = urllib2.Request(url, datagen, headers)

	print(urllib2.urlopen(request).read())
	log("upload done!")


def printErrInfo():
	u"""打印出错信息"""
	print("-" * 50)
	print(traceback.format_exc())
	print("-" * 50)


def handleOneTask(configures, task_url, task_id, out="out.png", timeout=60):
	u"""处理一个任务"""

	log("Task: %s\t%s" % (task_id, task_url))

	capt_conf = {
		"url": task_url,
		"out": out,
		}
	capt_conf.update(configures)

	# 截图
	log("capturing...")
	if os.path.isfile(out):
		os.remove(out)
	cmdstr = configures["capt_cmd"] % capt_conf
	print(cmdstr)
	c = os.popen(cmdstr)
	print(c.read())

	while timeout > 0 and not os.path.isfile(out):
		# 硬盘上没有对应的截图文件
		# 有可能截图操作是异步的，等待一段时间看是否能找到图片
		timeout -= 1
		time.sleep(1)

	if os.path.isfile(out):
		# 截图成功，处理当前截图
		fn = "%s.%s" % (task_id, out.split(".")[-1])
		shutil.move(out, fn)
		try:
			uploadTask(configures, fn, task_id)
			os.remove(fn)
		except Exception:
			printErrInfo()
			return
	else:
		# 截图失败，在当前目录下未找到截图

		log("Capture Error!")


def getAndDo(configures):
	u"""取得并处理任务"""

	u = urllib.urlopen(g_urls["gettask"] % configures)
	try:
		c = u.read()
		tasks = simplejson.loads(c.strip())
	except Exception:
		printErrInfo()
		return

	log("%d tasks!" % len(tasks))

	for task_url, task_id in tasks:
		handleOneTask(configures, task_url, task_id)


def signalCancelHandler(signum, frame):
	u"""处理键盘 Ctrl+C 事件"""

	print(signum, frame)
	log("Canceld by Ctrl+C.")
	sys.exit(1)


def main():
	configures = getConfig()
#	print(configures)

	signal.signal(signal.SIGINT, signalCancelHandler)

	while True:
		getAndDo(configures)
		time.sleep(10) # 每次任务之后暂停 10 秒

	# upload test
#	uploadTask(configures, "out.png", "12345")


if __name__ == "__main__":
	main()
