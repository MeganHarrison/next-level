"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Tables, TablesInsert } from "@/types/database.types"

// Type aliases for easier usage
type Project = Tables<"projects">
type ProjectInsert = TablesInsert<"projects">

export async function getProjects(): Promise<{ projects: Project[]; error: string | null }> {
  const supabase = createClient()

  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { projects: [], error: error.message }
    }

    return { projects: projects || [], error: null }
  } catch (err) {
    console.error("Unexpected error fetching projects:", err)
    return { projects: [], error: "Failed to fetch projects" }
  }
}

export async function createProject(formData: FormData) {
  const supabase = createClient()

  const projectData: Omit<ProjectInsert, "id" | "created_at" | "updated_at" | "user_id"> = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    client: formData.get("client") as string,
    status: formData.get("status") as string,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
  }

  const { error } = await supabase.from("projects").insert(projectData)

  if (error) {
    console.error("Error creating project:", error)
    throw new Error("Failed to create project")
  }

  revalidatePath("/projects-db")
  redirect("/projects-db")
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient()

  const projectData: Partial<Project> = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    client: formData.get("client") as string,
    status: formData.get("status") as string,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("projects").update(projectData).eq("id", id)

  if (error) {
    console.error("Error updating project:", error)
    throw new Error("Failed to update project")
  }

  revalidatePath("/projects-db")
}

export async function deleteProject(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("Error deleting project:", error)
    throw new Error("Failed to delete project")
  }

  revalidatePath("/projects-db")
}
