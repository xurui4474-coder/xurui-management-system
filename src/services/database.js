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

function missingColumnName(error) {
  const message = error?.message || "";
  const match = message.match(/Could not find the '([^']+)' column/);
  return match?.[1] || "";
}

async function writeWeeklyReview(operation) {
  let payload = reviewToDb(operation.review);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      const query = operation.id
        ? supabase.from("weekly_reviews").update(payload).eq("id", operation.id).select().single()
        : supabase.from("weekly_reviews").insert(payload).select().single();
      const row = await run(query);
      return reviewFromDb(row);
    } catch (error) {
      const column = missingColumnName(error);
      if (!column || !(column in payload)) throw error;
      payload = { ...payload };
      delete payload[column];
      console.warn(`weekly_reviews 缺少 ${column} 字段，已自动跳过该字段写入。`, error);
    }
  }

  throw new Error("周度复盘写入失败，请检查 weekly_reviews 表字段");
}

async function writeProduct(operation) {
  let payload = productToDb(operation.product);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      const query = operation.id
        ? supabase.from("products").update(payload).eq("id", operation.id).select().single()
        : supabase.from("products").insert(payload).select().single();
      const row = await run(query);
      return productFromDb(row);
    } catch (error) {
      const column = missingColumnName(error);
      if (!column || !(column in payload)) throw error;
      payload = { ...payload };
      delete payload[column];
      console.warn(`products 缺少 ${column} 字段，已自动跳过该字段写入。`, error);
    }
  }

  throw new Error("选品写入失败，请检查 products 表字段");
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
  const row = await run(supabase.from("tasks").insert(taskToDb(task)).select().single());
  return taskFromDb(row);
}

export async function updateTask(id, patch) {
  assertClient();
  const row = await run(supabase.from("tasks").update(taskToDb(patch)).eq("id", id).select().single());
  return taskFromDb(row);
}

export async function deleteTask(id) {
  assertClient();
  return run(supabase.from("tasks").delete().eq("id", id));
}

export async function insertProduct(product) {
  assertClient();
  return writeProduct({ product });
}

export async function updateProduct(id, patch) {
  assertClient();
  return writeProduct({ id, product: patch });
}

export async function deleteProduct(id) {
  assertClient();
  return run(supabase.from("products").delete().eq("id", id));
}

export async function insertReview(review) {
  assertClient();
  return writeWeeklyReview({ review });
}

export async function updateReview(id, patch) {
  assertClient();
  return writeWeeklyReview({ id, review: patch });
}

export async function deleteReview(id) {
  assertClient();
  return run(supabase.from("weekly_reviews").delete().eq("id", id));
}

export async function updateMetric(id, patch) {
  assertClient();
  const row = await run(supabase.from("metrics").update(metricToDb(patch)).eq("id", id).select().single());
  return metricFromDb(row);
}
