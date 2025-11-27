// script.js
// Elite AI Credit Repair
// High-quality front-end behavior for Ask AI, navigation, and utilities.

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  setupAskAiSection();
  setupSmoothScroll();
  highlightActiveNav();
});

/* ======================= UTILITIES ======================= */

/**
 * Sets the current year in the footer span#year
 */
function setCurrentYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * Basic HTML escape to prevent injection when inserting AI text.
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Smooth scroll for in-page anchors like #ask-ai
 */
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/**
 * Highlights the current nav link based on the URL.
 * This is a fallback in case the HTML doesn't manually set .active.
 */
function highlightActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".main-nav .nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ======================= ASK AI SECTION ======================= */

function setupAskAiSection() {
  const askAiInput = document.getElementById("askAiInput");
  const askAiButton = document.getElementById("askAiButton");
  const askAiResponse = document.getElementById("askAiResponse");
  const questionChips = document.querySelectorAll(".question-chip");

  // If we’re not on the page with Ask AI, just exit quietly.
  if (!askAiInput || !askAiButton || !askAiResponse) return;

  // Handle clicking question chips to auto-fill the textarea.
  questionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const q = chip.getAttribute("data-question") || chip.textContent.trim();
      askAiInput.value = q;
      askAiInput.focus();
      askAiInput.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // Handle Ask AI button click
  askAiButton.addEventListener("click", () => {
    handleAskAiSubmit(askAiInput, askAiResponse, askAiButton);
  });

  // Handle Enter / Ctrl+Enter inside the textarea
  askAiInput.addEventListener("keydown", (e) => {
    // Ctrl+Enter or Cmd+Enter submits
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleAskAiSubmit(askAiInput, askAiResponse, askAiButton);
    }
  });
}

/**
 * Main submit handler for Ask AI.
 */
