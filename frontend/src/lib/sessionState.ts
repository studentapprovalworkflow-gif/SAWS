const AUTH_SESSION_KEY = 'sdms_session';
const OVERVIEW_FILTERS_KEY = 'sdms_overview_filters';

export interface OverviewFilters {
  branches: string[];
  workflows: string[];
  dateFrom: string;
  dateTo: string;
}

function storageForCurrentSession(): Storage {
  const sessionValue = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY);
  if (sessionValue) {
    try {
      const session = JSON.parse(sessionValue) as { rememberMe?: boolean };
      return session.rememberMe ? localStorage : sessionStorage;
    } catch {
      return sessionStorage;
    }
  }
  return sessionStorage;
}

export function readOverviewFilters(): OverviewFilters {
  const raw = storageForCurrentSession().getItem(OVERVIEW_FILTERS_KEY);
  if (!raw) return { branches: [], workflows: [], dateFrom: '', dateTo: '' };
  try {
    const filters = JSON.parse(raw) as Record<string, unknown>;
    const readValues = (pluralKey: string, legacyKey: string) => {
      const current = filters[pluralKey];
      if (Array.isArray(current)) return current.filter((value): value is string => typeof value === 'string');
      const legacy = filters[legacyKey];
      return typeof legacy === 'string' && legacy ? [legacy] : [];
    };
    return {
      branches: readValues('branches', 'branch'),
      workflows: readValues('workflows', 'workflow'),
      dateFrom: typeof filters.dateFrom === 'string' ? filters.dateFrom : '',
      dateTo: typeof filters.dateTo === 'string' ? filters.dateTo : ''
    };
  } catch {
    return { branches: [], workflows: [], dateFrom: '', dateTo: '' };
  }
}

export function writeOverviewFilters(filters: OverviewFilters) {
  storageForCurrentSession().setItem(OVERVIEW_FILTERS_KEY, JSON.stringify(filters));
}

export function clearOverviewFilters() {
  localStorage.removeItem(OVERVIEW_FILTERS_KEY);
  sessionStorage.removeItem(OVERVIEW_FILTERS_KEY);
}
