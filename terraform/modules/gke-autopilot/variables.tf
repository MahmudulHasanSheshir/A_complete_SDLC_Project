variable "project_id" {
  description = "GCP project ID"
  type        = string
  default    = "dev-tof-sheshir"
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-southeast1"
}

variable "cluster_name" {
  description = "GKE cluster name"
  type        = string
  default     = "sheshir-dev-cluster-autopilot"
}

variable "network_name" {
  description = "VPC network name"
  type        = string
  default     = "weather-api-vpc"
}

variable "subnetwork_name" {
  description = "Subnetwork name"
  type        = string
  default     = "weather-api-pub-subnet"
}

variable "authorized_networks" {
  description = "Master authorized networks"
  type = list(object({
    cidr_block   = string
    display_name = string
  }))
  default = [
    {
      cidr_block   = "203.223.92.0/23"
      display_name = "Banglalink-Brainstation"
    }
  ]
}
