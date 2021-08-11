data "aws_region" "current" {}

data "aws_iam_policy_document" "lambda_execution_role_assume_role_policy" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  assume_role_policy = data.aws_iam_policy_document.lambda_execution_role_assume_role_policy.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  ]
}

resource "aws_lambda_function" "ocr_function" {
  function_name = "${var.service}-${var.env}-ocr-function"
  role          = aws_iam_role.lambda_execution_role.arn
  package_type  = "Image"
  image_uri     = var.image_uri
  memory_size   = 1024
  timeout       = 25
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ocr_function.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "ocr_function" {
  name = "/aws/lambda/${aws_lambda_function.ocr_function.function_name}"

  retention_in_days = 1
}

data "template_file" "openapi" {
  template = file("${path.module}/openapi.yaml")

  vars = {
    Region    = data.aws_region.current.name
    LambdaArn = aws_lambda_function.ocr_function.arn
  }
}

resource "aws_apigatewayv2_api" "this" {
  name          = "${var.service}-${var.env}-api"
  protocol_type = "HTTP"
  body          = data.template_file.openapi.rendered

  cors_configuration {
    allow_headers = ["content-type"]
    allow_methods = ["POST"]
    allow_origins = ["*"]
  }
}

resource "aws_apigatewayv2_deployment" "this" {
  api_id = aws_apigatewayv2_api.this.id

  triggers = {
    redeployment = sha1(jsonencode(data.template_file.openapi))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_apigatewayv2_stage" "this" {
  api_id        = aws_apigatewayv2_api.this.id
  name          = var.env
  deployment_id = aws_apigatewayv2_deployment.this.id

  default_route_settings {
    throttling_rate_limit  = var.throttling_rate_limit
    throttling_burst_limit = var.throttling_rate_limit
  }
}
