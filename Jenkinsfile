def DOCKER_IMAGE_NAME
def TARGET_HOST = "ssh://VertaceVM@pmp.vertace.net"
def DOCKER_REGISTRY = "docker-registry.vertace.net"

pipeline {
  agent any

    stages{
      stage('Initialize the variables') {
            steps{
                script{
DOCKER_IMAGE_NAME = "${env.JOB_NAME.toLowerCase()}"
DOCKER_IMAGE_NAME = "${DOCKER_IMAGE_NAME.replace("/","_")}"
DOCKER_IMAGE_NAME = "${DOCKER_IMAGE_NAME.replace("_${GIT_BRANCH}","")}"
                }
            }                
        }

       stage('Build docker image'){
           steps{

               echo "Pulling env file from ${HOME}/.env/${JOB_NAME}"
sh "cp ${HOME}/.env/${env.JOB_NAME}/.env ."
sh "echo \"\" >> .env"
sh "echo \"DOCKER_IMAGE_NAME=${DOCKER_IMAGE_NAME}\" >> .env"

               script{
                   sh "docker build . -t ${DOCKER_IMAGE_NAME}:${GIT_BRANCH}"
                   sh "docker tag ${DOCKER_IMAGE_NAME}:${GIT_BRANCH} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${GIT_BRANCH}"
               }
       }
       }

       stage('Push to registry'){
           steps{
               script{
                   sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${GIT_BRANCH}"
               }
       }
       }

       stage('Pull docker image on remote host'){
           steps{
               script{
                   sh "docker -H \"${TARGET_HOST}\" pull ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${GIT_BRANCH}"
               }
       }
       }

       stage('Start container'){
           steps{
               script{
                   sh "docker-compose --compatibility -H \"${TARGET_HOST}\" -p ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}_${GIT_BRANCH} up -d --no-build"
               }
       }
       }

       }
	   
	       post {
        always {
            echo 'Notifying culprits/developers'
            
emailext(body: '${DEFAULT_CONTENT}', mimeType: 'text/html',
         replyTo: '$DEFAULT_REPLYTO', subject: '${DEFAULT_SUBJECT}',
         to: emailextrecipients([[$class: 'CulpritsRecipientProvider'],
								[$class: 'DevelopersRecipientProvider'],
                                 [$class: 'RequesterRecipientProvider']]))
            
        }
    }
}