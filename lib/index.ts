import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cloudwatchActions from '@aws-cdk/aws-cloudwatch-actions';
import * as sns from '@aws-cdk/aws-sns';
import * as snsSubscriptions from '@aws-cdk/aws-sns-subscriptions';

export interface StatusPageDeadMansSwitchProps {
  /**
   * The ID of the component in your Status Page you'd like to update
   */
  readonly statusPageComponentId: string;
  /**
   * The outage message you'd like to post to Status Page when this component is down
   */
  readonly outageMessage: string;
  /**
   * The CloudWatch namespace where your metric lives
   */
  readonly cloudwatchNamespace: string;
  /**
   * The CloudWatch metric you ping when the service is up
   */
  readonly cloudwatchMetric: string;
  /**
   * The HTTPS endpoint where alarm notifications should be routed
   */
  readonly notificationURL: string;
}

export class StatusPageDeadMansSwitch extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: StatusPageDeadMansSwitchProps) {
    super(scope, id);

    cdk.Tags.of(this).add("OutageMessage", props.outageMessage)
    cdk.Tags.of(this).add("StatusPageComponentId", props.statusPageComponentId)

    const metric = new cloudwatch.Metric({
      metricName: props.cloudwatchMetric,
      namespace: props.cloudwatchNamespace
    });

    const alarm = new cloudwatch.Alarm(this, 'DeadMansSwitchAlarm', {
      metric,
      threshold: 0,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      actionsEnabled: true,
      alarmName: props.cloudwatchMetric,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      period: cdk.Duration.seconds(120),
      statistic: 'Sum',
      treatMissingData: cloudwatch.TreatMissingData.BREACHING
    });

    const alarmTopic = new sns.Topic(this, props.cloudwatchMetric);
    const alarmTopicAction = new cloudwatchActions.SnsAction(alarmTopic);
    alarm.addAlarmAction(alarmTopicAction);
    alarm.addOkAction(alarmTopicAction);

    const subscription = new snsSubscriptions.UrlSubscription(props.notificationURL, {
      protocol: sns.SubscriptionProtocol.HTTPS
    })
    alarmTopic.addSubscription(subscription)
  }
}