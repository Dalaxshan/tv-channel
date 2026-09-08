import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/admin";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data }, { status });
}

export function apiError(
  message: string,
  status = 400,
  fieldErrors?: Record<string, string>
) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status }
  );
}
