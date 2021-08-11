variable "service" {
  type        = string
  description = ""
  default     = "sudoku"
}

variable "env" {
  type        = string
  description = ""
  default     = "dev"

  validation {
    condition     = can(regex("^(dev|prd)$", var.env))
    error_message = "Must be dev or prd."
  }
}

variable "image_tag" {
  type        = string
  description = ""
}
