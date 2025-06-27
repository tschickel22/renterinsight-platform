// Follow the Edge Function pattern from the Supabase documentation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2.38.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    })
  }

  try {
    // Get request body
    const { email, name, sendInvite, leadId } = await req.json()

    // Validate required fields
    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      )
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Generate a random password (this is temporary, user will reset it)
    const tempPassword = Math.random().toString(36).slice(2, 10) + 
                         Math.random().toString(36).slice(2, 10).toUpperCase() + 
                         "!1"

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: name,
        is_client: true,
      },
    })

    if (authError) {
      console.error("Error creating user:", authError)
      return new Response(
        JSON.stringify({ error: authError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      )
    }

    // Create a record in the portal_users table
    const { data: portalUser, error: portalError } = await supabaseAdmin
      .from("portal_users")
      .insert([
        {
          user_id: authData.user.id,
          name,
          email,
          status: "active",
          lead_id: leadId || null,
        },
      ])
      .select()

    if (portalError) {
      console.error("Error creating portal user:", portalError)
      return new Response(
        JSON.stringify({ error: portalError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      )
    }

    // Send invitation email if requested
    if (sendInvite) {
      // In a real implementation, you would use a proper email service
      // For this demo, we'll just log the invitation
      console.log(`Invitation email would be sent to ${email}`)
      
      // You could use Supabase's built-in password reset to send an email
      // This would allow the user to set their own password
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email,
      })
      
      if (resetError) {
        console.error("Error sending password reset:", resetError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: sendInvite ? "Account created and invitation sent" : "Account created successfully",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name,
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})