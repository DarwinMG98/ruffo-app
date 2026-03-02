"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Client = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
};

export default function ClientesPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      // 1) Revisar sesión
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }

      // 2) Traer clientes
      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, phone, email, notes, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando clientes:", error.message);
      } else {
        setClients(data ?? []);
      }

      setLoading(false);
    };

    run();
  }, [router]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Clientes</h1>
            <button onClick={() => router.push("/clientes/nuevo")}>
                Nuevo Cliente
            </button>
        </div>

      {clients.length === 0 ? (
        <p>No tienes clientes aún.</p>
      ) : (
        <ul>
          {clients.map((c) => (
            <li key={c.id} style={{ marginBottom: 12 }}>
            <div>
            <button
                onClick={() => router.push(`/clientes/${c.id}`)}
                style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: "bold",
                }}
            >
                {c.full_name}
            </button>{" "}
            - {c.phone}
            </div>
            {c.email && <div style={{ fontSize: 13 }}>Email: {c.email}</div>}
            {c.notes && <div style={{ fontSize: 13 }}>Notas: {c.notes}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}