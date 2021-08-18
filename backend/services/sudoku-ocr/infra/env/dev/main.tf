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

module "apiserver" {
  source = "../../modules/apiserver"

  env                   = var.env
  service               = var.service
  throttling_rate_limit = 1
  image_uri             = "${module.repository.repositories_url["sudoku-ocr"]}:${var.image_tag}"
  allow_origins         = ["http://loalhost:3000"]
}

module "repository" {
  source = "../../modules/repository"

  repositories = ["sudoku-ocr"]
}
