"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Client = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
};

export default function ClienteDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setErrorMsg(null);

      // 1) sesión
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }

      // 2) traer cliente
      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, phone, email, notes, created_at")
        .eq("id", id)
        .single();

      if (error) {
        setErrorMsg(error.message);
        setClient(null);
      } else {
        setClient(data);
      }

      setLoading(false);
    };

    run();
  }, [id, router]);

  if (loading) return <p style={{ padding: 24 }}>Cargando...</p>;

  if (errorMsg) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Detalle Cliente</h1>
        <p style={{ color: "red" }}>{errorMsg}</p>
        <button onClick={() => router.push("/clientes")}>Volver</button>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Detalle Cliente</h1>
        <p>No se encontró el cliente.</p>
        <button onClick={() => router.push("/clientes")}>Volver</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <button onClick={() => router.push("/clientes")}>← Volver</button>

      <h1 style={{ marginTop: 12 }}>{client.full_name}</h1>
      <p><b>Teléfono:</b> {client.phone}</p>
      {client.email && <p><b>Email:</b> {client.email}</p>}
      {client.notes && <p><b>Notas:</b> {client.notes}</p>}
      <p style={{ fontSize: 12, marginTop: 12 }}>
        <b>Registrado:</b> {new Date(client.created_at).toLocaleString()}
      </p>
    </div>
  );
}