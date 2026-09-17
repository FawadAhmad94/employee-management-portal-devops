variable "aws_region" {
    description = "AWS Region"
    type= string
}

variable "ami_id" {
    description = "ami id for EC2"
    type = string
}

variable "instance_type" {
    description = "ec2 indtance type"
    type = string
    default = "t3.micro"
}

variable "public_key_path"{
    description = "path to fetch public key"
    type = string
}

variable "access_ip_cidr" {
    description = "ip cidr which can access this ec2"
    type = string
}

 variable "project_name" {
    description = " any descriptive project name"
    type = string
}

variable "key_name" {
    description = "key_name to be displayed in aws console"
    type = string
}
