# Define the provider for AWS
provider "aws" {
  region = var.region # Change this to your desired AWS region
}

data "aws_availability_zones" "available" {}
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 3)
  tags = {
    AppName = var.name
  }
}


module "vpc" {
  source                 = "terraform-aws-modules/vpc/aws"
  name                   = var.name
  cidr                   = var.cidr
  azs                    = local.azs
  private_subnets        = var.private_subnets
  public_subnets         = var.public_subnets
  tags                   = local.tags
  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  enable_vpn_gateway     = false
  enable_dns_hostnames   = true
  enable_dns_support     = true
}

