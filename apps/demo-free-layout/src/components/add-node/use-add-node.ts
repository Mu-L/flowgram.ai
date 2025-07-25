/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */
import { useCallback } from 'react';

import { NodePanelResult, WorkflowNodePanelService } from '@flowgram.ai/free-node-panel-plugin';
import {
  useService,
  WorkflowDocument,
  usePlayground,
  PositionSchema,
  WorkflowNodeEntity,
  WorkflowSelectService,
  WorkflowNodeJSON,
  getAntiOverlapPosition,
  WorkflowNodeMeta,
  FlowNodeBaseType,
} from '@flowgram.ai/free-layout-editor';
// hook to get panel position from mouse event - 从鼠标事件获取面板位置的 hook
const useGetPanelPosition = () => {
  const playground = usePlayground();
  return useCallback(
    (targetBoundingRect: DOMRect): PositionSchema =>
      // convert mouse position to canvas position - 将鼠标位置转换为画布位置
      playground.config.getPosFromMouseEvent({
        clientX: targetBoundingRect.left + 64,
        clientY: targetBoundingRect.top - 7,
      }),
    [playground]
  );
};
// hook to handle node selection - 处理节点选择的 hook
const useSelectNode = () => {
  const selectService = useService(WorkflowSelectService);
  return useCallback(
    (node?: WorkflowNodeEntity) => {
      if (!node) {
        return;
      }
      // select the target node - 选择目标节点
      selectService.selectNode(node);
    },
    [selectService]
  );
};

const getContainerNode = (selectService: WorkflowSelectService) => {
  const { activatedNode } = selectService;
  if (!activatedNode) {
    return;
  }
  const { isContainer } = activatedNode.getNodeMeta<WorkflowNodeMeta>();
  if (isContainer) {
    return activatedNode;
  }
  const parentNode = activatedNode.parent;
  if (!parentNode || parentNode.flowNodeType === FlowNodeBaseType.ROOT) {
    return;
  }
  return parentNode;
};

// main hook for adding new nodes - 添加新节点的主 hook
export const useAddNode = () => {
  const workflowDocument = useService(WorkflowDocument);
  const nodePanelService = useService<WorkflowNodePanelService>(WorkflowNodePanelService);
  const selectService = useService(WorkflowSelectService);
  const playground = usePlayground();
  const getPanelPosition = useGetPanelPosition();
  const select = useSelectNode();

  return useCallback(
    async (targetBoundingRect: DOMRect): Promise<void> => {
      // calculate panel position based on target element - 根据目标元素计算面板位置
      const panelPosition = getPanelPosition(targetBoundingRect);
      const containerNode = getContainerNode(selectService);
      await new Promise<void>((resolve) => {
        // call the node panel service to show the panel - 调用节点面板服务来显示面板
        nodePanelService.callNodePanel({
          position: panelPosition,
          enableMultiAdd: true,
          containerNode,
          panelProps: {},
          // handle node selection from panel - 处理从面板中选择节点
          onSelect: async (panelParams?: NodePanelResult) => {
            if (!panelParams) {
              return;
            }
            const { nodeType, nodeJSON } = panelParams;
            const position = Boolean(containerNode)
              ? getAntiOverlapPosition(workflowDocument, {
                  x: 0,
                  y: 200,
                })
              : undefined;
            // create new workflow node based on selected type - 根据选择的类型创建新的工作流节点
            const node: WorkflowNodeEntity = workflowDocument.createWorkflowNodeByType(
              nodeType,
              position, // position undefined means create node in center of canvas - position undefined 可以在画布中间创建节点
              nodeJSON ?? ({} as WorkflowNodeJSON),
              containerNode?.id
            );
            select(node);
          },
          // handle panel close - 处理面板关闭
          onClose: () => {
            resolve();
          },
        });
      });
    },
    [getPanelPosition, nodePanelService, playground.config.zoom, workflowDocument, select]
  );
};
