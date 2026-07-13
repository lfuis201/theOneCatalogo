import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { PublicHeader } from "../components/PublicHeader";

export function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrolling after navigating from another page to home
  useEffect(() => {
    if (location.pathname === "/") {
      const params = new URLSearchParams(location.search);
      const scrollTarget = params.get("scroll");
      if (scrollTarget) {
        setTimeout(() => {
          const element = document.getElementById(scrollTarget);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            // Clean up the URL search query
            navigate("/", { replace: true });
          }
        }, 300);
      }
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-[#D4AF37] selection:text-black flex flex-col overflow-x-hidden">
      {/* Styles for premium font and custom scrollbar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Inter:wght@200;300;400;500;600;700;800&display=swap');
        .font-serif-elegant {
          font-family: 'Cormorant Garamond', serif;
        }
        .font-sans-clean {
          font-family: 'Inter', sans-serif;
        }
        .text-gold {
          color: #C5A028;
        }
        .bg-gold-gradient {
          background: linear-gradient(135deg, #ECC844 0%, #D4AF37 50%, #C5A028 100%);
        }
        .border-gold {
          border-color: rgba(197, 160, 40, 0.4);
        }
        .border-gold-focus:focus-within {
          border-color: #C5A028;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Shared Public Header component */}
      <PublicHeader />

      {/* Main content slot */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>
    </div>
  );
}
