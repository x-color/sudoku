# Minify Container Image by DockerSlim

Install Runtime Interface Emulator to local computer

```sh
$ mkdir -p ~/.aws-lambda-rie && curl -Lo ~/.aws-lambda-rie/aws-lambda-rie \
https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie \
&& chmod +x ~/.aws-lambda-rie/aws-lambda-rie
```

Test Container Image

```sh
$ docker run -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 \
  --entrypoint /aws-lambda/aws-lambda-rie sudoku-ocr:<TAG> /app
$ cat request.json | curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d @-
```

Minify Container Image

```sh
$ docker-slim build \
	--mount ~/.aws-lambda-rie:/aws-lambda \
	--entrypoint /aws-lambda/aws-lambda-rie \
	--cmd /app \
	--publish-port 9000:8080 \
	--expose 8080 \
	--http-probe-cmd-file http-probe-cmd.json \
	--target sudoku-ocr:<TAG>
```
