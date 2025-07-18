/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { IContainer, IEngine, IExecutor, WorkflowStatus } from '@flowgram.ai/runtime-interface';

import { LLMExecutor } from '@nodes/llm';
import { snapshotsToVOData } from '../utils';
import { WorkflowRuntimeContainer } from '../../container';
import { TestSchemas } from '.';

let container: IContainer;

beforeEach(() => {
  container = WorkflowRuntimeContainer.instance;
  const executor = container.get<IExecutor>(IExecutor);
  executor.register(new LLMExecutor());
});

describe('workflow runtime real llm test', () => {
  it('should execute workflow', async () => {
    if (process.env.ENABLE_REAL_TESTS !== 'true') {
      return;
    }
    if (!process.env.MODEL_NAME || !process.env.API_KEY || !process.env.API_HOST) {
      throw new Error('Missing environment variables');
    }
    const engine = container.get<IEngine>(IEngine);
    const modelName = process.env.MODEL_NAME;
    const apiKey = process.env.API_KEY;
    const apiHost = process.env.API_HOST;
    const { context, processing } = engine.invoke({
      schema: TestSchemas.llmRealSchema,
      inputs: {
        model_name: modelName,
        api_key: apiKey,
        api_host: apiHost,
        formula: '1+1',
      },
    });
    expect(context.statusCenter.workflow.status).toBe(WorkflowStatus.Processing);
    const result = await processing;
    expect(context.statusCenter.workflow.status).toBe(WorkflowStatus.Succeeded);
    expect(result).toStrictEqual({
      answer: '2',
    });
    const snapshots = snapshotsToVOData(context.snapshotCenter.exportAll());
    expect(snapshots).toStrictEqual([
      {
        nodeID: 'start_0',
        inputs: {},
        outputs: {
          model_name: modelName,
          api_key: apiKey,
          api_host: apiHost,
          formula: '1+1',
        },
        data: {},
      },
      {
        nodeID: 'llm_0',
        inputs: {
          modelName: modelName,
          apiKey: apiKey,
          apiHost: apiHost,
          temperature: 0,
          prompt: 'Just give me the answer of "1+1=?", just one number, no other words',
          systemPrompt: 'You are a "math formula" calculator.',
        },
        outputs: { result: '2' },
        data: {},
      },
      {
        nodeID: 'end_0',
        inputs: { answer: '2' },
        outputs: { answer: '2' },
        data: {},
      },
    ]);
  });
});
