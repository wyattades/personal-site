"use client";

import { Moon as DarkIcon, Sun as LightIcon } from "lucide-react";
import { useTheme } from "~/components/style-theme";

const themeIcons = {
  light: LightIcon,
  dark: DarkIcon,
  // system: SystemIcon,
};

export const ThemeSelector = () => {
  const theme = useTheme();

  const ThemeIcon = (theme && themeIcons[theme.mode]) || themeIcons.light;

  return (
    <button
      type="button"
      className="button-reset nav-item"
      onClick={theme?.toggleMode}
      aria-label="Toggle theme"
      title={`Toggle ${theme?.mode ?? ""} theme`}
    >
      <span>&nbsp;</span>

      <i
        style={{
          padding: "2px 0",
          transition: "transform 300ms ease",
          transform: `scaleX(${(theme?.changeCount ?? 0) % 2 === 0 ? 1 : -1})`,
        }}
      >
        <ThemeIcon />
      </i>

      <span>{theme?.mode}</span>

      <style jsx>{`
        span {
          font-size: 0.5rem;
          color: var(--help-text-color);
          letter-spacing: 0.5px;
          font-weight: 600px;
          text-transform: capitalize;
          transition: opacity 300ms ease;
          opacity: 0;
        }
        button {
          width: 3rem;
          @media (max-width: 768px) {
            width: 2.5rem;
          }
        }
        button svg {
          width: 1.5rem;
          @media (max-width: 768px) {
            width: 1.25rem;
          }
        }
        button:hover span {
          opacity: 1;
        }
      `}</style>
    </button>
  );
};
