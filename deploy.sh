#!/bin/bash

# Install dependencies
npm i

# Required for CDK to function
npx cdk bootstrap

# Check for errors, produce CloudFormation template from the latest CDK code
npx cdk synth

# Deploy serialized CloudFormation template 
npx cdk deploy --require-approval never