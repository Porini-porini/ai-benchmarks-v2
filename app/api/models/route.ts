import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import type { AIModel } from "@/lib/types";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sort   = searchParams.get("sort")   ?? "intelligence";
  const limit  = Math.min(parseInt(searchParams.get("limit") ?? "200", 10), 300);
  const search = searchParams.get("q") ?? null;

  const allowed = ["intelligence","value_score","price_blended","output_speed","coding","math"];
  if (!allowed.includes(sort)) {
    return NextResponse.json({ error: "Invalid sort" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseClient();
    let query = supabase.from("ai_models").select("*", { count: "exact" }).limit(limit);

    if (search) query = query.ilike("name", `%${search}%`);

    const ascending = sort === "price_blended";
    query = query.order(sort, { ascending, nullsFirst: false });

    const { data, error, count } = await query;
    if (error) throw error;

    const { data: meta } = await supabase
      .from("pipeline_meta").select("*").eq("id", "latest_run").maybeSingle();

    return NextResponse.json(
      { models: data ?? [], total: count ?? 0, meta },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
