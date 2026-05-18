import { useState } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useRegister } from "@/features/auth/model/useRegister";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valError, setValError] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);

  const { register, status, error } = useRegister();

  const handleSubmit = async () => {
    setDidSubmit(true);
    setValError("");

    if (!email || !password || !confirm) {
      setValError("Completa todos los campos.");
      return;
    }

    if (password.length < 8) {
      setValError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirm) {
      setValError("Las contraseñas no coinciden.");
      return;
    }

    await register(email, password);
  };

  const content = () => {
    if (status === "loading") {
      return (
        <p
          style={{
            textAlign: "center",
            color: "#64748B",
          }}
        >
          Creando tu cuenta...
        </p>
      );
    }

    if (status === "success") {
      return (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "64px",
              marginBottom: "16px",
            }}
          >
            📬
          </div>

          <h3
            style={{
              color: "#059669",
              marginBottom: "8px",
            }}
          >
            ¡Revisa tu email!
          </h3>

          <p style={{ color: "#64748B", marginBottom: "8px" }}>
            Te enviamos un link de confirmación a{" "}
            <strong>{email}</strong>.
          </p>

          <p style={{ color: "#64748B" }}>
            Confirma tu cuenta para poder iniciar sesión.
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="tu@correo.com"
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Mínimo 8 caracteres"
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repite tu contraseña"
        />

        {(valError || (didSubmit && error)) && (
          <p
            style={{
              color: "#DC2626",
              fontSize: "14px",
              margin: 0,
            }}
          >
            {valError || (didSubmit ? error : null)}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          isLoading={status === "loading"}
        >
          Crear cuenta
        </Button>
      </div>
    );
  };

  return (
    <main style={layout}>
      <div style={card}>
        <div style={header}>
          <span style={{ fontSize: "42px" }}>
            ✨
          </span>

          <h1
            style={{
              color: "#fff",
              margin: "8px 0 4px",
              fontSize: "22px",
            }}
          >
            Crear cuenta
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              margin: 0,
              fontSize: "14px",
            }}
          >
            ESFOT Auth — Únete ahora
          </p>
        </div>

        <div style={{ padding: "36px 32px" }}>
          {content()}
        </div>
      </div>
    </main>
  );
};

const layout: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #F0F4FF 0%, #E0EAFF 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
};

const card: CSSProperties = {
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(27,58,107,0.15)",
  width: "100%",
  maxWidth: "420px",
  overflow: "hidden",
};

const header: CSSProperties = {
  background:
    "linear-gradient(135deg, #1B3A6B 0%, #2563EB 100%)",
  padding: "28px 32px",
  textAlign: "center",
};
