provider "aws" {
    region = var.aws_region
}

data "aws_vpc" "default_vpc" {
    default = true
}

data "aws_subnets" "default_subnet" {
    filter {
        name = "vpc-id"
        values = [data.aws_vpc.default_vpc.id]
    }
    filter {
        name = "availability-zone"
        values = ["eu-central-1b"]
    }
}

resource "aws_security_group" "prometheus_sg" {
    name = "${var.project_name}-prometheus-SG"
    description = " sg for ec2"
    vpc_id = data.aws_vpc.default_vpc.id
    
    ingress {
        description = "ssh"
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks= [var.access_ip_cidr]
    }
      ingress {
        description = "prometheus"
        from_port = 9090
        to_port = 9090
        protocol = "tcp"
        cidr_blocks= [var.access_ip_cidr]
    }
    egress {
        description = "egress rules"
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

    resource "aws_security_group" "grafana_sg" {
    name = "${var.project_name}-grafana-SG"
    description = " grafana sg for ec2"
    vpc_id = data.aws_vpc.default_vpc.id

      ingress {
        description = "Grafana"
        from_port = 3000
        to_port = 3000
        protocol = "tcp"
        cidr_blocks= [var.access_ip_cidr]
    }
      ingress {
        description = "ssh"
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks= [var.access_ip_cidr]
    }

    egress {
        description = "egress rules"
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_key_pair" "my_key" {
    key_name = var.key_name
    public_key = file(pathexpand(var.public_key_path))
}

resource "aws_instance" "prometheus_ec2" {
    ami = var.ami_id
    instance_type= var.instance_type
    subnet_id = data.aws_subnets.default_subnet.ids[0]
    vpc_security_group_ids = [aws_security_group.prometheus_sg.id]
    key_name = aws_key_pair.my_key.key_name
    associate_public_ip_address = true
    
    tags = {
    
        Name = "${var.project_name}-Prometheus-EC2" 
        Environment = "Prometheus-Monitoring"
}
}
resource "aws_instance" "grafana_ec2" {
    ami = var.ami_id
    instance_type= var.instance_type
    subnet_id = data.aws_subnets.default_subnet.ids[0]
    vpc_security_group_ids = [aws_security_group.grafana_sg.id]
    key_name = aws_key_pair.my_key.key_name
    associate_public_ip_address = true
    
    tags = {
    
        Name = "${var.project_name}-Grafana-EC2" 
        Environment = "Grafana-Monitoring"
    } 

}