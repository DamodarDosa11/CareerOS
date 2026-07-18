"use client";
import { useState, useEffect, useCallback } from "react";

export function useAppState() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/state")
      .then((r) => r.json())
      .then((data) => {
        setState(data);
        setLoading(false);
      });
  }, []);

  const patch = useCallback(async (partial) => {
    const res = await fetch("/api/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    const next = await res.json();
    setState(next);
    return next;
  }, []);

  return { state, setState, patch, loading };
}
