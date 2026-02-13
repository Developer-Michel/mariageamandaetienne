"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import type { Participant } from "./db-models";

type GuestContextType = {
  guestToken: string | null;
  guestName: string | null;
  participant: Participant | null;
  loading: boolean;
  error: string | null;
  hasInvite: boolean;
};

const GuestContext = createContext<GuestContextType>({
  guestToken: null,
  guestName: null,
  participant: null,
  loading: false,
  error: null,
  hasInvite: false,
});

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("id") || params.get("token");

    if (!token) {
      setError("Lien invalide : utilisez votre URL personnalisée.");
      return;
    }

    const fetchGuest = async () => {
      setLoading(true);
      setError(null);
      setGuestToken(token);

      const { data, error } = await supabase
        .from("awnsers")
        .select("*")
        .eq("id", token)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setParticipant(null);
        setGuestName(null);
      } else if (!data) {
        setError("Invitation introuvable pour ce lien.");
        setParticipant(null);
        setGuestName(null);
      } else {
        const mapped: Participant = {
          ...data,
          accompanists:
            (data.accompanists as Participant["accompanists"]) || [],
        };
        setParticipant(mapped);
        setGuestName(mapped.full_name);
      }

      setLoading(false);
    };

    fetchGuest();
  }, []);

  const hasInvite = !!participant && !error;

  return (
    <GuestContext.Provider
      value={{ guestToken, guestName, participant, loading, error, hasInvite }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  return useContext(GuestContext);
}
