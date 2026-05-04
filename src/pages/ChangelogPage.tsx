import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Tag, ChevronRight, Menu, X } from 'lucide-react';
import { cn, scrollToAnchor } from '@/lib/utils';
import { SiteNavbar } from '@/components/ccswitch/SiteNavbar';
import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';
import {
  type ChangelogIndex,
  type ChangelogIndexEntry,
  getVersionTocItems,
  parseSingleVersion,
  stripChangelogVersionHeading,
} from '@/lib/changelog';
import { getLocalizedPath } from '@/i18n/routes';
import { useLanguage } from '@/i18n/useLanguage';

const indexCache = new Map<string, ChangelogIndex>();
const versionCache = new Map<string, string>();

export default function ChangelogPage() {
  const { language, t } = useLanguage();
  const { version: versionParam } = useParams<{ version?: string }>();
  const navigate = useNavigate();

  const [index, setIndex] = useState<ChangelogIndex | null>(() => indexCache.get(language) ?? null);
  const [indexError, setIndexError] = useState(false);
  const [versionMarkdown, setVersionMarkdown] = useState<string>('');
  const [isVersionLoading, setIsVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Load index for the current language.
  useEffect(() => {
    let isActive = true;
    const cached = indexCache.get(language);
    if (cached) {
      setIndex(cached);
      setIndexError(false);
      return;
    }

    setIndex(null);
    setIndexError(false);

    fetch(`/docs/changelog/${language}/index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ChangelogIndex>;
      })
      .then((data) => {
        if (!isActive) return;
        indexCache.set(language, data);
        setIndex(data);
      })
      .catch(() => {
        if (!isActive) return;
        setIndexError(true);
      });

    return () => {
      isActive = false;
    };
  }, [language]);

  // Legacy hash redirect: /changelog#version-3.14.0 -> /changelog/3.14.0
  useEffect(() => {
    if (versionParam) return;
    const hash = window.location.hash;
    const match = /^#version-(.+)$/.exec(hash);
    if (!match) return;
    navigate(getLocalizedPath(`/changelog/${match[1]}`, language), { replace: true });
  }, [versionParam, navigate, language]);

  // Load the requested version's markdown.
  useEffect(() => {
    if (!versionParam) return;

    let isActive = true;
    const cacheKey = `${language}/${versionParam}`;
    const cached = versionCache.get(cacheKey);
    if (cached) {
      setVersionMarkdown(cached);
      setIsVersionLoading(false);
      setVersionError(false);
      return;
    }

    setVersionMarkdown('');
    setIsVersionLoading(true);
    setVersionError(false);

    fetch(`/docs/changelog/${language}/${encodeURIComponent(versionParam)}.md`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!isActive) return;
        versionCache.set(cacheKey, text);
        setVersionMarkdown(text);
        setIsVersionLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setIsVersionLoading(false);
        setVersionError(true);
      });

    return () => {
      isActive = false;
    };
  }, [language, versionParam]);

  // Scroll to top when version changes.
  useEffect(() => {
    if (!versionParam) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [versionParam]);

  const versions = useMemo(() => index?.versions ?? [], [index]);
  const activeEntry = useMemo(
    () => versions.find((v) => v.version === versionParam),
    [versions, versionParam],
  );
  const versionData = useMemo(
    () => (versionMarkdown ? parseSingleVersion(versionMarkdown) : null),
    [versionMarkdown],
  );

  // No /:version in URL → redirect to latest once index is ready.
  if (!versionParam && index && versions.length > 0) {
    return <Navigate to={getLocalizedPath(`/changelog/${versions[0].version}`, language)} replace />;
  }

  const handleVersionClick = (version: string) => {
    navigate(getLocalizedPath(`/changelog/${version}`, language));
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />

      <main className="pt-20 md:pt-24">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {!index && !indexError ? (
            <LoadingSpinner />
          ) : indexError ? (
            <ErrorBlock title={t.changelog.error} description={t.changelog.description} />
          ) : (
            <div className="flex gap-8">
              <VersionSidebar
                versions={versions}
                activeVersion={versionParam}
                onSelect={handleVersionClick}
                versionsLabel={t.changelog.versions}
                betaLabel="beta"
              />

              <div className="flex-1 min-w-0">
                {isVersionLoading ? (
                  <LoadingSpinner />
                ) : versionError || !versionData ? (
                  <ErrorBlock title={t.changelog.error} description={t.changelog.description} />
                ) : (
                  <VersionCard
                    entry={versionData}
                    betaLabel={t.changelog.betaRelease}
                  />
                )}
              </div>

              {activeEntry && versionData && (
                <aside className="hidden xl:block w-56 shrink-0">
                  <div className="sticky top-24">
                    <h4 className="font-semibold text-foreground mb-4 text-sm">
                      {t.changelog.inVersion.replace('{version}', activeEntry.version)}
                    </h4>
                    <VersionToc content={versionData.content} />
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation Button */}
      <button
        onClick={() => setIsMobileNavOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 lg:hidden"
        aria-label={t.changelog.openVersions}
      >
        <Menu className="w-6 h-6" />
      </button>

      <MobileVersionDrawer
        open={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        versions={versions}
        activeVersion={versionParam}
        onSelect={handleVersionClick}
        versionsLabel={t.changelog.versions}
        closeLabel={t.changelog.closeVersions}
        betaLabel="beta"
      />

      <SiteFooter />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

function ErrorBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border p-6 text-center">
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

interface VersionListProps {
  versions: ChangelogIndexEntry[];
  activeVersion: string | undefined;
  onSelect: (version: string) => void;
  betaLabel: string;
}

function VersionList({ versions, activeVersion, onSelect, betaLabel }: VersionListProps) {
  return (
    <div className="space-y-1">
      {versions.map((entry) => {
        const isActive = activeVersion === entry.version;
        return (
          <button
            key={entry.version}
            onClick={() => onSelect(entry.version)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <ChevronRight
              className={cn('w-3 h-3 transition-transform', isActive && 'rotate-90')}
            />
            <span className="flex-1">v{entry.version}</span>
            {entry.isPreRelease && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                {betaLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface SidebarProps extends VersionListProps {
  versionsLabel: string;
}

function VersionSidebar({ versions, activeVersion, onSelect, versionsLabel, betaLabel }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-24 space-y-1">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          {versionsLabel}
        </h4>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <VersionList
            versions={versions}
            activeVersion={activeVersion}
            onSelect={onSelect}
            betaLabel={betaLabel}
          />
        </div>
      </nav>
    </aside>
  );
}

interface MobileDrawerProps extends VersionListProps {
  open: boolean;
  onClose: () => void;
  versionsLabel: string;
  closeLabel: string;
}

function MobileVersionDrawer({
  open,
  onClose,
  versions,
  activeVersion,
  onSelect,
  versionsLabel,
  closeLabel,
  betaLabel,
}: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background border-r border-border shadow-xl overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {versionsLabel}
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label={closeLabel}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <VersionList
                versions={versions}
                activeVersion={activeVersion}
                onSelect={onSelect}
                betaLabel={betaLabel}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface VersionCardProps {
  entry: { version: string; date: string; content: string; isPreRelease: boolean };
  betaLabel: string;
}

function VersionCard({ entry, betaLabel }: VersionCardProps) {
  return (
    <motion.div
      key={entry.version}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'overflow-hidden rounded-xl border border-border ring-2 ring-primary/30 shadow-lg shadow-primary/5',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6',
          entry.isPreRelease ? 'bg-amber-500/5' : 'bg-muted/50',
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span
            className={cn(
              'text-xl font-bold',
              entry.isPreRelease ? 'text-amber-600 dark:text-amber-400' : 'text-foreground',
            )}
          >
            v{entry.version}
          </span>
          {entry.isPreRelease && (
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
              {betaLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{entry.date}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <MarkdownRenderer
          content={stripChangelogVersionHeading(entry.content)}
          className="changelog-content"
        />
      </div>
    </motion.div>
  );
}

function VersionToc({ content }: { content: string }) {
  const headings = useMemo(() => getVersionTocItems(content), [content]);

  if (headings.length === 0) return null;

  return (
    <ul className="space-y-2 text-sm">
      {headings.map((heading) => (
        <li key={heading.id}>
          <button
            type="button"
            onClick={() => scrollToAnchor(heading.id)}
            className="text-left w-full py-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {heading.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
