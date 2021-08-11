output "repositories_url" {
  value = {
    for k, v in module.repository.repositories_url : k => v
  }
}

output "apigateway_endpoint_url" {
  value = module.apiserver.apigateway_endpoint_url
}
