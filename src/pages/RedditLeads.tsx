import { useEffect, useState } from "react";
import {
  LeadsApi,
  type LeadOut,
  type LeadsSummaryResponse,
} from "../api/leads";
import ComponentCard from "../components/common/ComponentCard";
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import {
  GroupIcon,
  BoxIconLine,
  TimeIcon,
  UserIcon,
  TaskIcon,
  BoltIcon,
  DollarLineIcon,
  LockIcon,
  CalenderIcon,
  DocsIcon,
  MailIcon,
  CopyIcon,
} from "../icons";

export default function RedditLeads() {
  const [leads, setLeads] = useState<LeadOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [summary, setSummary] = useState<LeadsSummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [generatedReply, setGeneratedReply] = useState("");
  const [generatingReply, setGeneratingReply] = useState(false);

  // Lead tag descriptions mapping
  const leadTagDescriptions: Record<string, string> = {
    diagnosis_confirmation:
      "asking if they have a specific infection, wants a yes or no.",
    test_guidance:
      "asking which test or screen to book, swab, blood, or urine.",
    clinic_recommendation:
      "asking where to get tested, nearby clinics, or booking steps.",
    help_request: "asking what to do next, seeking professional direction.",
    result_interpretation:
      "has results, asks what they mean or whether to retest.",
    window_period: "asks when a test will be accurate after exposure.",
    retest_followup:
      "after treatment or a negative result, asks what to test now.",
    partner_risk:
      "asks about infecting or being infected by a partner, testing for both.",
    site_specific_testing:
      "asks about throat, rectal, vaginal, or urethral testing sites.",
    urgent_exposure:
      "very recent exposure, asks about immediate testing or PEP.",
    pricing_turnaround:
      "asks about cost, same day appointments, or result speed.",
    home_test_preference: "asks for home sample kits or discreet testing.",
    travel_testing: "needs testing before travel or for requirements.",
    vaccination_request: "asks where to get Hep A, Hep B, or HPV vaccines.",
  };

  // Lead tag color mapping based on urgency and type
  const getTagColors = (tag: string): string => {
    const colorMap: Record<string, string> = {
      // High urgency - Red tones
      urgent_exposure:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
      diagnosis_confirmation:
        "bg-red-50 text-red-700 dark:bg-red-900/10 dark:text-red-300 border-red-100 dark:border-red-700",

      // Medical results/interpretation - Orange tones
      result_interpretation:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      window_period:
        "bg-orange-50 text-orange-700 dark:bg-orange-900/10 dark:text-orange-300 border-orange-100 dark:border-orange-700",

      // Guidance/Help - Blue tones
      test_guidance:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      help_request:
        "bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-300 border-blue-100 dark:border-blue-700",

      // Location/Clinic - Purple tones
      clinic_recommendation:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      site_specific_testing:
        "bg-purple-50 text-purple-700 dark:bg-purple-900/10 dark:text-purple-300 border-purple-100 dark:border-purple-700",

      // Partner/Risk - Pink tones
      partner_risk:
        "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400 border-pink-200 dark:border-pink-800",

      // Follow-up/Retest - Green tones
      retest_followup:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",

      // Prevention/Vaccination - Emerald tones
      vaccination_request:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",

      // Practical/Logistics - Indigo tones
      pricing_turnaround:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      home_test_preference:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/10 dark:text-indigo-300 border-indigo-100 dark:border-indigo-700",

      // Travel - Teal tones
      travel_testing:
        "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    };

    return (
      colorMap[tag] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"
    );
  };

  // Get icon background colors for stats cards (darker versions)
  const getIconBgColors = (tag: string): string => {
    const iconColorMap: Record<string, string> = {
      // High urgency - Red tones
      urgent_exposure: "bg-red-500 dark:bg-red-600",
      diagnosis_confirmation: "bg-red-400 dark:bg-red-500",

      // Medical results/interpretation - Orange tones
      result_interpretation: "bg-orange-500 dark:bg-orange-600",
      window_period: "bg-orange-400 dark:bg-orange-500",

      // Guidance/Help - Blue tones
      test_guidance: "bg-blue-500 dark:bg-blue-600",
      help_request: "bg-blue-400 dark:bg-blue-500",

      // Location/Clinic - Purple tones
      clinic_recommendation: "bg-purple-500 dark:bg-purple-600",
      site_specific_testing: "bg-purple-400 dark:bg-purple-500",

      // Partner/Risk - Pink tones
      partner_risk: "bg-pink-500 dark:bg-pink-600",

      // Follow-up/Retest - Green tones
      retest_followup: "bg-green-500 dark:bg-green-600",

      // Prevention/Vaccination - Emerald tones
      vaccination_request: "bg-emerald-500 dark:bg-emerald-600",

      // Practical/Logistics - Indigo tones
      pricing_turnaround: "bg-indigo-500 dark:bg-indigo-600",
      home_test_preference: "bg-indigo-400 dark:bg-indigo-500",

      // Travel - Teal tones
      travel_testing: "bg-teal-500 dark:bg-teal-600",
    };

    return iconColorMap[tag] || "bg-gray-500 dark:bg-gray-600";
  };

  // Get appropriate icon for each tag type
  const getTagIcon = (tag: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      // High urgency - Alert/Warning icons
      urgent_exposure: BoltIcon, // Lightning bolt for urgency
      diagnosis_confirmation: DocsIcon, // Document for diagnosis confirmation

      // Medical results/interpretation - Info/Document icons
      result_interpretation: DocsIcon, // Document for interpreting results
      window_period: TimeIcon, // Clock for timing-related

      // Guidance/Help - Info/Task icons
      test_guidance: TaskIcon, // Task icon for test guidance
      help_request: TaskIcon, // Task icon for help requests

      // Location/Clinic - Location icons (using MailIcon as closest to location)
      clinic_recommendation: MailIcon, // Mail/location-like for clinics
      site_specific_testing: BoxIconLine, // Box for specific sites

      // Partner/Risk - User icons
      partner_risk: UserIcon, // User icon for partner-related

      // Follow-up/Retest - Check icons
      retest_followup: TaskIcon, // Task icon for follow-up actions

      // Prevention/Vaccination - Shield/Protection (using LockIcon)
      vaccination_request: LockIcon, // Lock icon for protection/prevention

      // Practical/Logistics - Dollar/Calendar icons
      pricing_turnaround: DollarLineIcon, // Dollar for pricing
      home_test_preference: LockIcon, // Lock for privacy/home testing

      // Travel - Calendar for scheduling
      travel_testing: CalenderIcon, // Calendar for travel requirements
    };

    return iconMap[tag] || BoxIconLine;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Reply copied to clipboard!");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Reply copied to clipboard!");
    }
  };

  useEffect(() => {
    loadInitialLeads();
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      const summaryData = await LeadsApi.summary();
      setSummary(summaryData);
    } catch (err: any) {
      console.error("Failed to load summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const loadInitialLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await LeadsApi.list(1, 20);
      console.log("/reddit/leads response:", response);
      setLeads(response.data ?? []);
      setCurrentPage(1);
      setHasMore(response.pagination?.has_next ?? false);
    } catch (err: any) {
      console.error("/reddit/leads error:", err);
      setError(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreLeads = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await LeadsApi.list(nextPage, 20);
      console.log(`/reddit/leads page ${nextPage} response:`, response);

      // Append new leads to existing ones
      setLeads((prevLeads) => [...prevLeads, ...(response.data ?? [])]);
      setCurrentPage(nextPage);
      setHasMore(response.pagination?.has_next ?? false);
    } catch (err: any) {
      console.error("/reddit/leads load more error:", err);
      setError(err.message || "Failed to load more leads");
    } finally {
      setLoadingMore(false);
    }
  };

  const truncateText = (text: string, maxWords: number = 200): string => {
    const words = text.split(/\s+/);
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      return `${day} ${month}, ${year} ${hours}:${minutes}${ampm}`;
    } catch {
      return "—";
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return "text-red-600 dark:text-red-400"; // High priority
    if (score >= 50) return "text-orange-600 dark:text-orange-400"; // Medium priority
    if (score >= 30) return "text-yellow-600 dark:text-yellow-400"; // Low priority
    return "text-gray-600 dark:text-gray-400"; // Not a lead
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 70) return "HIGH PRIORITY";
    if (score >= 50) return "MEDIUM PRIORITY";
    if (score >= 30) return "LOW PRIORITY";
    return "NOT A LEAD";
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {/* Total Leads Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="mt-5">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Leads
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {summaryLoading ? "..." : summary?.total_leads || 0}
            </h4>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Reddit posts considered as leads
            </p>
          </div>
        </div>

        {/* Dynamic Lead Tag Cards - Show ALL tags except exclusion tags */}
        {summary?.lead_tag_counts &&
          Object.entries(summary.lead_tag_counts)
            .filter(([tag]) => !tag.startsWith("exclude_")) // Exclude all "exclude_" tags
            .sort(([, a], [, b]) => b - a) // Sort by count descending
            .map(([tag, count]) => (
              <div
                key={tag}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl ${getIconBgColors(
                    tag
                  )}`}
                >
                  {(() => {
                    const IconComponent = getTagIcon(tag);
                    return (
                      <IconComponent
                        className="text-white size-6"
                        style={{ fill: "white", stroke: "white" }}
                      />
                    );
                  })()}
                </div>
                <div className="mt-5">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tag
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {count}
                  </h4>
                  {leadTagDescriptions[tag] && (
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                      {leadTagDescriptions[tag]}
                    </p>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* Main Leads List */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Reddit Leads
        </h3>

        {/* List of lead cards */}
        <div className="space-y-5">
          {loading && (
            <div className="text-sm text-gray-500">Loading leads…</div>
          )}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && leads.length === 0 && (
            <div className="text-sm text-gray-500">No leads found.</div>
          )}

          {leads.map((lead) => {
            const description = lead.selftext
              ? truncateText(lead.selftext, 200)
              : "No content available";

            return (
              <ComponentCard
                key={lead.id}
                title={lead.title || "Untitled post"}
                desc={description}
                className=""
              >
                {/* Lead Tag Badge */}
                {lead.lead_tag && (
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTagColors(
                        lead.lead_tag
                      )}`}
                    >
                      <span className="font-bold">
                        {lead.lead_tag
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      {leadTagDescriptions[lead.lead_tag] &&
                        `: ${leadTagDescriptions[lead.lead_tag]}`}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 w-full lg:w-auto">
                    <div>
                      <p className="text-xs text-gray-500">Lead Score</p>
                      <div className="flex flex-col">
                        <p
                          className={`text-sm font-semibold ${getScoreColor(
                            lead.lead_score
                          )}`}
                        >
                          {lead.lead_score.toFixed(1)}
                        </p>
                        <p
                          className={`text-xs ${getScoreColor(
                            lead.lead_score
                          )}`}
                        >
                          {getScoreLabel(lead.lead_score)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Subreddit</p>
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        r/{lead.subreddit}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Post Comments</p>
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {lead.num_comments}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Post Upvotes</p>
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {lead.score}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {formatDate(lead.created_datetime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={lead.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                      View on Reddit
                    </a>
                    <button
                      onClick={async () => {
                        try {
                          setGeneratingReply(true);
                          const response = await LeadsApi.generateReply(
                            lead.id
                          );
                          setGeneratedReply(response.reply_text);
                          setReplyModalOpen(true);
                        } catch (error: any) {
                          alert(
                            `Error generating reply: ${
                              error.message || "Unknown error"
                            }`
                          );
                        } finally {
                          setGeneratingReply(false);
                        }
                      }}
                      disabled={generatingReply}
                      className="inline-flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingReply ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        "Generate Reply"
                      )}
                    </button>
                  </div>
                </div>
              </ComponentCard>
            );
          })}

          {/* Load More Button */}
          {!loading && !error && hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMoreLeads}
                disabled={loadingMore}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading More...
                  </>
                ) : (
                  "Load More Leads"
                )}
              </Button>
            </div>
          )}

          {/* No More Leads Message */}
          {!loading && !error && !hasMore && leads.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                🎉 You've reached the end! All leads have been loaded.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        className="max-w-4xl mx-4"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Generated Reply
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
              {generatedReply}
            </pre>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setReplyModalOpen(false)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
            <button
              onClick={() => copyToClipboard(generatedReply)}
              className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
