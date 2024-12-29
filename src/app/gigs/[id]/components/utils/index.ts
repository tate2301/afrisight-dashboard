import apiClient from "@/hooks/useApiFetcher";
import { FormState } from "../types";

const isLink = (value: string) =>
    value.startsWith('http') || value.startsWith('file:');

const isEmail = (value: string) => value.includes('@');

const PATCH_GIG = (id: string) => `/survey/${id}`;

const patchGig = async (_id: string, data: FormState) =>
    apiClient.put(PATCH_GIG(_id), data);

export { isLink, isEmail, patchGig }