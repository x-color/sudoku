resource "aws_ecr_repository" "repo" {
  for_each             = toset(var.repositories)
  name                 = each.key
  image_tag_mutability = "MUTABLE"
  encryption_configuration {
    encryption_type = "AES256"
  }

  image_scanning_configuration {
    scan_on_push = true
  }
}
