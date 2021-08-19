provider "aws" {
  profile = "default"
  region  = "ap-northeast-1"
  default_tags {
    tags = {
      env     = var.env
      service = var.service
    }
  }
}

data "aws_region" "current" {}
data "aws_caller_identity" "self" {}

module "apiserver" {
  source = "../../modules/apiserver"

  env                   = var.env
  service               = var.service
  throttling_rate_limit = 3
  image_uri             = "${data.aws_caller_identity.self.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${var.image_name_and_tag}"
  allow_origins         = ["https://x-color.github.io"]
}
