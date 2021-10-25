# Status Page Dead Man's Switch AWS CDK Construct

## Usage

```typescript
import * as cdk from '@aws-cdk/core';
import { StatusPageDeadMansSwitch } from "@pipedream/aws-cdk-status-page-dead-mans-switch"

export class DeadMansSwitchesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new StatusPageDeadMansSwitch(this, 'TimerWorkflowCheck', {
      statusPageComponentId: "abc123",
      outageMessage: "Timer-based Workflows are down",
      cloudwatchNamespace: "Pipedream/Workflows",
      cloudwatchMetric: "TimerWorkflowCheck",
      notificationURL: "https://pipedream.com",
    });
  }
}
```

## Useful commands

- `npm run build`   compile typescript to js
- `npm run watch`   watch for changes and compile
- `npm run test`    perform the jest unit tests
