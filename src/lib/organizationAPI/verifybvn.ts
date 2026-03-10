import apiClient from "@/lib/apiClient";

export interface BvnVerificationPayload {
  bvn: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // YYYY-MM-DD
}

export interface BvnVerificationResult {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
}

export async function verifyBvn(
  payload: BvnVerificationPayload
): Promise<BvnVerificationResult> {
  const response = await apiClient.post("/organizations/verify-bvn", payload);
  const data = response.data?.data;
  return {
    firstName: data?.firstName ?? "",
    lastName: data?.lastName ?? "",
    birthDate: data?.birthDate ?? "",
    gender: data?.gender ?? "",
  };
}