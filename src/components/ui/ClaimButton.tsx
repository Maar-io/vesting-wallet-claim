import React from 'react';
import { ClaimButtonProps } from '../../types';
import './ClaimButton.css';

const ClaimButton: React.FC<ClaimButtonProps> = ({
  disabled,
  onClick,
  isLoading,
}) => {
  const buttonClass = disabled ? 'disabled' : 'enabled';

  return (
    <button
      className={`claim-button ${buttonClass}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="claim-button-loader">
          <div className="claim-button-spinner"></div>
          Processing...
        </div>
      ) : (
        'Claim Tokens'
      )}
    </button>
  );
};

export default ClaimButton;
