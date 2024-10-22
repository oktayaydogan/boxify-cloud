import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithGoogle = async () => {
	//supabase.auth.signInWithOAuth({ provider: "google" });

	const { error } = await supabase.auth.signInWithOAuth({
		provider: "google",
	});

	if (error) {
		console.error("Google ile oturum açarken bir hata oluştu:", error.message);
	}

	return error;
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error("Çıkış yaparken bir hata oluştu:", error.message);
	}
	return error;
};
