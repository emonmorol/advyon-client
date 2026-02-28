import React, { useState, useMemo } from 'react';
import { useLawyers } from '@/services/users/userService';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  ShieldCheck,
  Briefcase,
  MapPin,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Scale,
  Users,
  Filter,
  Mail,
  Phone,
} from 'lucide-react';

const PRACTICE_AREAS = [
  'All',
  'Criminal Law',
  'Civil Law',
  'Corporate Law',
  'Family Law',
  'Tax Law',
  'Labor Law',
  'Immigration Law',
  'Property Law',
  'Constitutional Law',
  'Environmental Law',
  'Intellectual Property',
  'Banking Law',
  'Human Rights',
  'Cyber Law',
];

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-muted" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-4/5 rounded bg-muted" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-7 w-20 rounded-full bg-muted" />
        <div className="h-7 w-16 rounded-full bg-muted" />
      </div>
    </div>
  );
}

export default function FindLawyersPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [practiceArea, setPracticeArea] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Debounce search
  const debounceRef = React.useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  const handlePracticeAreaChange = (value) => {
    setPracticeArea(value);
    setPage(1);
  };

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    practiceArea: practiceArea !== 'All' ? practiceArea : undefined,
    page,
    limit,
  }), [debouncedSearch, practiceArea, page, limit]);

  const { data: response, isLoading } = useLawyers(params);
  const lawyers = response?.data?.lawyers || [];
  const meta = response?.data?.meta || { total: 0, page: 1, totalPages: 1 };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* ─── Page Header ─── */}
      <div className="relative overflow-hidden rounded-2xl gradient-teal-depth p-8 md:p-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--teal-bright))] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[hsl(var(--amber))] rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Scale className="h-8 w-8 text-[hsl(var(--amber-glow))]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Find a Lawyer
              </h1>
              <p className="text-white/70 mt-1 text-sm md:text-base">
                Browse verified legal professionals and find the right expert for your case.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
            <Users className="h-5 w-5 text-[hsl(var(--amber-glow))]" />
            <span className="text-white font-semibold text-lg">{meta.total}</span>
            <span className="text-white/60 text-sm">lawyers available</span>
          </div>
        </div>
      </div>

      {/* ─── Search & Filters ─── */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="lawyer-search"
            placeholder="Search lawyers by name..."
            className="pl-10 h-11 bg-card/80 backdrop-blur-sm border-border/50 focus-visible:ring-[hsl(var(--teal-accent))]"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
          <Select value={practiceArea} onValueChange={handlePracticeAreaChange}>
            <SelectTrigger
              id="practice-area-filter"
              className="w-full md:w-[220px] h-11 bg-card/80 backdrop-blur-sm border-border/50"
            >
              <SelectValue placeholder="Practice Area" />
            </SelectTrigger>
            <SelectContent>
              {PRACTICE_AREAS.map((area) => (
                <SelectItem key={area} value={area}>
                  {area === 'All' ? 'All Practice Areas' : area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ─── Lawyer Cards Grid ─── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : lawyers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {lawyers.map((lawyer) => (
            <Card
              key={lawyer.id}
              className="group relative overflow-hidden border-border/40 bg-card backdrop-blur-sm shadow-xl transition-all hover:border-accent/40 hover:shadow-2xl bg-background rounded-2xl flex flex-col"
            >
              {/* Accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 gradient-teal-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardContent className="p-5 flex flex-col flex-1">
                {/* Avatar + Name */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-border/60 group-hover:border-[hsl(var(--teal-accent))] transition-colors duration-300 ring-2 ring-transparent group-hover:ring-[hsl(var(--teal-bright))/0.2]">
                      <AvatarImage src={lawyer.avatarUrl} alt={lawyer.fullName} />
                      <AvatarFallback className="text-sm font-semibold bg-[hsl(var(--primary))] text-primary-foreground">
                        {getInitials(lawyer.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    {lawyer.verificationStatus === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-card">
                        <ShieldCheck className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate text-base group-hover:text-[hsl(var(--teal-bright))] transition-colors duration-200">
                      {lawyer.fullName}
                    </h3>
                    {lawyer.primaryPracticeArea && (
                      <span className="inline-flex items-center gap-1 text-xs text-[hsl(var(--amber))] font-medium mt-1">
                        <Briefcase className="h-3 w-3" />
                        {lawyer.primaryPracticeArea}
                      </span>
                    )}
                    {lawyer.verificationStatus === 'verified' && (
                      <Badge
                        variant="secondary"
                        className="mt-1.5 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5 text-[hsl(var(--teal-accent))]" />
                    <span>{lawyer.yearsOfExperience > 0 ? `${lawyer.yearsOfExperience} years experience` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Scale className="h-3.5 w-3.5 text-[hsl(var(--teal-accent))]" />
                    <span className="truncate">{lawyer.barCouncilName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-[hsl(var(--teal-accent))]" />
                    <span className="truncate">{lawyer.address || 'N/A'}</span>
                  </div>
                </div>

                {/* Bio excerpt */}
                <p className="mt-3 text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                  {lawyer.bio || ''}
                </p>

                {/* Spacer to push actions to bottom */}
                <div className="flex-1" />

                {/* Actions — always show both buttons */}
                <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs flex-1 border-border/50 hover:bg-[hsl(var(--primary))] hover:text-primary-foreground hover:border-[hsl(var(--primary))] transition-colors"
                    onClick={() => lawyer.email && (window.location.href = `mailto:${lawyer.email}`)}
                    disabled={!lawyer.email}
                  >
                    <Mail className="mr-1.5 h-3 w-3" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs flex-1 border-border/50 hover:bg-[hsl(var(--teal-accent))] hover:text-white hover:border-[hsl(var(--teal-accent))] transition-colors"
                    onClick={() => lawyer.phone && (window.location.href = `tel:${lawyer.phone}`)}
                    disabled={!lawyer.phone}
                  >
                    <Phone className="mr-1.5 h-3 w-3" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* ─── Empty State ─── */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-5 rounded-2xl bg-muted/50 mb-6">
            <Scale className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Lawyers Found</h3>
          <p className="text-muted-foreground max-w-md text-sm">
            {debouncedSearch || practiceArea !== 'All'
              ? 'Try adjusting your search term or filters to find the right lawyer.'
              : 'No lawyers are currently available. Please check back later.'}
          </p>
          {(debouncedSearch || practiceArea !== 'All') && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setDebouncedSearch('');
                setPracticeArea('All');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* ─── Pagination ─── */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 border-border/50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => {
              let pageNum;
              if (meta.totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= meta.totalPages - 2) {
                pageNum = meta.totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  className={`h-9 w-9 p-0 ${
                    page === pageNum
                      ? 'gradient-teal-depth text-white border-transparent'
                      : 'border-border/50'
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 border-border/50"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
