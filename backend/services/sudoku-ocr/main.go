package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
)

type requestContent struct {
	Image string `json:"image,omitempty"`
}

type response struct {
	Cells []cell `json:"cells,omitempty"`
}

func decodeBody(sugar *zap.SugaredLogger, requestID, encodedBody string) ([]byte, error) {
	body, err := base64.StdEncoding.DecodeString(encodedBody)
	if err != nil {
		sugar.Infow("failed to decode body to data by base64",
			"requestId", requestID,
			"errMsg", err,
		)
		return nil, err
	}
	return body, nil
}

func readImageData(sugar *zap.SugaredLogger, requestID string, body []byte) ([]byte, error) {
	content := new(requestContent)
	if err := json.Unmarshal(body, content); err != nil {
		sugar.Infow("failed to decode body to json data",
			"requestId", requestID,
			"errMsg", err,
		)
		return nil, err
	}

	data, err := base64.StdEncoding.DecodeString(content.Image)
	if err := json.Unmarshal(body, content); err != nil {
		sugar.Infow("failed to decode image by base64",
			"requestId", requestID,
			"errMsg", err,
		)
		return nil, err
	}
	return data, err
}

func detectImageType(sugar *zap.SugaredLogger, requestID string, image []byte) (string, error) {
	imgType := http.DetectContentType(image)
	switch imgType {
	case "image/png":
	case "image/jpeg":
	default:
		err := errors.New(fmt.Sprintf("invalid image type: %s", imgType))
		sugar.Infow("invalid image type",
			"requestId", requestID,
			"errMsg", err,
		)
		return "", err
	}
	return imgType, nil
}

func decodeToImage(sugar *zap.SugaredLogger, requestID string, data []byte) (gocv.Mat, error) {
	img, err := gocv.IMDecode(data, gocv.IMReadGrayScale)
	if err != nil {
		sugar.Infow("failed to decode body to image",
			"requestId", requestID,
			"errMsg", err,
		)
		return gocv.Mat{}, err
	}
	return img, nil
}

func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	logger, err := zap.NewProduction()
	if err != nil {
		fmt.Printf("failed to initialize zap logger: %v\n", err)
		return events.APIGatewayProxyResponse{StatusCode: 500}, err
	}
	defer logger.Sync()
	sugar := logger.Sugar()

	sugar.Infow("get request",
		"requestId", request.RequestContext.RequestID,
		"contentSize", len(request.Body),
	)

	body := []byte(request.Body)
	if request.IsBase64Encoded {
		body, err = decodeBody(sugar, request.RequestContext.RequestID, request.Body)
		if err != nil {
			b, _ := json.Marshal(map[string]string{"msg": "invalid body"})
			return events.APIGatewayProxyResponse{Body: string(b), StatusCode: 400}, nil
		}
	}

	data, err := readImageData(sugar, request.RequestContext.RequestID, body)
	if err != nil {
		b, _ := json.Marshal(map[string]string{"msg": "invalid body"})
		return events.APIGatewayProxyResponse{Body: string(b), StatusCode: 400}, nil
	}

	imgType, err := detectImageType(sugar, request.RequestContext.RequestID, data)
	if err != nil {
		b, _ := json.Marshal(map[string]string{"msg": "invalid body"})
		return events.APIGatewayProxyResponse{Body: string(b), StatusCode: 400}, nil
	}

	img, err := decodeToImage(sugar, request.RequestContext.RequestID, data)
	if err != nil {
		b, _ := json.Marshal(map[string]string{"msg": "invalid body"})
		return events.APIGatewayProxyResponse{Body: string(b), StatusCode: 400}, nil
	}
	defer img.Close()

	result := gocv.NewMat()
	defer result.Close()
	if err = processing(img, &result); err != nil {
		sugar.Warnw("failed to process image",
			"requestId", request.RequestContext.RequestID,
			"errMsg", err,
		)
		b, _ := json.Marshal(map[string]string{"msg": "internal server error"})
		return events.APIGatewayProxyResponse{Body: string(b), StatusCode: 500}, nil
	}

	cells, err := toSudoku(result, strings.TrimPrefix(imgType, "image/"))
	if err != nil {
		sugar.Warnw("failed to recognize sudoku",
			"requestId", request.RequestContext.RequestID,
			"errMsg", err,
		)
		b, _ := json.Marshal(map[string]string{"msg": "internal server error"})
		return events.APIGatewayProxyResponse{Body: string(b), StatusCode: 500}, nil
	}

	res := response{
		Cells: cells,
	}
	b, err := json.Marshal(res)
	if err != nil {
		sugar.Warnw("failed to encode data to JSON",
			"requestId", request.RequestContext.RequestID,
			"errMsg", err,
		)
		b, _ := json.Marshal(map[string]string{"msg": "internal server error"})
		return events.APIGatewayProxyResponse{Body: string(b), StatusCode: 500}, nil
	}

	sugar.Infow("return response",
		"requestId", request.RequestContext.RequestID,
		"body", string(b),
	)

	return events.APIGatewayProxyResponse{Body: string(b), StatusCode: 200}, nil
}

func main() {
	lambda.Start(handleRequest)
}
