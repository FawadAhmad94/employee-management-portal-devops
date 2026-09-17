output "prometheus_public_ip" {
    description = "Public ip of prometheus ec2"
    value = aws_instance.prometheus_ec2.public_ip
}

output "promethues_private_ip" {
    description= "Private ip of prometheus ec2"
    value = aws_instance.prometheus_ec2.private_ip
}

output "grafana_public_ip" {
    description = "Public ip of grafana ec2"
    value = aws_instance.grafana_ec2.public_ip
}

output "grafana_private_ip" {
    description ="Private ip of grafana ec2"
    value = aws_instance.grafana_ec2.private_ip
}