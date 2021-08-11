variable "service" {
  type        = string
  description = ""
}

variable "env" {
  type        = string
  description = ""

  validation {
    condition     = can(regex("^(dev|prd)$", var.env))
    error_message = "Must be dev or prd."
  }
}

variable "throttling_rate_limit" {
  type        = number
  description = ""
  default     = 5
}

variable "image_uri" {
  type        = string
  description = ""
}
