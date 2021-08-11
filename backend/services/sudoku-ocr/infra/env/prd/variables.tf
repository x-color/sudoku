variable "service" {
  type        = string
  description = ""
  default     = "sudoku"
}

variable "env" {
  type        = string
  description = ""
  default     = "prd"

  validation {
    condition     = can(regex("^(dev|prd)$", var.env))
    error_message = "Must be dev or prd."
  }
}

variable "image_name_and_tag" {
  type        = string
  description = ""
}
