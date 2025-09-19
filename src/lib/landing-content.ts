import { MissingDatabaseBindingError, withDb } from "./db";

export type Service = {
  title: string;
  description: string;
};

export type Highlight = {
  title: string;
  description: string;
};

export type CaseStudy = {
  name: string;
  metric: string;
  description: string;
};

export type LandingContent = {
  services: Service[];
  highlights: Highlight[];
  caseStudies: CaseStudy[];
};

const FALLBACK_CONTENT: LandingContent = {
  services: [
    {
      title: "Product Strategy",
      description:
        "Translate ambitious goals into actionable roadmaps with discovery workshops and lean validation sprints.",
    },
    {
      title: "Web & Mobile Apps",
      description:
        "Design, build, and ship responsive experiences powered by TypeScript, React, and modern cloud tooling.",
    },
    {
      title: "Cloud Integrations",
      description:
        "Automate data flows, integrate third-party APIs, and deploy resilient infrastructure on Cloudflare Workers.",
    },
  ],
  highlights: [
    {
      title: "14-day prototypes",
      description: "Lean experiments that stakeholders can click, test, and iterate on quickly.",
    },
    {
      title: "Dedicated squads",
      description: "Cross-functional teams embedded alongside your product owners and designers.",
    },
    {
      title: "Global delivery",
      description: "Remote-first workflows with overlap across APAC, EMEA, and US time zones.",
    },
  ],
  caseStudies: [
    {
      name: "Fintech Onboarding Portal",
      metric: "40% faster sign-up",
      description:
        "Reimagined the customer journey with guided flows, credential automation, and analytics dashboards.",
    },
    {
      name: "Retail Loyalty Platform",
      metric: "2x repeat purchases",
      description:
        "Implemented a headless commerce stack with real-time personalization across mobile touchpoints.",
    },
  ],
};

export async function getLandingContent(): Promise<LandingContent> {
  try {
    const [services, highlights, caseStudies] = await Promise.all([
      queryServices(),
      queryHighlights(),
      queryCaseStudies(),
    ]);

    const hasContent = services.length || highlights.length || caseStudies.length;
    if (!hasContent) {
      return FALLBACK_CONTENT;
    }

    return {
      services: services.length ? services : FALLBACK_CONTENT.services,
      highlights: highlights.length ? highlights : FALLBACK_CONTENT.highlights,
      caseStudies: caseStudies.length ? caseStudies : FALLBACK_CONTENT.caseStudies,
    };
  } catch (error) {
    if (!(error instanceof MissingDatabaseBindingError)) {
      console.error("Failed to load landing content from D1", error);
    }
    return FALLBACK_CONTENT;
  }
}

async function queryServices(): Promise<Service[]> {
  return withDb(async (db) => {
    const { results } = await db
      .prepare("SELECT title, description FROM services ORDER BY display_order ASC, id ASC")
      .all();
    return (results ?? []) as Service[];
  }).catch((error) => {
    if (!(error instanceof MissingDatabaseBindingError)) {
      console.error("Failed to fetch services", error);
    }
    return [];
  });
}

async function queryHighlights(): Promise<Highlight[]> {
  return withDb(async (db) => {
    const { results } = await db
      .prepare("SELECT title, description FROM highlights ORDER BY display_order ASC, id ASC")
      .all();
    return (results ?? []) as Highlight[];
  }).catch((error) => {
    if (!(error instanceof MissingDatabaseBindingError)) {
      console.error("Failed to fetch highlights", error);
    }
    return [];
  });
}

async function queryCaseStudies(): Promise<CaseStudy[]> {
  return withDb(async (db) => {
    const { results } = await db
      .prepare("SELECT name, metric, description FROM case_studies ORDER BY display_order ASC, id ASC")
      .all();
    return (results ?? []) as CaseStudy[];
  }).catch((error) => {
    if (!(error instanceof MissingDatabaseBindingError)) {
      console.error("Failed to fetch case studies", error);
    }
    return [];
  });
}
