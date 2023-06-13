# Create an ECS cluster
data "aws_ecr_repository" "my_ecr_repo" {
  name = var.ecr_repo_name
}

locals {
  task_image = "${data.aws_ecr_repository.my_ecr_repo.repository_url}:v1"
  cw_log_group = "/ecs/${var.name}" 
  container_definition = [{
    cpu         = 512
    image       = local.task_image
    memory      = 1024
    name        = var.name
    networkMode = "awsvpc"
    portMappings = [
      {
        protocol      = "tcp"
        containerPort = var.container_port
        hostPort      = var.container_port
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
}

# ECS Task and Service Security Group, IAM Policy and Roles.
resource "aws_security_group" "fargate_task" {
  name   = "${var.name}-fargate-task-sg"
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
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
  name   = "${var.name}-fargate_execution_policy"
  policy = "${file("fargateExecutionIAMPolicy.json")}"
}

resource "aws_iam_policy" "fargate_task" {
  name   = "${var.name}-fargate_task_policy"
  policy = "${file("fargateTaskIAMPolicy.json")}"
}
resource "aws_iam_role" "fargate_execution" {
  name               = "${var.name}-fargate-execution-role"
  assume_role_policy = data.aws_iam_policy_document.fargate-role-policy.json
}
resource "aws_iam_role" "fargate_task" {
  name               = "${var.name}-fargate-task-role"
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

#CloudWatch Log 
resource "aws_cloudwatch_log_group" "app" {
  name = local.cw_log_group
}
#ECS CLuster, Task and Service

resource "aws_ecs_cluster" "main" {
  name = "${var.name}-ecs-cluster"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.name}-task-family"
  network_mode             = "awsvpc"
  cpu                      = local.container_definition.0.cpu
  memory                   = local.container_definition.0.memory
  requires_compatibilities = ["FARGATE"]
  container_definitions    = jsonencode(local.container_definition)
  execution_role_arn       = aws_iam_role.fargate_execution.arn
  task_role_arn            = aws_iam_role.fargate_task.arn
}

resource "aws_ecs_service" "app" {
  name            = "${var.name}-svc"
  cluster         = aws_ecs_cluster.main.name
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.service_desired_count
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.my_target_group.arn
    container_name   = var.name
    container_port   = var.container_port
  }
  network_configuration {
    security_groups = [aws_security_group.fargate_task.id]
    subnets         = module.vpc.private_subnets
  }
}

#Public Load Balancer
resource "aws_security_group" "alb" {
  name   = "${var.name}-alb-sg"
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


# Create a load balancer target group
resource "aws_lb_target_group" "my_target_group" {
  name        = "${var.name}-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  health_check {
    enabled = true
    path    = var.health_check_path
  }
}

# Create a load balancer listener
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
  name               = "${var.name}-load-balancer"
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.alb.id]
}
