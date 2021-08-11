terraform {
  backend "s3" {
    bucket = "terraform.bucket.ap-northeast-1.1628699163"
    key    = "sudoku/sudoku-ocr/dev"
    region = "ap-northeast-1"
  }
}
