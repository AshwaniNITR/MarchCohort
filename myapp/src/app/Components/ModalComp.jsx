import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/modal";

export default function ModalComp({
  ModalTitle,
  children,
  size = "md",
  actionName,
  onAction,
  isOpen,
  onOpen,
  onOpenChange,
  wantAction=true
}) {
  return (
    <>
      <Modal
        backdrop="blur"
        scrollBehavior="inside"
        size={size}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {ModalTitle}
              </ModalHeader>
              <ModalBody>{children}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {
                  wantAction?(
                    <Button color="primary" onPress={onAction}>
                    {actionName}
                  </Button>
                  ):(null)
                }
              
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
