# Create an ECS cluster
data "aws_ecr_repository" "my_ecr_repo" {
  name = "public-toilet-service"
}

resource "aws_ecs_cluster" "main" {
  name = "${local.prefix}-ecs-cluster"
   tags = merge(
    local.common_tags,
    {
      Name = "${local.prefix}-fargate-cluster"
    }
  )
}

locals {
  aws_account_id = data.aws_caller_identity.current.account_id
  service_name = "ptservice"
  task_image = "${data.aws_ecr_repository.my_ecr_repo.repository_url}:v1"
  service_port = 8080
  service_namespace_id = aws_service_discovery_private_dns_namespace.app.id
  container_definition = [{
    cpu         = 512
    image       = local.task_image
    memory      = 1024
    name        = local.service_name
    networkMode = "awsvpc"
    environment = [
      {
        "name": "SERVICE_DISCOVERY_NAMESPACE_ID", "value": local.service_namespace_id
      }
    ]
    portMappings = [
      {
        protocol      = "tcp"
        containerPort = local.service_port
        hostPort      = local.service_port
      }
    ]
    logConfiguration = {
      logdriver = "awslogs"
      options = {
        "awslogs-group"         = local.cw_log_group
        "awslogs-region"        = data.aws_region.current.name
        "awslogs-stream-prefix" = "stdout"
      }
    }
  }]
  cw_log_group = "/ecs/${local.service_name}"
}
# Fargate service
# AWS Fargate Security Group
resource "aws_security_group" "fargate_task" {
  name   = "${local.service_name}-fargate-task"
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = local.service_port
    to_port     = local.service_port
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = merge(
  local.common_tags,
  {
    Name = local.service_name
  }
  )
}
data "aws_iam_policy_document" "fargate-role-policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs.amazonaws.com", "ecs-tasks.amazonaws.com"]
    }
  }
}
resource "aws_iam_policy" "fargate_execution" {
  name   = "fargate_execution_policy"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetAuthorizationToken",
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Resource": "*"
    },
    {
        "Effect": "Allow",
        "Action": [
            "ssm:GetParameters",
            "secretsmanager:GetSecretValue",
            "kms:Decrypt"
        ],
        "Resource": [
            "*"
        ]
    }
  ]
}
EOF
}
resource "aws_iam_policy" "fargate_task" {
  name   = "fargate_task_policy"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Resource": "*"
    },
    {
        "Effect": "Allow",
        "Action": [
            "servicediscovery:ListServices",
            "servicediscovery:ListInstances"
        ],
        "Resource": "*"
    }
  ]
}
EOF
}
resource "aws_iam_role" "fargate_execution" {
  name               = "${local.service_name}-fargate-execution-role"
  assume_role_policy = data.aws_iam_policy_document.fargate-role-policy.json
}
resource "aws_iam_role" "fargate_task" {
  name               = "${local.service_name}-fargate-task-role"
  assume_role_policy = data.aws_iam_policy_document.fargate-role-policy.json
}
resource "aws_iam_role_policy_attachment" "fargate-execution" {
  role       = aws_iam_role.fargate_execution.name
  policy_arn = aws_iam_policy.fargate_execution.arn
}
resource "aws_iam_role_policy_attachment" "fargate-task" {
  role       = aws_iam_role.fargate_task.name
  policy_arn = aws_iam_policy.fargate_task.arn
}
# Fargate Container
resource "aws_cloudwatch_log_group" "app" {
  name = local.cw_log_group
  tags = merge(
    local.common_tags,
    {
      Name = local.service_name
    }
  )
}
resource "aws_ecs_task_definition" "app" {
  family                   = local.service_name
  network_mode             = "awsvpc"
  cpu                      = local.container_definition.0.cpu
  memory                   = local.container_definition.0.memory
  requires_compatibilities = ["FARGATE"]
  container_definitions    = jsonencode(local.container_definition)
  execution_role_arn       = aws_iam_role.fargate_execution.arn
  task_role_arn            = aws_iam_role.fargate_task.arn
  tags = merge(
    local.common_tags,
    {
      Name = local.service_name
    }
  )
}

resource "aws_ecs_service" "app" {
  name            = local.service_name
  cluster         = aws_ecs_cluster.main.name
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = "3"
  launch_type     = "FARGATE"
  # service_registries {
  #   registry_arn = aws_service_discovery_service.app_service.arn
  #   container_name = local.service_name
  #   container_port = local.service_port
  # }
  load_balancer {
    target_group_arn = aws_lb_target_group.my_target_group.arn
    container_name   = local.service_name
    container_port   = 8080
  }
  network_configuration {
    security_groups = [aws_security_group.fargate_task.id]
    subnets         = module.vpc.private_subnets
  }
}
resource "aws_service_discovery_service" "app_service" {
  name = local.service_name
  dns_config {
    namespace_id = local.service_namespace_id
    dns_records {
      ttl  = 10
      type = "A"
    }
    dns_records {
      ttl  = 10
      type = "SRV"
    }
    routing_policy = "MULTIVALUE"
  }
  health_check_custom_config {
    failure_threshold = 1
  }
}





