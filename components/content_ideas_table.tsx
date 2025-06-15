"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Columns3, RefreshCcw, SearchIcon } from "lucide-react";

type ContentIdea = {
  ID: number;
  Title: string | null;
  Status: string | null;
  Transcript: string | null;
  FB: string | null;
  Vimeo: string | null;
  Blog_Link: string | null;
  Blog_Post_Doc: string | null;
  MKH_Posts: string | null;
  Brain_Tags: string | null;
  Content_Process: string | null;
  YouTube: string | null;
  Channel: string | null;
  Visual_Assets: string | null;
  Format: string | null;
  Tags2: string | null;
  Related_Content: string | null;
  Slides: string | null;
  Notes: string | null;
  Image: string | null;
  Course: string | null;
  Final_Draft: string | null;
  Rating: string | null;
  Chat_GPT: string | null;
};

const columns: ColumnDef<ContentIdea>[] = [
  {
    accessorKey: "Title",
    header: "Title",
  },
  {
    accessorKey: "Status",
    header: "Status",
  },
  {
    accessorKey: "Transcript",
    header: "Transcript",
  },
  {
    accessorKey: "FB",
    header: "FB",
  },
  {
    accessorKey: "Vimeo",
    header: "Vimeo",
  },
  {
    accessorKey: "Blog_Link",
    header: "Blog Link",
  },
  {
    accessorKey: "Blog_Post_Doc",
    header: "Blog Post Doc",
  },
  {
    accessorKey: "MKH_Posts",
    header: "MKH Posts",
  },
  {
    accessorKey: "Brain_Tags",
    header: "🧠 Tags",
  },
  {
    accessorKey: "Content_Process",
    header: "Content Process",
  },
  {
    accessorKey: "YouTube",
    header: "YouTube",
  },
  {
    accessorKey: "Channel",
    header: "Channel",
  },
  {
    accessorKey: "Visual_Assets",
    header: "Visual Assets",
  },
  {
    accessorKey: "Format",
    header: "Format",
  },
  {
    accessorKey: "Tags2",
    header: "Tags2",
  },
  {
    accessorKey: "Related_Content",
    header: "Related Content",
  },
  {
    accessorKey: "Slides",
    header: "Slides",
  },
  {
    accessorKey: "Notes",
    header: "Notes",
  },
  {
    accessorKey: "Image",
    header: "Image",
  },
  {
    accessorKey: "Course",
    header: "Course",
  },
  {
    accessorKey: "Final_Draft",
    header: "Final Draft",
  },
  {
    accessorKey: "Rating",
    header: "Rating",
  },
  {
    accessorKey: "Chat_GPT",
    header: "Chat GPT",
  },
  {
    accessorKey: "ID",
    header: "ID",
  },
];

export default function ContentIdeasTable() {
  const [data, setData] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      const { data: ideas, error } = await supabase
        .from("content_ideas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching content ideas:", JSON.stringify(error));
        setData([]);
      } else if (isMounted) {
        setData(ideas || []);
      }
      setLoading(false);
    }
    fetchData();

    // Setup real-time subscription
    const subscription = supabase
      .channel("public:content-ideas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content-ideas" },
        (payload) => {
          // Refetch data on any change
          fetchData();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Search title or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            table.getColumn("title")?.setFilterValue(e.target.value);
            table.getColumn("description")?.setFilterValue(e.target.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Columns3 /> Columns <ChevronDown className="ml-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  className="capitalize"
                  onClick={() => column.toggleVisibility(!column.getIsVisible())}
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    readOnly
                    className="mr-2"
                  />
                  {column.id}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.resetColumnVisibility();
                setSearchQuery("");
              }}
            >
              <RefreshCcw /> Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header instanceof Function
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell instanceof Function
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.column.columnDef.cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
