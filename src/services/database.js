import { supabase } from "../lib/supabase";
import { metricFromDb, metricToDb, productFromDb, productToDb, reviewFromDb, reviewToDb, taskFromDb, taskToDb } from "./mappers";

function assertClient() {
  if (!supabase) throw new Error("Supabase 尚未配置，请先填写 .env");
}

async function run(query) {
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function loadAllData() {
  assertClient();
  const [tasks, products, reviews, metrics] = await Promise.all([
    run(supabase.from("tasks").select("*").order("created_at", { ascending: true })),
    run(supabase.from("products").select("*").order("created_at", { ascending: true })),
    run(supabase.from("weekly_reviews").select("*").order("created_at", { ascending: true })),
    run(supabase.from("metrics").select("*").order("created_at", { ascending: true })),
  ]);

  return {
    tasks: tasks.map(taskFromDb),
    products: products.map(productFromDb),
    reviews: reviews.map(reviewFromDb),
    metrics: metrics.map(metricFromDb),
  };
}

export async function insertTask(task) {
  assertClient();
  return run(supabase.from("tasks").insert(taskToDb(task)).select().single());
}

export async function updateTask(id, patch) {
  assertClient();
  return run(supabase.from("tasks").update(taskToDb(patch)).eq("id", id).select().single());
}

export async function deleteTask(id) {
  assertClient();
  return run(supabase.from("tasks").delete().eq("id", id));
}

export async function insertProduct(product) {
  assertClient();
  return run(supabase.from("products").insert(productToDb(product)).select().single());
}

export async function updateProduct(id, patch) {
  assertClient();
  return run(supabase.from("products").update(productToDb(patch)).eq("id", id).select().single());
}

export async function deleteProduct(id) {
  assertClient();
  return run(supabase.from("products").delete().eq("id", id));
}

export async function insertReview(review) {
  assertClient();
  return run(supabase.from("weekly_reviews").insert(reviewToDb(review)).select().single());
}

export async function updateReview(id, patch) {
  assertClient();
  return run(supabase.from("weekly_reviews").update(reviewToDb(patch)).eq("id", id).select().single());
}

export async function deleteReview(id) {
  assertClient();
  return run(supabase.from("weekly_reviews").delete().eq("id", id));
}

export async function updateMetric(id, patch) {
  assertClient();
  return run(supabase.from("metrics").update(metricToDb(patch)).eq("id", id).select().single());
}