function handleAskAiSubmit(inputEl, responseEl, buttonEl) {
  const rawQuestion = inputEl.value.trim();

  if (!rawQuestion) {
    responseEl.innerHTML = `
      <div class="ai-message ai-error">
        <h4>AI Response</h4>
        <p>Please describe your credit question or situation so the AI can actually help you.</p>
      </div>
    `;
    inputEl.focus();
    return;
  }

  // "Thinking" state
  buttonEl.disabled = true;
  buttonEl.textContent = "Thinking...";
  responseEl.innerHTML = `
    <div class="ai-message ai-loading">
      <h4>AI is Reviewing Your Situation...</h4>
      <p>
        I’m scanning your question for key details like type of account, dates,
        potential law violations, and what stage you’re at in the dispute process.
      </p>
    </div>
  `;

  // Simulate processing time
  setTimeout(() => {
    const answer = generateLocalAiResponse(rawQuestion);
    const safeAnswer = escapeHTML(answer).replace(/\n/g, "<br>");

    responseEl.innerHTML = `
      <div class="ai-message ai-success">
        <h4>AI Response</h4>
        <p>${safeAnswer}</p>
      </div>
    `;

    buttonEl.disabled = false;
    buttonEl.textContent = "Ask AI";
    responseEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 700); // short delay for better UX
}

/**
 * Local, rule-based "AI" so the site is fully functional without a backend.
 * This gives detailed, college-level style explanations using common patterns.
 */
function generateLocalAiResponse(question) {
  const q = question.toLowerCase();

  // Identity Theft
  if (q.includes("identity theft") || q.includes("id theft") || q.includes("someone opened") || q.includes("not me")) {
    return `
You’re describing a situation that sounds like possible identity theft.

Here’s a clear, step-by-step plan:

1) Get Documentation in Place  
   • Pull all three credit reports (Experian, Equifax, TransUnion).  
   • Circle or highlight the accounts, inquiries, or addresses that do not belong to you.  
   • Save everything as a PDF or printed copy for your personal records.

2) File an Identity Theft Report  
   • Go to the FTC identity theft portal and complete an identity theft report.  
   • If your situation is serious or ongoing, file a police report with your local department as well.  
   • Keep copies of both reports and any report/incident numbers.

3) Send Disputes to the Credit Bureaus  
   • Write a dispute letter to each credit bureau listing each fraudulent account or inquiry.  
   • Clearly state: “This account was opened as a result of identity theft. I did not authorize it.”  
   • Attach copies (not originals) of:  
     – Your ID and proof of address  
     – The FTC identity theft report  
     – The police report (if you filed one)  
   • Send everything by certified mail with return receipt so you have proof of delivery.

4) Notify the Furnishers (Companies Reporting the Account)  
   • Write directly to the creditor or collection agency reporting the fraudulent account.  
   • Include a copy of the identity theft report and demand they block the account as fraudulent and stop reporting it.  
   • Again, send by certified mail and keep copies.

5) Monitor Responses and Deadlines  
   • The bureaus generally have around 30 days to investigate disputes.  
   • Track what you sent, the date you sent it, and what comes back.  
   • If they fail to correct clearly fraudulent information after receiving your documentation, that may be a violation of the Fair Credit Reporting Act (FCRA).

Long-term, you should:  
   • Consider placing a fraud alert or credit freeze with all three bureaus.  
   • Change passwords and enable two-factor authentication with your bank, email, and important accounts.

If you join the membership, the system can generate tailored identity theft letters, an organized “identity theft packet,” and a dashboard to track each dispute and response so nothing slips through the cracks.
    `;
  }

  // Collections / Charge-Offs
  if (q.includes("collection") || q.includes("charge off") || q.includes("charged off")) {
    return `
You’re asking about collections or charged-off accounts, which are some of the most aggressive negative items on a credit report.

Here’s how to approach them in a structured way:

1) Verify the Details First  
   • Confirm the name of the collector, the original creditor, the account number, and the amount.  
   • Compare what’s on your credit report with any letters you’ve received in the mail.  
   • Look for obvious errors: wrong dates, wrong balances, unknown creditor, or an account that’s too old.

2) Look at the Statute of Limitations  
   • Every state has a “statute of limitations” on how long a debt collector can sue you for an unpaid debt.  
   • This is usually different from the amount of time it can report on your credit (typically up to 7 years from the date of first delinquency).  
   • If the debt is beyond the statute, you need to be careful not to accidentally “revive” it by making new payments or agreements.

3) Use a Targeted Dispute Letter (Factual Disputes)  
   • Instead of a generic “this is not mine” letter, list concrete inaccuracies:  
     – Wrong date of last payment  
     – Wrong original creditor  
     – Amount not matching your records  
     – Missing proof of your responsibility  
   • Ask the bureaus to require full documentation from the furnisher.  
   • Send your dispute to each bureau reporting the item, by certified mail.

4) Debt Validation with the Collector  
   • Under the FDCPA (Fair Debt Collection Practices Act), you can request validation of the debt from the collector.  
   • Ask for documentation that proves you’re legally responsible: contracts, account statements, etc.  
   • If they can’t validate, you can demand they stop reporting and stop collection efforts.

5) Negotiation and Good-Faith Resolution (If the Debt Is Valid)  
   • If it’s legitimately yours and within the statute of limitations, sometimes your best move is a negotiated resolution.  
   • You may try:  
     – Settlement for less than the full balance  
     – Payment in full with a written agreement that they’ll update reporting accurately  
   • Never rely on verbal promises: get any agreement in writing.

6) Ongoing Monitoring  
   • After disputes or settlements, pull fresh reports to confirm changes.  
   • If incorrect information remains, you may send a follow-up dispute, file complaints with regulators, or escalate further.

The membership tools can generate customized collection dispute letters, track every response, and help you decide your next step at each stage.
    `;
  }

  // Late payments
  if (q.includes("late payment") || q.includes("30 days late") || q.includes("60 days late") || q.includes("90 days late")) {
    return `
You’re asking about late payments, which are one of the most common score killers on a credit report.

Here’s a smart way to tackle them:

1) Confirm the Accuracy  
   • Check the exact dates the creditor says you were 30, 60, or 90+ days late.  
   • Compare against your own bank statements, payment confirmations, or screenshots.  
   • Look for: wrong month, wrong year, or lates reported during a forbearance or hardship arrangement.

2) Goodwill / Courtesy Requests (If You Were Actually Late)  
   • If the late payment is accurate but you have a strong history with the creditor, you can request a “goodwill adjustment.”  
   • Explain any short-term hardship: job loss, medical event, temporary financial disruption.  
   • Emphasize that you’ve since been on-time and want to maintain a long-term relationship.

3) Factual Dispute (If There Are Errors)  
   • If the date or severity of the late payment is wrong, dispute it factually with the bureaus.  
   • Attach proof such as bank records, payment confirmations, or agreements with the creditor.  
   • Ask the bureaus to have the furnisher verify the exact payment history.

4) Check for Forbearance / Special Programs  
   • If you were in an official hardship program, some types of loans should not be reporting late in the normal way during that period.  
   • Your dispute letter can explain the program and include any documentation you have.

5) Long-Term Score Strategy  
   • Even with late payments, building new positive history (on-time, low utilization, mix of accounts) can offset damage over time.  
   • Keep utilization low, avoid new unnecessary inquiries, and make sure no additional lates occur.

Inside the membership, your dashboard can track each late payment, what actions you’ve taken, and generate letters customized to the exact timing and facts of your situation.
    `;
  }

  // Dispute letters / mailing etiquette / packets
  if (
    q.includes("dispute letter") ||
    q.includes("mailing etiquette") ||
    q.includes("packet") ||
    q.includes("register") && q.includes("mail")
  ) {
    return `
You’re asking about dispute letters, mailing etiquette, and what a complete “packet” should look like. Getting this part right makes a huge difference.

1) What Is a Dispute Packet?  
   • A dispute packet is the full set of documents you send to a credit bureau or furnisher in one organized envelope.  
   • It normally includes:  
     – Your dispute letter  
     – Copy of your ID (driver’s license, state ID)  
     – Proof of address (utility bill, bank statement, or similar)  
     – Copies of the credit report pages with the items circled or highlighted  
     – Any supporting evidence (statements, letters, proof of payment, court documents, etc.).

2) Proper Mailing Etiquette  
   • Always send disputes by certified mail with return receipt requested.  
   • Keep copies (digital or physical) of everything you send.  
   • Write clearly, use professional language, and number the items you’re disputing in a list.  
   • Only include relevant documents; don’t overload with random paperwork.

3) Structure of a Strong Dispute Letter  
   • Header with your full name, address, date, and the bureau’s address.  
   • A clear subject line: “Re: Dispute of Inaccurate Credit Information.”  
   • Identify each account with creditor name, account number (partially masked), and what is wrong (dates, balance, ownership, status, etc.).  
   • State what you want: correction or deletion if the information can’t be verified.  
   • Refer to your rights under the Fair Credit Reporting Act (FCRA) without copying a bunch of legal code.

4) Tone and Style  
   • Professional, firm, and factual — not emotional or aggressive.  
   • Avoid templates that scream “internet form letter” and don’t match your actual facts.  
   • Make each dispute personal to your file and your documents.

5) Tracking Everything  
   • Record: the date you mailed, the tracking number, what you disputed, and what evidence you included.  
   • When the bureau responds, attach the response to the same record.  
   • Use this to decide your next move (follow-up dispute, complaint to regulators, or legal consult if necessary).

The membership includes examples of completed packets, templates you can customize, and a dashboard to log every letter so you always know what you sent, when, and what came back.
    `;
  }

  // Snapshot / membership / plan
  if (q.includes("snapshot") || q.includes("plan") || q.includes("membership") || q.includes("game plan")) {
    return `
You’re asking about creating a clear plan or “snapshot” of your credit situation, which is exactly what a good system should do.

A strong snapshot includes:

1) Big Picture Overview  
   • How many negative items you have (collections, charge-offs, lates, public records).  
   • How many positive accounts you have and how old they are.  
   • Your current utilization and score range.

2) Item-by-Item Breakdown  
   • For each negative item: who is reporting it, the date of first delinquency, balance, and status.  
   • Whether it’s within the statute of limitations for collection lawsuits.  
   • Whether you have any obvious factual errors you can dispute.

3) Priority Ranking  
   • Which items are hurting you the most score-wise.  
   • Which accounts are easiest to attack first (clear errors, old collections, duplicate entries).  
   • Which ones require documentation or identity theft work.

4) Strategy Columns  
   • For each item, list the recommended path: dispute, validation, negotiation, identity theft workflow, or wait-and-monitor.  
   • Note the laws most likely to apply (FCRA, FDCPA, etc.).

5) Timeline & Checkpoints  
   • What you’re doing in the next 30 days, 60 days, and 90+ days.  
   • When you expect responses from bureaus or collectors.  
   • What your next step will be depending on their answers.

The membership’s snapshot feature is designed to do this automatically: you enter your situation, and the AI turns it into a readable strategy that feels like a college-level advisor walked through your file line by line.
    `;
  }

  // Regulators / CFPB / FTC / AG
  if (q.includes("cfpb") || q.includes("ftc") || q.includes("attorney general") || q.includes("ag complaint")) {
    return `
You’re asking about regulators like the CFPB, FTC, or your State Attorney General, which can be powerful tools when normal disputes are ignored.

1) CFPB (Consumer Financial Protection Bureau)  
   • Handles complaints about credit reporting, lenders, debt collectors, and more.  
   • You can file a detailed complaint online describing what the bureau or creditor did wrong.  
   • Attach copies of your disputes and their responses (or lack of response).  
   • Companies usually must respond within a specific time window, and the CFPB tracks outcomes.

2) FTC (Federal Trade Commission)  
   • Handles identity theft and certain unfair or deceptive practices.  
   • The FTC identity theft portal lets you create an official identity theft report used as part of your dispute packet.  
   • They do not fix your credit directly, but their documentation supports your demands.

3) State Attorney General / State Regulators  
   • Each state has its own rules and enforcement style.  
   • You can send complaints when a company repeatedly violates your rights or ignores clear evidence.  
   • Sometimes state-level pressure gets better results than going in circles with customer service.

4) When to Use Regulators  
   • When the bureaus or furnishers refuse to correct clearly inaccurate, incomplete, or fraudulent information.  
   • When a collector violates communication rules or continues to report false information.  
   • When you’ve documented your disputes and can show a pattern of noncompliance.

The membership gives you structured templates for regulator complaints and a way to track which agencies you’ve contacted and what each one has done so far.
    `;
  }

  // Default generic high-quality response
  return `
I understand you have a question about your credit, and I’ll walk you through this the same way a college-level advisor would: clearly, step-by-step, and based on real-world credit rules.

Here’s how to think about almost any credit problem:

1) Identify the Exact Problem  
   • Figure out whether your issue is late payments, collections, charge-offs, public records, inquiries, identity theft, or something else.  
   • Grab your reports from all three bureaus so you can see exactly how the item is being reported.

2) Check for Accuracy and Documentation  
   • Ask: Is this account really mine? Is the balance right? Are the dates correct? Is the status accurate?  
   • Collect any documents you have: statements, emails, letters, court documents, payment records.

3) Match the Problem to the Law  
   • The Fair Credit Reporting Act (FCRA) controls how information is reported and corrected.  
   • The Fair Debt Collection Practices Act (FDCPA) controls how collectors behave and what they can and cannot do.  
   • State laws and statutes of limitations also matter, especially for older debts.

4) Choose the Right First Action  
   • Factual dispute to the credit bureaus when the reporting is inaccurate, incomplete, or unverified.  
   • Validation request to a debt collector if they’re coming after you for a debt you don’t recognize or don’t fully understand.  
   • Identity theft process (FTC + police report) if accounts were opened without your permission.  
   • Negotiation or settlement only after you understand your rights and the age/status of the debt.

5) Use Written Communication and Keep Records  
   • Always use written letters, preferably mailed by certified mail with return receipt.  
   • Keep copies of everything you send and everything you receive.  
   • Track dates so you can prove when a bureau or creditor missed a response deadline.

6) Build Forward, Not Just Backward  
   • While you’re cleaning up negatives, also think about building positives: on-time payments, lower utilization, and the right mix of accounts.  
   • Over time, this combination (clean file + new positive history) is what creates strong, stable scores.

If you provide more specifics — like whether your issue is collections, identity theft, late payments, or public records — I can give a more targeted, step-by-step plan tailored to your exact situation.
  `;
}
