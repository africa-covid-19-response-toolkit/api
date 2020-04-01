
# Setting up cognito stack

Execute the cognito-stack:

```
aws cloudformation create-stack --stack-name api-gateway-cognito --template-body file://coginto-stack.yml \
--parameters ParameterKey=Stage,ParameterValue=dev --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM 
```