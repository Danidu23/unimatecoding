import { useEffect, useState } from "react";
import StaffHeader from "./StaffHeader";

const CSS = `
  .sl-root{
    min-height:100vh;
    background:
      radial-gradient(circle at top left, rgba(245,166,35,.10), transparent 26%),
      linear-gradient(180deg, #0a1020 0%, #0d1326 100%);
  }

  .sl-main{
    min-height:100vh;
    padding-top:24px;
    padding-right:24px;
    padding-bottom:24px;
    padding-left:100px;
    transition:padding-left .28s ease;
  }

  .sl-main.pinned{
    padding-left:264px;
  }

  .sl-content{
    width:100%;
    max-width:none;
    margin:0;
  }

  @media (max-width: 900px){
    .sl-main{
      padding-top:90px;
      padding-right:16px;
      padding-bottom:16px;
      padding-left:16px;
    }

    .sl-main.pinned{
      padding-left:16px;
    }
  }
`;

export default function StaffLayout({ children }) {
  const [pinned, setPinned] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("staff_sidebar_pinned") === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(min-width: 901px)");

    const syncPinnedState = () => {
      setPinned(localStorage.getItem("staff_sidebar_pinned") === "true");
    };

    const handleStorage = (event) => {
      if (event.key === "staff_sidebar_pinned") {
        syncPinnedState();
      }
    };

    const handleFocus = () => {
      syncPinnedState();
    };

    const handlePointerDown = () => {
      syncPinnedState();
    };

    syncPinnedState();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pointerdown", handlePointerDown);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncPinnedState);
    } else {
      mediaQuery.addListener(syncPinnedState);
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pointerdown", handlePointerDown);

      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", syncPinnedState);
      } else {
        mediaQuery.removeListener(syncPinnedState);
      }
    };
  }, []);

  return (
    <div className="sl-root">
      <style>{CSS}</style>
      <StaffHeader />

      <main className={`sl-main ${pinned ? "pinned" : ""}`}>
        <div className="sl-content">{children}</div>
      </main>
    </div>
  );
}