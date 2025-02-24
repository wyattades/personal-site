import React, { useId } from "react";

export const PopupHelp: React.FC<{
  children: React.ReactNode;
  content: React.ReactNode;
}> = ({ children, content }) => {
  const id = useId();
  return (
    <span className="popup-help">
      <span className="popup-anchor" id={id}>
        <a className="popup-help-trigger" href={`#${id}`}>
          {children}
        </a>
      </span>
      <span className="popup-help-content">{content}</span>

      <style jsx>{`
        .popup-help {
          position: relative;
          display: inline-block;
        }

        .popup-anchor {
          anchor-name: --popup;
        }

        .popup-help-trigger {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px dashed #666;
          cursor: pointer;
        }

        .popup-help-content {
          font-size: 0.875rem;
          line-height: 1.25;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 6px;
          box-shadow:
            0 -4px 10px rgba(0, 0, 0, 0.1),
            0 4px 25px rgba(0, 0, 0, 0.25);
          padding: 0.75rem 1rem;
          width: max-content;
          max-width: 300px;
          z-index: 100;
          margin-top: 8px;

          opacity: 0;
          visibility: hidden;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
          transform: translate(-50%, 10px);
        }

        .popup-help-content::after {
          content: "";
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid white;
          border-top: none;
        }

        .popup-help-content::before {
          content: "";
          position: absolute;
          top: -8px;
          left: 0;
          right: 0;
          height: 8px;
        }

        .popup-anchor:hover + .popup-help-content,
        .popup-anchor:focus-within + .popup-help-content,
        .popup-help-content:hover {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, 0);
        }
      `}</style>
    </span>
  );
};
