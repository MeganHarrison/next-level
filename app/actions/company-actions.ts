"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Tables, TablesInsert } from "@/types/database.types"

type Company = Tables<"companies">
type CompanyInsert = TablesInsert<"companies">

export async function getCompanies(): Promise<Company[]> {
  const supabase = await createClient()

  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching companies:", error)
    return []
  }

  return companies || []
}

export async function createCompany(formData: FormData) {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const companyData: CompanyInsert = {
    name: formData.get("name") as string,
    industry: (formData.get("industry") as string) || null,
    website: (formData.get("website") as string) || null,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    address: (formData.get("address") as string) || null,
    city: (formData.get("city") as string) || null,
    state: (formData.get("state") as string) || null,
    country: (formData.get("country") as string) || null,
    postal_code: (formData.get("postal_code") as string) || null,
    employee_count: formData.get("employee_count") ? Number.parseInt(formData.get("employee_count") as string) : null,
    annual_revenue: formData.get("annual_revenue") ? Number.parseFloat(formData.get("annual_revenue") as string) : null,
    status: (formData.get("status") as string) || "active",
    notes: (formData.get("notes") as string) || null,
    user_id: user.id,
  }

  const { error } = await supabase.from("companies").insert(companyData)

  if (error) {
    console.error("Error creating company:", error)
    throw new Error("Failed to create company")
  }

  revalidatePath("/companies-db")
  return { success: true }
}

export async function updateCompany(id: string, formData: FormData) {
  const supabase = await createClient()

  const updateData: Partial<Company> = {
    name: formData.get("name") as string,
    industry: (formData.get("industry") as string) || null,
    website: (formData.get("website") as string) || null,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    address: (formData.get("address") as string) || null,
    city: (formData.get("city") as string) || null,
    state: (formData.get("state") as string) || null,
    country: (formData.get("country") as string) || null,
    postal_code: (formData.get("postal_code") as string) || null,
    employee_count: formData.get("employee_count") ? Number.parseInt(formData.get("employee_count") as string) : null,
    annual_revenue: formData.get("annual_revenue") ? Number.parseFloat(formData.get("annual_revenue") as string) : null,
    status: formData.get("status") as string,
    notes: (formData.get("notes") as string) || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("companies").update(updateData).eq("id", id)

  if (error) {
    console.error("Error updating company:", error)
    throw new Error("Failed to update company")
  }

  revalidatePath("/companies-db")
  return { success: true }
}

export async function deleteCompany(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("companies").delete().eq("id", id)

  if (error) {
    console.error("Error deleting company:", error)
    throw new Error("Failed to delete company")
  }

  revalidatePath("/companies-db")
  return { success: true }
}
