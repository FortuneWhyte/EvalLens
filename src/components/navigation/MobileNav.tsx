import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { allNavItems } from "./navItems";

/**
 * Navigation for viewports below `md`.
 *
 * Both desktop navs are `hidden md:flex`, so without this there is no way to
 * leave a screen on a phone at all. It renders the union of both menus, since
 * it stands in for both.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Navigating away should close the drawer; otherwise it stays over the screen
  // you just asked for.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes, and the page behind must not scroll while the drawer covers
  // it — a scrolling background under a fixed overlay is disorienting on touch.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="md:hidden border border-primary-fixed-dim text-primary-fixed-dim px-3 py-2 font-label-caps text-label-caps hover:bg-primary-fixed-dim/10 transition-colors flex items-center gap-2"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">
          {open ? "close" : "menu"}
        </span>
        {open ? "CLOSE" : "MENU"}
      </button>

      {/* Rendered into <body>. The trigger lives inside a header that sets its
          own z-index, which creates a stacking context - inside it, no z-index
          the drawer chooses can rise above the page's fixed footer, so part of
          the overlay ends up behind it. A portal escapes that entirely. */}
      {open &&
        createPortal(
          <div className="md:hidden fixed inset-0 z-[60] flex flex-col">
            {/* Backdrop: tapping outside the panel is the expected way out on touch. */}
            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-background/85 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              tabIndex={-1}
              type="button"
            />

            <nav className="relative bg-surface-container-low border-b border-primary-fixed-dim shadow-[0_0_20px_rgba(0,230,57,0.15)] flex flex-col max-h-full overflow-y-auto">
              <div className="flex items-center justify-between px-margin py-4 border-b border-outline-variant">
                <span className="font-display text-headline-md text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,230,57,0.8)]">
                  &gt; EvalLens
                </span>
                <button
                  aria-label="Close navigation"
                  className="text-on-surface-variant hover:text-primary-fixed transition-colors"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex flex-col py-2">
                {allNavItems.map((item) => {
                  const active = item.to !== undefined && item.to === pathname;
                  const className = `flex items-center gap-3 px-margin py-4 border-l-4 transition-colors ${
                    active
                      ? "border-primary-fixed-dim bg-primary-container/10 text-primary-fixed-dim"
                      : "border-transparent text-on-surface-variant hover:bg-surface-variant/20 hover:text-secondary-container"
                  }`;
                  const content = (
                    <>
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon ?? "chevron_right"}
                      </span>
                      <span className="font-label-caps text-label-caps">
                        {item.label}
                      </span>
                      {!item.to && (
                        <span className="ml-auto font-code text-[10px] text-on-surface-variant/50">
                          SOON
                        </span>
                      )}
                    </>
                  );

                  return item.to ? (
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={className}
                      key={item.label}
                      to={item.to}
                    >
                      {content}
                    </Link>
                  ) : (
                    // No screen behind it yet, so it is marked rather than
                    // offered as a dead tap target.
                    <span
                      className={`${className} opacity-50 cursor-not-allowed`}
                      key={item.label}
                    >
                      {content}
                    </span>
                  );
                })}
              </div>

              <div className="px-margin py-4 border-t border-outline-variant flex items-center gap-2 font-code text-code text-primary-fixed-dim">
                <span className="status-blinker w-2 h-2"></span>
                OPERATOR_01 :: ACTIVE
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
