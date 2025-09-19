-- Cloudflare D1 migration: initial content + lead capture tables

-- Services offered on the landing page
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(title)
);

INSERT OR IGNORE INTO services (title, description, display_order) VALUES
  (
    'Product Strategy',
    'Translate ambitious goals into actionable roadmaps with discovery workshops and lean validation sprints.',
    1
  ),
  (
    'Web & Mobile Apps',
    'Design, build, and ship responsive experiences powered by TypeScript, React, and modern cloud tooling.',
    2
  ),
  (
    'Cloud Integrations',
    'Automate data flows, integrate third-party APIs, and deploy resilient infrastructure on Cloudflare Workers.',
    3
  );

-- Highlights that showcase differentiators
CREATE TABLE IF NOT EXISTS highlights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(title)
);

INSERT OR IGNORE INTO highlights (title, description, display_order) VALUES
  (
    '14-day prototypes',
    'Lean experiments that stakeholders can click, test, and iterate on quickly.',
    1
  ),
  (
    'Dedicated squads',
    'Cross-functional teams embedded alongside your product owners and designers.',
    2
  ),
  (
    'Global delivery',
    'Remote-first workflows with overlap across APAC, EMEA, and US time zones.',
    3
  );

-- Case studies on the landing page
CREATE TABLE IF NOT EXISTS case_studies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  metric TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(name)
);

INSERT OR IGNORE INTO case_studies (name, metric, description, display_order) VALUES
  (
    'Fintech Onboarding Portal',
    '40% faster sign-up',
    'Reimagined the customer journey with guided flows, credential automation, and analytics dashboards.',
    1
  ),
  (
    'Retail Loyalty Platform',
    '2x repeat purchases',
    'Implemented a headless commerce stack with real-time personalization across mobile touchpoints.',
    2
  );

-- Captured leads from the contact form
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  company TEXT,
  email TEXT NOT NULL,
  budget_range TEXT,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
