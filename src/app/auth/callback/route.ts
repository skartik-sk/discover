import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Use NEXT_PUBLIC_SITE_URL if available, otherwise use request origin
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Handle cookie setting errors in middleware
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options });
            } catch (error) {
              // Handle cookie removal errors in middleware
            }
          },
        },
      },
    );

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(
          `${origin}/auth/signin?error=${encodeURIComponent(error.message)}`,
        );
      }

      // Get the authenticated user
      const user = data?.user;

      if (user) {
        // Check if user exists in our users table
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (!existingUser) {
          // Generate unique username from email
          let username = user.email?.split("@")[0] || "user";
          let finalUsername = username;
          let counter = 1;

          // Ensure username is unique
          while (true) {
            const { data: usernameCheck } = await supabase
              .from("users")
              .select("username")
              .eq("username", finalUsername)
              .single();

            if (!usernameCheck) break;

            finalUsername = `${username}${counter}`;
            counter++;
          }

          // Create new user in our database
          const { error: insertError } = await supabase.from("users").insert({
            auth_id: user.id,
            email: user.email,
            display_name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split("@")[0],
            username: finalUsername,
            avatar_url:
              user.user_metadata?.avatar_url || user.user_metadata?.picture,
            bio: "",
            role: "submitter",
            is_active: true,
          });

          if (insertError) {
            console.error("Error creating user in database:", insertError);
            // Continue anyway - user might exist with different lookup
          }
        } else {
          // Update avatar if it changed (Google profile picture)
          const newAvatar =
            user.user_metadata?.avatar_url || user.user_metadata?.picture;
          if (newAvatar && newAvatar !== existingUser.avatar_url) {
            await supabase
              .from("users")
              .update({ avatar_url: newAvatar })
              .eq("auth_id", user.id);
          }
        }
      }

      // Redirect to dashboard after successful auth
      return NextResponse.redirect(`${origin}/dashboard`);
    } catch (error) {
      console.error("Unexpected auth callback error:", error);
      return NextResponse.redirect(
        `${origin}/auth/signin?error=Authentication%20failed`,
      );
    }
  }

  // Redirect to sign in if no code
  return NextResponse.redirect(`${origin}/auth/signin`);
}
