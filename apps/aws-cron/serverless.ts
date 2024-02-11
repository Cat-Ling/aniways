import type { AWS } from '@serverless/typescript';
import functions from './src';

export default {
  service: 'aws-cron',
  frameworkVersion: '3',
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'ap-southeast-1',
    environment: {
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  package: {
    individually: true,
  },
  functions,
} satisfies AWS;
