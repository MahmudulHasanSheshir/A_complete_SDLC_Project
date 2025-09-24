pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "docker.io"
        KUBECONFIG = credentials('kubeconfig')
        GIT_TAG = sh(script: 'git describe --tags --abbrev=0', returnStdout: true).trim()
	DOCKER_CREDENTIALS = credentials('docker-sheshir')
    }

    stages {
        stage('Pre-build') {
     	    steps {
                slackSend channel: '#cicd-sheshir', color: '#008000',
                          message: "Pipeline starting: ${currentBuild.fullDisplayName}"
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

	stage('Source Code Pulling') {
      	    steps {
        	git branch: master, credentialsId: 'git-sheshir', url: 'git@github.com:BrainStation23HR/DevOps_Mahmudul.git'
      	    }
    	}
        
        stage('Build & Test') {
            steps {
                sh 'docker build -t weather-api:${GIT_TAG} .'
                sh 'docker run --rm weather-api:${GIT_TAG} npm test'
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-sheshir', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                    sh 'docker tag weather-api:${GIT_TAG} ${DOCKER_REGISTRY}/${DOCKER_USERNAME}/weather-api:${GIT_TAG}'
                    sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_USERNAME}/weather-api:${GIT_TAG}'
                    sh 'docker tag weather-api:${GIT_TAG} ${DOCKER_REGISTRY}/${DOCKER_USERNAME}/weather-api:latest'
                    sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_USERNAME}/weather-api:latest'
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    sed -i "s|image:.*|image: docker.io/${DOCKER_USERNAME}/weather-api:${GIT_TAG}|g" k8s/deployment.yaml
                    
                    
                    kubectl apply -f k8s/configmap.yaml
                    kubectl apply -f k8s/secret.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl apply -f k8s/ingress.yaml
                    
                    kubectl rollout status deployment weather-api
                '''
            }
        }
    }
    
    post {
        
        slackSend(
                   channel: '#cicd-sheshir',
                   color: 'danger',
                   message: "Failed: Job ${currentBuild.fullDisplayName}"
                 )

    }
}