# # Create an IAM role for the ECS task execution
# resource "aws_iam_role" "task_execution_role" {
#   name = "ecs-task-execution-role"

#   assume_role_policy = <<POLICY
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": {
#         "Service": "ecs-tasks.amazonaws.com"
#       },
#       "Action": "sts:AssumeRole"
#     }
#   ]
# }
# POLICY
# }


# resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
#   role       = aws_iam_role.task_execution_role.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
# }

# resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
#   role       = aws_iam_role.task_execution_role.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
# }


# # Create a task definition for your container
# resource "aws_ecs_task_definition" "my_task_definition" {
#   family                = "my-task-family"
#   execution_role_arn    = aws_iam_role.task_execution_role.arn
#   network_mode          = "awsvpc"
#   cpu                   = 256
#   memory                = 512

#   container_definitions = <<DEFINITION
# [
#   {
#     "name": "my-container",
#     "image": "122082915229.dkr.ecr.us-east-1.amazonaws.com/public-toilet-service:v1",
#     "portMappings": [
#       {
#         "containerPort": 8080,
#         "hostPort": 8080,
#         "protocol": "tcp"
#       }
#     ],
#     "logConfiguration": {
#       "logDriver": "awslogs",
#       "options": {
#         "awslogs-group": "/ecs/my-container-logs",
#         "awslogs-region": "us-east-1",
#         "awslogs-stream-prefix": "ecs"
#       }
#     }
#   }
# ]
# DEFINITION
# }

# # Create a security group for the ECS service
# resource "aws_security_group" "ecs_tasks" {
#   name   = "pt-ecs-task-sg"
#   vpc_id = module.vpc.vpc_id
 
#   ingress {
#    protocol         = "tcp"
#    from_port        = 8080
#    to_port          = 8080
#    cidr_blocks      = ["0.0.0.0/0"]
#    ipv6_cidr_blocks = ["::/0"]
#   }
 
#   egress {
#    protocol         = "-1"
#    from_port        = 0
#    to_port          = 0
#    cidr_blocks      = ["0.0.0.0/0"]
#    ipv6_cidr_blocks = ["::/0"]
#   }
# }

resource "aws_security_group" "alb" {
  name   = "pt-alb-sg"
  vpc_id = module.vpc.vpc_id
 
  ingress {
   protocol         = "tcp"
   from_port        = 80
   to_port          = 80
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
 
  ingress {
   protocol         = "tcp"
   from_port        = 443
   to_port          = 443
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
 
  egress {
   protocol         = "-1"
   from_port        = 0
   to_port          = 0
   cidr_blocks      = ["0.0.0.0/0"]
   ipv6_cidr_blocks = ["::/0"]
  }
}

# # Create an ECS service
# resource "aws_ecs_service" "my_service" {
#   name            = "my-ecs-service"
#   cluster         = aws_ecs_cluster.my_cluster.id
#   task_definition = aws_ecs_task_definition.my_task_definition.arn
#   desired_count   = 1
#   launch_type     = "FARGATE"

#   network_configuration {
#     security_groups = [aws_security_group.ecs_tasks.id]
#     subnets         = module.vpc.private_subnets
#     assign_public_ip = true
#   }

#   load_balancer {
#     target_group_arn = aws_lb_target_group.my_target_group.arn
#     container_name   = "my-container"
#     container_port   = 8080
#   }

#    lifecycle {
#    ignore_changes = [task_definition, desired_count]
#  }
# }

# # Create a load balancer target group
resource "aws_lb_target_group" "my_target_group" {
  name        = "my-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  health_check {
    enabled = true
    path = "/actuator/health"
  }
}

# # Create a load balancer listener
resource "aws_lb_listener" "my_listener" {
  load_balancer_arn = aws_lb.my_load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.my_target_group.arn
    type             = "forward"
  }
}

# # Create a load balancer
resource "aws_lb" "my_load_balancer" {
  name               = "my-load-balancer"
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets
  security_groups = [aws_security_group.alb.id]
}

# # Create an IAM policy for the task role
# resource "aws_iam_policy" "task_policy" {
#   name        = "ecs-task-policy"
#   description = "IAM policy for ECS task"

#   policy = <<POLICY
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": "ecr:*",
#       "Resource": "*"
#     },
#     {
#       "Effect": "Allow",
#       "Action": "logs:*",
#       "Resource": "*"
#     }
#   ]
# }
# POLICY
# }

# # Create an IAM role for the task
# resource "aws_iam_role" "task_role" {
#   name               = "ecs-task-role"
#   assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json

#   inline_policy {
#     name   = aws_iam_policy.task_policy.name
#     policy = aws_iam_policy.task_policy.policy
#   }
# }

# data "aws_iam_policy_document" "assume_role_policy" {
#   statement {
#     actions = ["sts:AssumeRole"]

#     principals {
#       type        = "Service"
#       identifiers = ["ecs-tasks.amazonaws.com"]
#     }
#   }
# }

