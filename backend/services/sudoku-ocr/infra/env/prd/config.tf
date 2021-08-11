terraform {
  backend "s3" {
    bucket = "terraform.bucket.ap-northeast-1.1628699163"
    key    = "sudoku/sudoku-ocr/prd"
    region = "ap-northeast-1"
  }
}
