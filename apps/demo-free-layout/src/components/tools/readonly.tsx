import { useCallback } from 'react';

import { usePlayground } from '@flowgram.ai/free-layout-editor';
import { IconButton } from '@douyinfe/semi-ui';
import { IconUnlock, IconLock } from '@douyinfe/semi-icons';

export const Readonly = () => {
  const playground = usePlayground();
  const toggleReadonly = useCallback(() => {
    playground.config.readonly = !playground.config.readonly;
  }, [playground]);
  return playground.config.readonly ? (
    <IconButton theme="borderless" type="tertiary" icon={<IconLock size='default' />} onClick={toggleReadonly} />
  ) : (
    <IconButton theme="borderless" type="tertiary" icon={<IconUnlock size='default' />} onClick={toggleReadonly} />
  );
};
