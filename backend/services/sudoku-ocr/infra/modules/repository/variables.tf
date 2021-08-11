variable "repositories" {
  type        = list(string)
  description = ""
  validation {
    condition     = length(var.repositories) > 0
    error_message = "Must set some repository."
  }
}
