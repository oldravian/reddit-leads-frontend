import { api } from "../lib/axios";

export type MeetingOut = {
  id: number;
  title: string;
  start_ts: string;
  end_ts?: string | null;
  transcript?: unknown;
  chat_messages?: unknown;
};

export const MeetingsApi = {
  list: async () => (await api.get<MeetingOut[]>("/meetings")).data,
  get: async (id: number) =>
    (await api.get<MeetingOut>(`/meetings/${id}`)).data,
};
