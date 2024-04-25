import type { AWS } from '@serverless/typescript';
import functions from './src';

if (!process.env.DATABASE_URL || !process.env.MAL_CLIENT_ID) {
  throw new Error('DATABASE_URL and MAL_CLIENT_ID must be set');
}

const config: AWS = {
  service: 'aws-cron',
  frameworkVersion: '3',
  plugins: ['serverless-webpack', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'ap-southeast-1',
    environment: {
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DATABASE_URL: process.env.DATABASE_URL!,
      MAL_CLIENT_ID: process.env.MAL_CLIENT_ID!,
    },
  },
  package: {
    individually: true,
  },
  functions,
};

module.exports = config;
