import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './DSModal.scss';

const getFocusableElements = (container) => {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(container.querySelectorAll(selectors.join(','))).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
};

const DSModal = ({
  isOpen,
  onClose,
  title,
  size = 'md', // 'sm' | 'md' | 'lg'
  children,
  closeOnOverlay = true,
  showCloseButton = true,
  ariaDescribedBy,
  portalTarget,
}) => {
  const containerRef = useRef(null);
  const titleIdRef = useRef(`dsmodal-title-${Math.random().toString(36).slice(2, 9)}`);
  const portalElRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Create portal element
    if (!portalElRef.current) {
      portalElRef.current = document.createElement('div');
    }
    const target = portalTarget || document.body;
    target.appendChild(portalElRef.current);

    // Scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus handling
    const container = containerRef.current;
    requestAnimationFrame(() => {
      container?.focus();
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = getFocusableElements(container);
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = originalOverflow || '';
      try {
        target.removeChild(portalElRef.current);
      } catch (_) {
        // ignore
      }
    };
  }, [isOpen, onClose, portalTarget]);

  if (!isOpen) return null;

  const content = (
    <div
      className="ds-modal-overlay"
      onClick={closeOnOverlay ? onClose : undefined}
    >
      <div
        className={`ds-modal ds-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleIdRef.current : undefined}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="ds-modal__header">
            {title && (
              <h3 className="ds-modal__title" id={titleIdRef.current}>
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                className="ds-modal__close"
                onClick={onClose}
                aria-label="모달 닫기"
              >
                ×
              </button>
            )}
          </div>
        )}
        {extractSlots(children)}
      </div>
    </div>
  );

  if (portalElRef.current) {
    return ReactDOM.createPortal(content, portalElRef.current);
  }
  return content;
};

const extractSlots = (children) => {
  const body = [];
  const footer = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      body.push(child);
      return;
    }
    const displayName = child.type?.displayName || child.type?.name;
    if (displayName === 'DSModalBody') {
      body.push(child.props.children);
    } else if (displayName === 'DSModalFooter') {
      footer.push(child.props.children);
    } else {
      body.push(child);
    }
  });

  return (
    <>
      <div className="ds-modal__body">{body}</div>
      {footer.length > 0 && <div className="ds-modal__footer">{footer}</div>}
    </>
  );
};

const Body = ({ children }) => children;
Body.displayName = 'DSModalBody';
DSModal.Body = Body;

const Footer = ({ children }) => children;
Footer.displayName = 'DSModalFooter';
DSModal.Footer = Footer;

export default DSModal;


