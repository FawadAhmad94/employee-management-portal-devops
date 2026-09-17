pipeline {
    agent any 
    environment {
        DOCKER_USERNAME="fawadahmad94"
        BACKEND_IMAGE= "${DOCKER_USERNAME}/employee-backend"
        FRONTEND_IMAGE= "${DOCKER_USERNAME}/employee-frontend"
        IMAGE_TAG="${BUILD_NUMBER}"
    }

    stages {
        stage ("CLONE REPOSITORY"){
            steps {
                git branch: "main",url: "https://github.com/FawadAhmad94/employee-management-portal-devops.git"
            }
        }
        stage ("BUILD_BACKEND_IMAGE"){
            steps {
                sh '''
                docker build -t $BACKEND_IMAGE:$IMAGE_TAG ./backend
                '''
            }
        }
        stage ("BUILD_FRONTEND_IMAGE") {
            steps {
                sh '''
                docker build --build-arg VITE_API_URL=http://3.79.14.126:5000 -t $FRONTEND_IMAGE:$IMAGE_TAG ./frontend
                '''
            }
        }
        stage ("DOCKER_HUB_LOGIN"){
            steps {
                withCredentials([usernamePassword(
                credentialsId: "dockerhub-credentials",
                usernameVariable:"DOCKER_USER",
                passwordVariable: "DOCKER_PASS"    
                )]) {
                sh '''
                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                '''    
                }
            }
        }
        stage ("PUSH_BACKEND_IMAGE"){
            steps {
                sh '''
                docker push $BACKEND_IMAGE:$IMAGE_TAG
                '''
            }
        }
        stage ("PUSH_FRONTEND_IMAGE"){
            steps {
            sh '''
            docker push $FRONTEND_IMAGE:$IMAGE_TAG
            '''    
            }
        }
        stage ("KIND_CLUSTER") {
            steps {
                sh '''
                kind delete cluster --name devops-cluster || true
                kind create cluster --config kind_cluster.yaml 
                '''
            }
        }
        stage ("KUBERNETES_DEPLOYMENT"){
            steps {
                sh '''
		kubectl apply -f k8s/namespace.yaml

		#this will create namespace first then all the other commands runs smoothly
                #as kubectl is idempotent runnin again namespace won't hurt
                
                kubectl apply -f k8s/

                #kubectl set image deployment/DEPLOYMENT_NAME CONTAINER_NAME=NEW_IMAGE 
                kubectl set image deployment/frontend-deployment \
                    frontend=$FRONTEND_IMAGE:$IMAGE_TAG \
                    -n employee-app
                
                kubectl set image deployment/backend-deployment \
                    backend=$BACKEND_IMAGE:$IMAGE_TAG \
                    -n employee-app
                   
                            
                # Wait for the new deployments to become ready
                kubectl rollout status deployment/frontend-deployment -n employee-app
                kubectl rollout status deployment/backend-deployment -n employee-app
                '''
            }
        }
        stage ("INSTALLING_KSM"){
            steps {
                sh '''
                helm install kube-state-metrics \
                    oci://ghcr.io/prometheus-community/charts/kube-state-metrics \
                    -n monitoring \
                    --create-namespace
                    '''
            }
        }
        stage ("CONFIGURING_KSM_SERVICE"){
            steps {
                sh '''
                kubectl apply -f monitoring/kube-state-service.yaml
                '''
            }
        }
        stage ("VERIFY_KSM"){
            steps {
                sh '''

                echo "=======KSM PODS======="
                kubectl get  pods -n monitoring -o wide

                echo "========KSM SERVICE=========="
                kubectl get svc -n monitoring

                echo "============KSM POD STATUS============"
                kubectl wait \
                    --for=condition=ready \
                    pod \
                    -l app.kubernetes.io/name=kube-state-metrics \
                    -n monitoring \
                    --timeout=120s

                    '''
            }
        }
    }

}
