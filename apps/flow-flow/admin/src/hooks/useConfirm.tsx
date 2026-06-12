import { useState } from 'react';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{ message: string; title?: string; onConfirm: () => void }>({
    message: '',
    onConfirm: () => {},
  });

  const confirm = (message: string, onConfirm: () => void, title?: string) => {
    setConfig({ message, onConfirm, title });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    config.onConfirm();
    setIsOpen(false);
  };

  const ModalComponent = () => (
    <ConfirmModal
      isOpen={isOpen}
      message={config.message}
      title={config.title}
      onConfirm={handleConfirm}
      onCancel={() => setIsOpen(false)}
    />
  );

  return { confirm, ModalComponent };
}
