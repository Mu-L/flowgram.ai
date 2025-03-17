import styled from 'styled-components';

export const ContainerNodeHeaderStyle = styled.div`
  cursor: move;

  z-index: 0;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 48px;
  padding: 16px;

  border-radius: 8px 8px 0 0;

  .container-node-logo {
    position: relative;

    flex-shrink: 0;

    width: 24px;
    height: 24px;

    border-radius: 4px;

    &::after {
      content: '';

      position: absolute;
      top: 0;
      left: 0;

      display: block;

      width: 100%;
      height: 100%;

      border-radius: 4px;
      box-shadow: inset 0 0 0 1px var(--coz-stroke-plus);
    }

    > img {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }
  }

  .container-node-title {
    margin: 0;
    padding: 0;

    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    line-height: 22px;
    color: var(--coz-fg-primary, rgba(6, 7, 9, 80%));
    text-overflow: ellipsis;
  }

  .container-node-tooltip {
    height: 100%;
  }

  .container-node-tooltip-icon {
    display: flex;
    align-items: center;

    width: 16px;
    height: 100%;

    color: #a7a9b0;
  }
`;
