"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NuevoClientePage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setErrorMsg(null);

    // Validación mínima
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Nombre y teléfono son obligatorios.");
      return;
    }

    setSaving(true);

    // 1) Revisar sesión
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      router.replace("/login");
      return;
    }

    // 2) Insertar cliente
    const { error } = await supabase.from("clients").insert({
    full_name: fullName.trim(),
    phone: phone.trim(),
    email: email.trim() || null,
    notes: notes.trim() || null,
    });

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // 3) Volver al listado
    router.push("/clientes");
  };

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1>Nuevo Cliente</h1>

      {errorMsg && (
        <p style={{ color: "red", marginTop: 10 }}>{errorMsg}</p>
      )}

      <div style={{ marginTop: 16 }}>
        <label>Nombre completo *</label>
        <input
          style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label>Teléfono *</label>
        <input
          style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 0999999999"
        />
      </div>


      <div style={{ marginTop: 16 }}>
        <label>Email (opcional)</label>
        <input
            style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: correo@email.com"
        />
        </div>

        <div style={{ marginTop: 16 }}>
        <label>Notas (opcional)</label>
        <textarea
            style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas adicionales..."
        />
        </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <button onClick={() => router.push("/clientes")}>Cancelar</button>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}