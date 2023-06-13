#!/bin/bash

# Variables
app_name="public-toilet-service"
aws_region="us-east-1"

# Build Maven project
mvn clean install

# Build Docker image
docker build -t $app_name .

# Get AWS account number
aws_account_number=$(aws sts get-caller-identity --query "Account" --output text)

# Construct ECR repository URL and Docker image tag
ecr_repository_url="${aws_account_number}.dkr.ecr.$aws_region.amazonaws.com/$app_name"
docker_image_tag="v1"

# Log in to AWS ECR
login_status=1
while [[ $login_status -ne 0 ]]; do
    aws ecr get-login-password --region $aws_region | docker login --username AWS --password-stdin ${aws_account_number}.dkr.ecr.$aws_region.amazonaws.com
    #checks the exit status ($?) of the command. 
    login_status=$?
    sleep 1
done

# Check if ECR repository exists, and create it if it doesn't
if ! aws ecr describe-repositories --region $aws_region --repository-names $app_name >/dev/null 2>&1; then
    aws ecr create-repository --region $aws_region --repository-name $app_name
fi

# Tag Docker image
docker tag $app_name:latest $ecr_repository_url:$docker_image_tag

# Push Docker image to ECR repository
docker push $ecr_repository_url:$docker_image_tag

echo "Docker image pushed to ECR repository: $ecr_repository_url:$docker_image_tag"
