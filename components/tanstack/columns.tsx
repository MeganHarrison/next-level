import { ColumnDef } from "@tanstack/react-table"
import type { Tables } from "@/types/supabase"

type ContentIdea = Tables<'content_ideas'>

export const columns: ColumnDef<ContentIdea>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "Title", header: "Title" },
  { accessorKey: "Status", header: "Status" },
  { accessorKey: "Transcript", header: "Transcript" },
  { accessorKey: "FB", header: "Facebook" },
  { accessorKey: "Vimeo", header: "Vimeo" },
  {
    accessorFn: (row) => row["Blog Link"],
    id: "Blog Link",
    header: "Blog Link"
  },
  {
    accessorFn: (row) => row["Blog Post Doc"],
    id: "Blog Post Doc",
    header: "Blog Post Doc"
  },
  {
    accessorFn: (row) => row["MKH Posts"],
    id: "MKH Posts",
    header: "MKH Posts"
  },
  {
    accessorFn: (row) => row["🤖 Tags"],
    id: "🤖 Tags",
    header: "Tags 🤖"
  },
  {
    accessorFn: (row) => row["Content Process"],
    id: "Content Process",
    header: "Content Process"
  },
  { accessorKey: "YouTube", header: "YouTube" },
  { accessorKey: "Channel", header: "Channel" },
  { accessorKey: "Visual Assets", header: "Visual Assets" },
  { accessorKey: "Format", header: "Format" },
  { accessorKey: "Tags2", header: "Tags 2" },
  {
    accessorFn: (row) => row["Related Content"],
    id: "Related Content",
    header: "Related Content"
  },
  {
    accessorFn: (row) => row["Slides"],
    id: "Slides",
    header: "Slides"
  },
  { accessorKey: "Notes", header: "Notes" },
  { accessorKey: "Image", header: "Image" },
  { accessorKey: "Course", header: "Course" },
  {
    accessorFn: (row) => row["Final Draft"],
    id: "Final Draft",
    header: "Final Draft"
  },
  { accessorKey: "Rating", header: "Rating" },
  {
    accessorFn: (row) => row["Chat GPT"],
    id: "Chat GPT",
    header: "Chat GPT"
  },
  {
    accessorFn: (row) => row["Premiere Pro Link"],
    id: "Premiere Pro Link",
    header: "Premiere Pro Link"
  }
]