import type { CSSProperties } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConfirmEmail } from "@/features/confirm-email/model/useConfirmEmail";

const isRecoveryLink = (location: ReturnType<typeof useLocation>) => {
  const hash = location.hash.startsWith("#")
    ? location.hash.slice(1)
    : location.hash;
  const hashParams = new URLSearchParams(hash);
  const queryParams = new URLSearchParams(location.search);
  const type = hashParams.get("type") ?? queryParams.get("type");
  return type === "recovery";
};

export const ConfirmEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRecovery = isRecoveryLink(location);
  const { status, error } = useConfirmEmail();

  useEffect(() => {
    if (isRecovery) {
      navigate(`/reset-password${location.search}${location.hash}`, {
        replace: true,
      });
    }
  }, [isRecovery, location.search, location.hash, navigate]);

  if (isRecovery) {
    return (
      <main style={layout}>
        <div style={card}>
          <div style={header}>
            <span style={{ fontSize: "42px" }}>🔁</span>
            <h1 style={{ color: "#E1F5EE", margin: "8px 0 4px", fontSize: "22px" }}>
              Redirigiendo...
            </h1>
            <p style={{ color: "rgba(225,245,238,0.7)", margin: 0, fontSize: "14px" }}>
              Cargando el formulario para restablecer contraseña.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const content = () => {
    if (status === "loading") return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <h2 style={{ color: "#085041" }}>Confirmando tu cuenta...</h2>
        <p style={{ color: "#64748B" }}>Un momento por favor.</p>
      </div>
    );
    if (status === "error") return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
        <h2 style={{ color: "#DC2626" }}>Link inválido</h2>
        <p style={{ color: "#64748B" }}>{error}</p>
        <div style={{ marginTop: 18, textAlign: "left", background: "#f0faf6", padding: 12, borderRadius: 8 }}>
          <strong>Debug info (solo para diagnóstico):</strong>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, marginTop: 8 }}>
{JSON.stringify({ href: window.location.href, search: location.search, hash: location.hash, params: Object.fromEntries(new URLSearchParams(location.search)), hashParams: Object.fromEntries(new URLSearchParams(location.hash.replace(/^#/, '')))}, null, 2)}
          </pre>
          <p style={{ color: '#475569', fontSize: 12 }}>Copia la sección anterior y pégala aquí si quieres que lo inspeccione.</p>
        </div>
      </div>
    );
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "72px", marginBottom: "20px" }}>🎉</div>
        <h2 style={{ color: "#0F6E56", marginBottom: "12px" }}>¡Cuenta confirmada!</h2>
        <p style={{ color: "#334155", marginBottom: "8px" }}>Tu cuenta ha sido verificada exitosamente.</p>
        <p style={{ color: "#64748B", fontWeight: "600" }}>Regresa a la aplicación móvil e inicia sesión.</p>
      </div>
    );
  };

  return (
    <main style={layout}>
      <div style={card}>
        <div style={header}>
          <span style={{ fontSize: "42px" }}>🐾</span>
          <h1 style={{ color: "#E1F5EE", margin: "8px 0 4px", fontSize: "22px" }}>PetAdoption</h1>
          <p style={{ color: "rgba(225,245,238,0.7)", margin: 0, fontSize: "14px" }}>
            Confirmación de cuenta
          </p>
        </div>
        <div style={{ padding: "36px 32px" }}>{content()}</div>
      </div>
    </main>
  );
};

const layout: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #E1F5EE 0%, #9FE1CB 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
};

const card: CSSProperties = {
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(15,110,86,0.15)",
  width: "100%",
  maxWidth: "420px",
  overflow: "hidden",
};

const header: CSSProperties = {
  background: "linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)",
  padding: "28px 32px",
  textAlign: "center",
};
