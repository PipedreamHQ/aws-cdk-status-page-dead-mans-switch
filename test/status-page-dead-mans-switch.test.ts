import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as StatusPageDeadMansSwitch from '../lib/index';

/*
 * Example test
 */
test('SNS Topic Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  new StatusPageDeadMansSwitch.StatusPageDeadMansSwitch(stack, 'MyTestConstruct', {
    statusPageComponentId: "123",
    outageMessage: "Pipedream workflows are down",
    cloudwatchNamespace: "Pipedream/Workflows",
    cloudwatchMetric: "TestMetric",
    notificationURL: "https://pipedream.com",
  });
  // THEN
  expectCDK(stack).to(countResources("AWS::SNS::Topic",1));
  expectCDK(stack).to(countResources("AWS::SNS::Subscription",1));
  expectCDK(stack).to(countResources("AWS::CloudWatch::Alarm",1));
});
