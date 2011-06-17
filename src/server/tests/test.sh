
# add task
curl http://test.taobao.com:8888/add?url=http%3A%2F%2Fwww.taobao.com%2F

# get task
curl http://test.taobao.com:8888/get/ie6

# upload files
curl -F "filename=@test.jpg" http://test.taobao.com:8888/upload/ie6/12345
curl -F "filename=@test.jpg" http://test.taobao.com:8888/upload/ie7/12345
curl -F "filename=@test.jpg" http://test.taobao.com:8888/upload/ie8/12345
