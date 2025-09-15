## Manual Deployment
Public S3 Deployment URL (public access): http://ls-aws-practitioner-js-bucket.s3-website-us-east-1.amazonaws.com/

## Automated Deployment

Private S3 Deployment URL (Requires accessing with Cloudfront): http://deploywebappstack-deploymentfrontendbucket67ceb713-5pjb6feudebl.s3-website-us-east-1.amazonaws.com

CloudFront Deployment URL: https://d3umtqf4xixsm2.cloudfront.net/

# Scripts
## Deploying the Application

### Build and Deploy

To build and deploy the frontend and infrastructure:

1. Open a terminal in the `infra` directory.
2. Run:

	```bash
	npm run deploy
	```

This will build the frontend, upload it to S3, and invalidate the CloudFront cache automatically.

You can also use:

- `npm run build` – Build the frontend and infrastructure code only
- `npm run synth` – Synthesize the CloudFormation template
- `npm run destroy` – Remove the deployed stack from AWS


# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
