import React from 'react';
import { Plus } from 'lucide-react';
import ButtonSharedComponent from './ButtonSharedComponent';

export interface PrimaryActionButtonSharedComponentProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function PrimaryActionButtonSharedComponent({
  label,
  onClick,
  icon = <Plus className="w-3.5 h-3.5 !text-white" />,
  disabled = false,
  isLoading = false,
  loadingText,
  type = 'button',
  className = '',
}: PrimaryActionButtonSharedComponentProps): React.JSX.Element {
  return (
    <ButtonSharedComponent
      variant="primary"
      size="sm"
      type={type}
      onClick={onClick}
      disabled={disabled}
      isLoading={isLoading}
      loadingText={loadingText}
      className={`!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold shrink-0 ${className}`}
      icon={icon}
    >
      <span className="!text-white font-medium">{label}</span>
    </ButtonSharedComponent>
  );
}
