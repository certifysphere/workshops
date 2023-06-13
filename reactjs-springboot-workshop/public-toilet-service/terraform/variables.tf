variable "name" {
  description = "the name of your stack or application."
  default     = "public-toilet"
}

variable "ecr_repo_name" {
  description = "the ECR Repository Name"
  default     = "public-toilet-service"
}

variable "region" {
  description = "the AWS region in which resources are created."
  default     = "us-east-1"
}

variable "cidr" {
  description = "The CIDR block for the VPC."
  default     = "10.0.0.0/16"
}

variable "private_subnets" {
  description = "a list of CIDRs for private subnets in your VPC, must be set if the cidr variable is defined, needs to have as many elements as there are availability zones"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnets" {
  description = "a list of CIDRs for public subnets in your VPC, must be set if the cidr variable is defined, needs to have as many elements as there are availability zones"
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "health_check_path" {
  description = "Health Check path for load balancer"
  default     = "/actuator/health"
}

variable "container_port" {
  description = "The port where the Docker is exposed"
  default     = 8080
}

variable "service_desired_count" {
  description = "Desired Number of tasks running in parallel"
  default     = 2
}
