import React, { useRef, useState, useCallback } from "react";
import { Button, Modal } from "antd";
import type { DraggableData, DraggableEvent } from "react-draggable";
import Draggable from "react-draggable";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  children?: React.ReactNode;
  OkButtontext: string;
  modalTitle?: string;
  modalOpenButtonText?: string;
  onSubmit: (params?: any) => void;
  open: boolean;
  width: string | number | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  initialvalues?: any;
  addButtonIcon?: React.ReactNode;
  addButtonType?: "default" | "link" | "primary" | "text" | "dashed";
  buttonType?: "Button" | "Link";
  disabledModalOpenButton?: boolean;
  isFullWidthOpenButton?: boolean;
}

const DraggableModel: React.FC<Props> = ({
  children,
  OkButtontext = "Ok",
  modalTitle,
  modalOpenButtonText = "Open",
  onSubmit,
  open,
  setOpen,
  width,
  isLoading,
  addButtonIcon = <PlusOutlined />,
  addButtonType = "default",
  buttonType = "Button",
  disabledModalOpenButton = false,
  isFullWidthOpenButton = false,
}) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef<HTMLDivElement>(null);
  const showModal = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onStart = useCallback(
    (_event: DraggableEvent, uiData: DraggableData) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggleRef.current?.getBoundingClientRect();
      if (!targetRect) return;

      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      });
    },
    []
  );

  // Common button render based on conditions
  const renderOpenButton = () => {
    if (buttonType === "Link") {
      return (
        <a onClick={showModal} style={{ cursor: "pointer" }}>
          {modalOpenButtonText}
        </a>
      );
    }

    return (
      <Button
        onClick={showModal}
        icon={addButtonIcon}
        type={addButtonType}
        disabled={disabledModalOpenButton}
        style={{width:isFullWidthOpenButton?'100%':undefined}}
      >
        {modalOpenButtonText}
      </Button>
    );
  };

  return (
    <>
      {renderOpenButton()}

      <Modal
        closable
        title={
          <div
            style={{ width: "100%", cursor: "move" }}
            onMouseOver={() => setDisabled(false)}
            onMouseOut={() => setDisabled(true)}
          >
            {modalTitle}
          </div>
        }
        okText={OkButtontext}
        open={open}
        onOk={onSubmit}
        okButtonProps={{ loading: isLoading }}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={onStart}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        width={width}
        destroyOnClose
      >
        {children}
      </Modal>
    </>
  );
};

export default DraggableModel;
