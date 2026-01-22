import PageMeta from "../components/common/PageMeta";

export default function Instructions() {
  const leadAnalysisPrompt = `# Better2Know Lead Classifier

## Task
1) Choose exactly one tag from the Combined tag list below.
2) Set is_lead to true if the chosen tag is in Lead tags, otherwise set is_lead to false.
3) Set lead_tag to the chosen tag string, exactly as written.

## Better2Know context
Better2Know delivers high quality STI tests with excellent doctors and fast, accurate pathology. We provide testing in ways customers prefer, and we work with public and charitable sectors. We offer a comprehensive range of STI and STD tests and medically designed screens for peace of mind, recent exposures, symptoms, and follow up care.
Supported topics include: STI, STD, Chlamydia, Gardnerella, Gonorrhoea, HIV, HPV, Genital Warts, Hepatitis, Hepatitis B, Hepatitis C, Herpes, Mycoplasma, Syphilis, Trichomonas, Ureaplasma, Zika.

## Combined tag list

### Lead tags
- diagnosis_confirmation, asking if they have a specific infection, wants a yes or no.
- test_guidance, asking which test or screen to book, swab, blood, or urine.
- clinic_recommendation, asking where to get tested, nearby clinics, or booking steps.
- help_request, asking what to do next, seeking professional direction.
- result_interpretation, has results, asks what they mean or whether to retest.
- window_period, asks when a test will be accurate after exposure.
- retest_followup, after treatment or a negative result, asks what to test now.
- partner_risk, asks about infecting or being infected by a partner, testing for both.
- site_specific_testing, asks about throat, rectal, vaginal, or urethral testing sites.
- urgent_exposure, very recent exposure, asks about immediate testing or PEP.
- pricing_turnaround, asks about cost, same day appointments, or result speed.
- home_test_preference, asks for home sample kits or discreet testing.
- travel_testing, needs testing before travel or for requirements.
- vaccination_request, asks where to get Hep A, Hep B, or HPV vaccines.

### Exclusion tags
- exclude_info, general information only, no testing intent.
- exclude_advice, tips or remedies only, no testing intent.
- exclude_success_story, recovery or success story, no testing intent.

## Decision rules
- If a post mixes general info with a clear testing ask, choose the best matching Lead tag.
- If none of the Lead tags clearly apply and the post shows no testing intent, choose an Exclusion tag.
- If unclear, default to exclude_info.
- If the post is not about sexual health at all, choose exclude_info.`;

  const replyGenerationPrompt = `# Reddit Lead Reply Writer

## Role
Write one helpful Reddit comment that shares accurate sexual health guidance and gently nudges toward appropriate testing, without naming any clinic or brand.

## Inputs
- title: post title
- body: post body
- tag: classifier tag, for example diagnosis_confirmation, test_guidance, clinic_recommendation, result_interpretation, window_period, retest_followup, partner_risk, site_specific_testing, urgent_exposure, pricing_turnaround, home_test_preference, travel_testing, vaccination_request, exclude_info, exclude_advice, exclude_success_story

## Output
Return only the comment text, no headers, no JSON, no links.

## Length and format
- Write 110 to 140 words, never exceed 150 words.
- Use 2 to 3 short paragraphs, add a blank line between paragraphs.
- Keep sentences brief and plain, aim for under 18 words each.
- Bullets are allowed when they help, at most three items, still under 150 words.

## Global rules
- Do not mention any brand or specific company.
- Be empathetic, neutral, and stigma free.
- Do not diagnose, use wording like "possible" or "can fit," and encourage professional testing.
- Never name medications. If severe symptoms, pregnancy, assault, or acute illness appear, advise urgent care.
- Use simple Markdown only. No emojis.

## Strict plain text output
- Output must be plain text only, no Markdown formatting.
- Do not use asterisks, underscores, backticks, brackets, or numbered lines to format text.
- Do not create lists or headings, do not bold or italicize, do not include code blocks.
- Do not include links or URLs.
- Do not use emojis.
- Do not use the em dash character (—). Use commas and full stops instead.

## Tag playbook
- diagnosis_confirmation, explain overlap of symptoms, suggest the right specimen route, add basic timing if relevant.
- test_guidance, map concern to specimen type, urine or swab or blood, include simple window period guidance, consider a comprehensive screen if risks are mixed.
- clinic_recommendation, explain how to find local sexual health services or a GP, mention booking, hours, and result turnaround questions to ask.
- result_interpretation, explain what a result can mean, suggest confirmatory testing or retest timing, avoid certainty.
- window_period, give a plain rule of thumb on when tests become reliable, suggest a retest if the first test is very early.
- retest_followup, acknowledge prior treatment or negatives, suggest a simple follow up plan and timing, mention partner testing.
- partner_risk, explain bidirectional risk and incubation, suggest both partners test.
- site_specific_testing, match exposure to anatomical sites, remind that multi site swabs may be needed.
- urgent_exposure, emphasize time sensitivity and contacting local urgent care for evaluation, no drug names.
- pricing_turnaround, note that cost and speed vary by service, advise asking clinics before booking.
- home_test_preference, explain that self collection or mail in options may exist, remind to arrange follow up if positive.
- travel_testing, note that rules vary by destination, suggest checking official guidance and booking a standard screen if worried.
- vaccination_request, explain that vaccines like Hep B or HPV may be available via primary care or public programs, advise checking eligibility.

## Call to action policy
Include a single soft offer line at the end only when the post text shows clear logistics intent, for example where to go, how to book, cost, turnaround, home kit, urgent help, or provider suggestion. Signals include words like where, clinic, near me, recommend, suggest, book, appointment, walk in, same day, cost, price, turnaround, home kit, mail in, PEP, urgent care, vaccination, travel requirement, partner testing, throat swab, rectal swab. If tag is clinic_recommendation, urgent_exposure, pricing_turnaround, home_test_preference, travel_testing, vaccination_request, partner_risk, site_specific_testing, or test_guidance, include the offer only if the body explicitly asks where to go or what service to use. Do not include an offer for diagnosis_confirmation or result_interpretation unless the body explicitly asks where to go. If no clear signals, omit the offer.

Allowed closing lines, pick one that fits the post:
- If you want, I can suggest reputable local services in your area.
- If helpful, I can point you to nearby services that handle this quietly.
- If you would like, I can share options for getting tested near you.
- If you prefer home collection, I can suggest trusted providers to compare.

## Style guardrails
- Use second person, reflect one concrete detail from the post.
- Prefer short sentences and plain words.
- No brand names, no links, no phone numbers.
- Avoid absolute terms like "guaranteed," use "often," "usually," "can," "may".`;

  const leadScoringServiceContent = (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Lead Scoring Service Documentation
        </h1>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Overview</h2>
        <p className="text-gray-700 leading-relaxed">
          The Lead Scoring Service analyzes Reddit posts to determine if they
          are potential leads for Better2Know's STI/STD testing services. It
          calculates a comprehensive lead score out of 100 based on various
          factors without requiring expensive LLM API calls.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Scoring System
        </h2>

        <h3 className="text-lg font-medium text-gray-800 mb-3">
          📊 Scoring Contribution Breakdown
        </h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                  Component
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                  Weight
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                  Max Points
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>Keyword Analysis</strong>
                </td>
                <td className="border border-gray-300 px-4 py-2">35%</td>
                <td className="border border-gray-300 px-4 py-2">100</td>
                <td className="border border-gray-300 px-4 py-2">
                  Primary/Symptom/Context keywords
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <strong>Question Patterns</strong>
                </td>
                <td className="border border-gray-300 px-4 py-2">25%</td>
                <td className="border border-gray-300 px-4 py-2">100</td>
                <td className="border border-gray-300 px-4 py-2">
                  Question format detection
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>Urgency Indicators</strong>
                </td>
                <td className="border border-gray-300 px-4 py-2">20%</td>
                <td className="border border-gray-300 px-4 py-2">100</td>
                <td className="border border-gray-300 px-4 py-2">
                  Immediate concern detection
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <strong>Geographic Relevance</strong>
                </td>
                <td className="border border-gray-300 px-4 py-2">10%</td>
                <td className="border border-gray-300 px-4 py-2">100</td>
                <td className="border border-gray-300 px-4 py-2">
                  Supported countries
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>Engagement Quality</strong>
                </td>
                <td className="border border-gray-300 px-4 py-2">10%</td>
                <td className="border border-gray-300 px-4 py-2">100</td>
                <td className="border border-gray-300 px-4 py-2">
                  Number of comments
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-3">
          🎯 Score Interpretation
        </h3>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center">
            <span className="text-red-600 font-semibold">70-100:</span>{" "}
            <span className="ml-2">
              🔥 <strong>HIGH PRIORITY LEAD</strong> - Immediate follow-up
              recommended
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-orange-600 font-semibold">50-69:</span>{" "}
            <span className="ml-2">
              ⚡ <strong>MEDIUM PRIORITY LEAD</strong> - Good candidate for
              outreach
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-yellow-600 font-semibold">30-49:</span>{" "}
            <span className="ml-2">
              💡 <strong>LOW PRIORITY LEAD</strong> - Monitor for additional
              signals
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-gray-600 font-semibold">0-29:</span>{" "}
            <span className="ml-2">
              ❌ <strong>NOT A LEAD</strong> - Filter out
            </span>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Service Components
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              1. Keyword Analysis (35% weight)
            </h3>
            <p className="text-gray-700 mb-3">
              Analyzes three categories of keywords based on Better2Know's
              supported tests:
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-800">
                  Primary Keywords (50% of keyword score)
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Scoring:</strong> Full 50 points awarded if{" "}
                  <strong>any</strong> primary keyword is found (not cumulative)
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Main categories:</strong> STI, STD, sexually
                    transmitted infection/disease
                  </li>
                  <li>
                    <strong>Specific conditions:</strong> chlamydia,
                    gardnerella, gonorrhoea, HIV, HPV, hepatitis A/B/C, herpes,
                    mycoplasma, syphilis, trichomonas, ureaplasma, zika
                  </li>
                  <li>
                    <strong>General terms:</strong> infection, sexual health,
                    reproductive health
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800">
                  Symptom Keywords (30% of keyword score)
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Scoring:</strong> Full 30 points awarded if{" "}
                  <strong>any</strong> symptom keyword is found (not cumulative)
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Urinary symptoms:</strong> burning urination,
                    painful urination, frequent urination, blood in urine
                  </li>
                  <li>
                    <strong>Genital symptoms:</strong> discharge, unusual
                    discharge, genital pain/itching/burning, genital sores/bumps
                  </li>
                  <li>
                    <strong>Visible symptoms:</strong> bumps, sores, blisters,
                    ulcers, lesions, rash, swollen glands
                  </li>
                  <li>
                    <strong>General symptoms:</strong> fever, fatigue, flu-like
                    symptoms, bleeding between periods
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800">
                  Context Keywords (20% of keyword score)
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Scoring:</strong> Full 20 points awarded if{" "}
                  <strong>any</strong> context keyword is found (not cumulative)
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Risk behaviors:</strong> unprotected sex, no condom,
                    multiple partners, one night stand
                  </li>
                  <li>
                    <strong>Exposure concerns:</strong> exposed to, partner has,
                    partner tested positive
                  </li>
                  <li>
                    <strong>Testing/medical:</strong> should I get tested, test
                    results, clinic, doctor, screening
                  </li>
                  <li>
                    <strong>Emotional context:</strong> worried about, concerned
                    about, scared of, panic, anxiety
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              2. Question Patterns (25% weight)
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Scoring:</strong> Full 100 points awarded if{" "}
              <strong>any</strong> question pattern is detected (not cumulative)
            </p>
            <p className="text-gray-700 mb-2">
              Detects common question formats using regex patterns:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>
                <strong>Testing questions:</strong> "Should I get tested?",
                "When should I test?", "How long after... test?"
              </li>
              <li>
                <strong>Symptom questions:</strong> "What are symptoms of...?",
                "Is this a symptom of...?", "Does this look like...?"
              </li>
              <li>
                <strong>Risk assessment:</strong> "Am I at risk?", "What are my
                chances?", "How likely is it?"
              </li>
              <li>
                <strong>Exposure questions:</strong> "I think I might have...",
                "I was exposed to...", "My partner has..."
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              3. Urgency Indicators (20% weight)
            </h3>
            <p className="text-gray-700 mb-2">
              Identifies words/phrases showing immediate concern:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>
                <strong>Direct urgency:</strong> urgent, emergency, ASAP,
                immediately, right away
              </li>
              <li>
                <strong>Emotional urgency:</strong> panic, panicking, scared,
                terrified, freaking out, help, desperate
              </li>
              <li>
                <strong>Time-sensitive:</strong> today, now, this morning,
                tonight, yesterday, just happened
              </li>
              <li>
                <strong>Severity indicators:</strong> getting worse, spreading,
                severe, intense, extreme, unbearable
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              4. Geographic Relevance (10% weight)
            </h3>
            <p className="text-gray-700 mb-2">
              Checks for supported countries and regions:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>
                <strong>Australia:</strong> australia, australian, aussie,
                sydney, melbourne, brisbane, perth
              </li>
              <li>
                <strong>Canada:</strong> canada, canadian, toronto, vancouver,
                montreal, calgary, ottawa
              </li>
              <li>
                <strong>Colombia:</strong> colombia, colombian, bogota,
                medellin, cali, barranquilla
              </li>
              <li>
                <strong>India:</strong> india, indian, mumbai, delhi, bangalore,
                hyderabad, chennai
              </li>
              <li>
                <strong>Panama:</strong> panama, panamanian, panama city
              </li>
              <li>
                <strong>Peru:</strong> peru, peruvian, lima, arequipa, trujillo
              </li>
              <li>
                <strong>Poland:</strong> poland, polish, warsaw, krakow, gdansk,
                wroclaw, poznan
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              5. Engagement Quality (10% weight)
            </h3>
            <p className="text-gray-700 mb-2">
              Based on number of comments (indicates genuine concern and
              community engagement):
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>
                <strong>20+ comments:</strong> 100 points (very high engagement)
              </li>
              <li>
                <strong>10-19 comments:</strong> 80 points (high engagement)
              </li>
              <li>
                <strong>5-9 comments:</strong> 60 points (medium engagement)
              </li>
              <li>
                <strong>2-4 comments:</strong> 40 points (low engagement)
              </li>
              <li>
                <strong>1 comment:</strong> 20 points (minimal engagement)
              </li>
              <li>
                <strong>0 comments:</strong> 0 points (no engagement)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageMeta
        title="Instructions | Leads Sniffer"
        description="Instructions page for Leads Sniffer application"
      />
      <div className="min-h-screen bg-gray-50 p-2">
        <div className="mx-auto max-w-none px-2">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            OpenAI Prompts
          </h1>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Lead Analysis Prompt Card */}
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                Lead Analysis Prompt
              </h2>
              <div className="max-h-screen overflow-y-auto rounded border bg-gray-50 p-3">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {leadAnalysisPrompt}
                </pre>
              </div>
            </div>

            {/* Reply Generation Prompt Card */}
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                Reply Generation Prompt
              </h2>
              <div className="max-h-screen overflow-y-auto rounded border bg-gray-50 p-3">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {replyGenerationPrompt}
                </pre>
              </div>
            </div>
          </div>

          {/* Lead Scoring Service Documentation Card - Full Width */}
          <div className="mt-4">
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                Lead Scoring Service Documentation
              </h2>
              <div className="max-h-screen overflow-y-auto rounded border bg-white p-4">
                {leadScoringServiceContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
