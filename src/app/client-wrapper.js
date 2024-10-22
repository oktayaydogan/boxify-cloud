"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase/client";

export default function ClientWrapper({ children }) {
	return (
		<SessionContextProvider supabaseClient={supabase}>
			{children}
		</SessionContextProvider>
	);
}
