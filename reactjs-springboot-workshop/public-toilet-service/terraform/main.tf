# Define the provider for AWS
provider "aws" {
  region = local.region # Change this to your desired AWS region
}

data "aws_availability_zones" "available" {}


locals {
  name   = "pt"
  prefix = "pt"
  region = "us-east-1"
  aws_region  = "us-east-1"

  vpc_cidr = "10.0.0.0/16"
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)
  tags = {
    Example    = local.name
  }
  common_tags = {
    Project         = local.prefix
    ManagedBy       = "Terraform"
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = local.name
  cidr = "10.0.0.0/16"
  azs             = local.azs
  #private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
  #public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 4)]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  tags = local.tags
  enable_nat_gateway      = true
  single_nat_gateway      = false
  one_nat_gateway_per_az  = true
  enable_vpn_gateway      = false
  enable_dns_hostnames    = true
  enable_dns_support      = true
}

resource "aws_service_discovery_private_dns_namespace" "app" {
  name        = "${local.name}.hands-on.cloud.local"
  description = "${local.prefix}.hands-on.cloud.local zone"
  vpc         = module.vpc.vpc_id
}
