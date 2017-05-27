# aliyun ons http example

## 开发测试环境
    node v6.10.2

## 安装依赖库
```sh
$ cd aliyun-ons-http-example/
$ npm install
```
### 配制
  修改 `config.js` 参数。
 
  ```
    onsUrl: "publictest-rest.ons.aliyun.com",
    onsPort: 80,
    producerID: "producerID",
    consumerID: "consumerID",
    accessKey: "accessKey",
    secretKey: "secretKey",
    topic: "topic",
    successStatusCode: [200, 201, 202, 203, 204, 205, 206],
    path: "/"

  ```
  
### 运行Producer
```sh
$ node http_producer.js
```

### 运行Consumer
```sh
$ node http_consumer.js
```