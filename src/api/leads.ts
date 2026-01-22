import { api } from "../lib/axios";

export type LeadOut = {
  id: number;
  reddit_id: string;
  subreddit: string;
  author: string;
  title: string;
  selftext?: string | null;
  permalink: string;
  url?: string | null;
  domain?: string | null;
  created_utc: number;
  created_datetime?: string | null;
  over_18: boolean;
  is_self: boolean;
  stickied: boolean;
  locked: boolean;
  spoiler: boolean;
  link_flair_text?: string | null;
  distinguished?: string | null;
  removed_by_category?: string | null;
  upvote_ratio?: number | null;
  score: number; // Reddit's score
  num_comments: number;
  fetched_at?: string | null;
  updated_at?: string | null;
  lead_score: number; // Our computed lead score
  is_lead: boolean; // Lead classification status
  lead_tag?: string | null; // Specific lead classification tag
};

export type LeadsResponse = {
  data: LeadOut[];
  pagination: {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};

export type LeadsSummaryResponse = {
  total_leads: number;
  lead_tag_counts: Record<string, number>;
};

export type GenerateReplyResponse = {
  post_id: number;
  reply_text: string;
  generated_at: string;
  status: string;
};

export const LeadsApi = {
  list: async (page: number = 1, limit: number = 20) =>
    (await api.get<LeadsResponse>(`/reddit/leads?page=${page}&limit=${limit}`))
      .data,

  summary: async () =>
    (await api.get<LeadsSummaryResponse>(`/reddit/leads/summary`)).data,

  generateReply: async (postId: number) =>
    (
      await api.get<GenerateReplyResponse>(
        `/reddit/leads/generate-reply?post_id=${postId}`
      )
    ).data,
};
