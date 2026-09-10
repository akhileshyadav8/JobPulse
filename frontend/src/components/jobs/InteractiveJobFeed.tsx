"use client";

import { useState, useMemo } from "react";
import { Job, OverviewStats } from "@/lib/api";
import { JobCard } from "@/components/jobs/JobCard";
import { Search, X, RotateCcw, Sparkles, MapPin, Globe, Building2, ArrowUpDown, Clock, Navigation } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ALL_WORLD_COUNTRIES, COUNTRY_STATES, STATE_CITIES } from "@/lib/world_locations";

const FILTER_CONFIG = {
  "Job Type": ["All", "Full Time", "Internship", "Contract"],
  "Batch": ["All", "2023", "2024", "2025", "2026"],
  "Work Mode": ["All", "Remote", "Hybrid", "Onsite"]
};

interface InteractiveJobFeedProps {
  initialJobs: Job[];
  stats: OverviewStats;
}

export function InteractiveJobFeed({ initialJobs, stats }: InteractiveJobFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "salary" | "fresher">("newest");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    "Job Type": "All",
    "Batch": "All",
    "Work Mode": "All"
  });
  const [visibleCount, setVisibleCount] = useState(9);

  // Available companies in dataset
  const availableCompanies = useMemo(() => {
    const map = new Map<string, string>();
    initialJobs.forEach(j => {
      if (j.company?.name && j.company?.slug) {
        map.set(j.company.slug, j.company.name);
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [initialJobs]);

  // States for selected country
  const availableStates = useMemo(() => {
    if (selectedCountry === "All" || selectedCountry === "Remote") {
      return [];
    }
    const states = COUNTRY_STATES[selectedCountry];
    if (Array.isArray(states) && states.length > 0) {
      return states;
    }
    return [
      { label: `📍 All Regions in ${selectedCountry}`, value: "All" }
    ];
  }, [selectedCountry]);

  // Cities for selected country and state
  const availableCities = useMemo(() => {
    if (selectedCountry === "All" || selectedCountry === "Remote") {
      return [];
    }

    const countryCities = STATE_CITIES[selectedCountry];
    let cities: { label: string; value: string }[] = [];

    if (countryCities) {
      if (selectedState !== "All" && countryCities[selectedState]) {
        cities = countryCities[selectedState];
      } else if (countryCities["All"]) {
        cities = countryCities["All"];
      }
    }

    // Fallback: If no predefined cities or empty, extract from initialJobs matching this country
    if (!cities || cities.length === 0) {
      const extractedSet = new Set<string>();
      const countryLower = selectedCountry.toLowerCase();
      (initialJobs || []).forEach(job => {
        if (job.location && Array.isArray(job.location)) {
          job.location.forEach(loc => {
            if (loc.toLowerCase().includes(countryLower)) {
              const parts = loc.split(",").map(p => p.trim());
              if (parts.length > 1 && parts[0]) {
                extractedSet.add(parts[0]);
              } else if (parts.length === 1 && parts[0] && parts[0].toLowerCase() !== countryLower) {
                extractedSet.add(parts[0]);
              }
            }
          });
        }
      });

      cities = [
        { label: `📍 All Cities in ${selectedCountry}`, value: "All" },
        ...Array.from(extractedSet).map(cityName => ({
          label: cityName,
          value: cityName
        }))
      ];
    }

    return (cities || []).filter(c => Boolean(c && typeof c.label === "string" && typeof c.value === "string"));
  }, [selectedCountry, selectedState, initialJobs]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedState("All");
    setSelectedCity("All");
    setVisibleCount(9);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("All");
    setVisibleCount(9);
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: value
    }));
    setVisibleCount(9);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("All");
    setSelectedState("All");
    setSelectedCity("All");
    setSelectedCompany("All");
    setSortBy("newest");
    setActiveFilters({
      "Job Type": "All",
      "Batch": "All",
      "Work Mode": "All"
    });
    setVisibleCount(9);
  };

  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedCountry !== "All" ||
      selectedState !== "All" ||
      selectedCity !== "All" ||
      selectedCompany !== "All" ||
      sortBy !== "newest" ||
      Object.values(activeFilters).some(v => v !== "All")
    );
  }, [searchQuery, selectedCountry, selectedState, selectedCity, selectedCompany, sortBy, activeFilters]);

  // Real-time filtering engine with strict 1-month recency and sorting
  const filteredAndSortedJobs = useMemo(() => {
    const now = new Date().getTime();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    // 1. Filter jobs
    const filtered = initialJobs.filter(job => {
      // Recency check: only jobs from last 1 month
      const postTime = new Date(job.posted_at || job.first_seen_at).getTime();
      if ((now - postTime) > THIRTY_DAYS_MS) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.name.toLowerCase().includes(query);
        const matchesLocation = job.location.some(l => l.toLowerCase().includes(query));
        const matchesSkills = (job.skills_required || []).some(s => s.toLowerCase().includes(query));
        const matchesDept = (job.department || "").toLowerCase().includes(query);

        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesSkills && !matchesDept) {
          return false;
        }
      }

      // Company Filter
      if (selectedCompany !== "All") {
        if (job.company.slug !== selectedCompany && job.company.name !== selectedCompany) {
          return false;
        }
      }

      // Country Filter
      if (selectedCountry !== "All") {
        const country = selectedCountry.toLowerCase();
        if (country === "india") {
          const isIndia = job.location.some(l => 
            l.toLowerCase().includes("india") || 
            l.toLowerCase().includes("bengaluru") || 
            l.toLowerCase().includes("bangalore") || 
            l.toLowerCase().includes("pune") || 
            l.toLowerCase().includes("hyderabad") || 
            l.toLowerCase().includes("mumbai") || 
            l.toLowerCase().includes("chennai") || 
            l.toLowerCase().includes("delhi") || 
            l.toLowerCase().includes("noida") || 
            l.toLowerCase().includes("gurgaon")
          );
          if (!isIndia && (job.work_mode || "").toLowerCase() !== "remote") return false;
        } else if (country === "united states") {
          const isUS = job.location.some(l => 
            l.toLowerCase().includes("united states") || 
            l.toLowerCase().includes("usa") || 
            l.toLowerCase().includes("san francisco") || 
            l.toLowerCase().includes("new york") || 
            l.toLowerCase().includes("seattle") || 
            l.toLowerCase().includes("austin")
          );
          if (!isUS && (job.work_mode || "").toLowerCase() !== "remote") return false;
        } else if (country === "remote") {
          const isRemote = (job.work_mode || "").toLowerCase() === "remote" || job.location.some(l => l.toLowerCase().includes("remote"));
          if (!isRemote) return false;
        } else {
          const matches = job.location.some(l => l.toLowerCase().includes(country));
          if (!matches) return false;
        }
      }

      // State Filter (Smart Mapping: check state name OR any city known to belong to this state)
      if (selectedState !== "All") {
        const stateLower = selectedState.toLowerCase();
        
        // Find cities belonging to this state from STATE_CITIES
        const stateCityValues = (STATE_CITIES[selectedCountry]?.[selectedState] || [])
          .map(c => c.value.toLowerCase())
          .filter(v => v !== "all");

        const stateMatches = job.location.some(l => {
          const locLower = l.toLowerCase();
          if (locLower.includes(stateLower)) return true;
          return stateCityValues.some(cityVal => locLower.includes(cityVal));
        }) || ((job as any).state && (job as any).state.toLowerCase().includes(stateLower));

        if (!stateMatches) {
          return false;
        }
      }

      // City Filter (Smart Synonyms: e.g. Bengaluru/Bangalore, Delhi/Noida/Gurgaon)
      if (selectedCity !== "All") {
        const targetCity = selectedCity.toLowerCase();
        let cityMatch = false;

        if (targetCity === "bengaluru" || targetCity === "bangalore") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("bengaluru") || loc.includes("bangalore") || loc.includes("blr");
          });
        } else if (targetCity === "delhi") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("delhi") || loc.includes("noida") || loc.includes("gurgaon") || loc.includes("gurugram") || loc.includes("ncr");
          });
        } else if (targetCity === "mumbai") {
          cityMatch = job.location.some(l => {
            const loc = l.toLowerCase();
            return loc.includes("mumbai") || loc.includes("bombay") || loc.includes("thane") || loc.includes("navi mumbai");
          });
        } else if (targetCity === "pune") {
          cityMatch = job.location.some(l => l.toLowerCase().includes("pune"));
        } else if (targetCity === "hyderabad") {
          cityMatch = job.location.some(l => l.toLowerCase().includes("hyderabad") || l.toLowerCase().includes("secunderabad"));
        } else if (targetCity === "remote") {
          cityMatch = (job.work_mode || "").toLowerCase() === "remote" || job.location.some(l => l.toLowerCase().includes("remote"));
        } else {
          cityMatch = job.location.some(l => l.toLowerCase().includes(targetCity)) ||
                      ((job as any).city && (job as any).city.toLowerCase().includes(targetCity));
        }

        if (!cityMatch) {
          return false;
        }
      }

      // Job Type filter
      if (activeFilters["Job Type"] !== "All") {
        const filterType = activeFilters["Job Type"].toLowerCase().replace(/\s|-/g, "");
        const jobType = (job.employment_type || "").toLowerCase().replace(/\s|-/g, "");
        if (!jobType.includes(filterType) && !filterType.includes(jobType)) {
          return false;
        }
      }

      // Batch filter
      if (activeFilters["Batch"] !== "All") {
        const batch = activeFilters["Batch"];
        if (!job.eligible_batches || !job.eligible_batches.includes(batch)) {
          return false;
        }
      }

      // Work Mode filter
      if (activeFilters["Work Mode"] !== "All") {
        if ((job.work_mode || "").toLowerCase() !== activeFilters["Work Mode"].toLowerCase()) {
          return false;
        }
      }

      return true;
    });

    // 2. Sort jobs (Latest on top by default)
    return filtered.sort((a, b) => {
      if (sortBy === "salary") {
        const salaryA = a.salary_max || a.salary_min || 0;
        const salaryB = b.salary_max || b.salary_min || 0;
        return salaryB - salaryA;
      }
      if (sortBy === "fresher") {
        const expA = a.experience_min ?? 0;
        const expB = b.experience_min ?? 0;
        return expA - expB;
      }
      // Default: newest posted on top
      const timeA = new Date(a.posted_at || a.first_seen_at).getTime();
      const timeB = new Date(b.posted_at || b.first_seen_at).getTime();
      return timeB - timeA;
    });
  }, [initialJobs, searchQuery, selectedCountry, selectedState, selectedCity, selectedCompany, sortBy, activeFilters]);

  const displayedJobs = filteredAndSortedJobs.slice(0, visibleCount);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-900 pt-16 pb-14 px-4 shadow-inner">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Official ATS Job Stream • Directly On Company Portals</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Discover Jobs Minutes After They&apos;re Posted
          </h1>
          <p className="text-base md:text-lg text-teal-100/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Real official career portal postings with zero delays. Apply straight on the official company domain without third-party registration.
          </p>

          {/* Interactive Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-teal-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role (e.g. SDE, Data Analyst), company, skills, or city..."
              className="block w-full pl-12 pr-10 py-4 border-0 rounded-2xl bg-white/95 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 shadow-2xl focus:ring-4 focus:ring-teal-400/40 outline-none text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Live Stats & Freshness Indicator */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-xs md:text-sm text-teal-100/70">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {stats.total_jobs.toLocaleString()} active jobs monitored
            </span>
            <span>•</span>
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {stats.total_companies.toLocaleString()} official portals
            </span>
            <span>•</span>
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Last 1 month only • Newest on top
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Hierarchical Filters: Country -> State -> City -> Company -> Sort */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3.5">
          {/* Top Row: 5 Responsive Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            {/* 1. Country Dropdown (All 50+ World Countries) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>1. Country:</span>
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs md:text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm"
              >
                {ALL_WORLD_COUNTRIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. State Dropdown (Dynamically enabled based on Country) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>2. State / Region:</span>
              </label>
              <select
                value={selectedState}
                disabled={selectedCountry === "All" || selectedCountry === "Remote"}
                onChange={(e) => handleStateChange(e.target.value)}
                className={`w-full border rounded-xl px-2.5 py-2 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all ${
                  selectedCountry === "All" || selectedCountry === "Remote"
                    ? "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
                    : "bg-slate-50 dark:bg-slate-900 border-teal-300 dark:border-teal-700/60 text-slate-900 dark:text-slate-100 cursor-pointer ring-1 ring-teal-500/20"
                }`}
              >
                {selectedCountry === "All" ? (
                  <option value="All">← Pick Country First</option>
                ) : (
                  (availableStates || []).filter(s => Boolean(s?.value)).map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* 3. City Dropdown (Dynamically enabled based on State/Country) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>3. City:</span>
              </label>
              <select
                value={selectedCity}
                disabled={selectedCountry === "All" || selectedCountry === "Remote"}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setVisibleCount(9);
                }}
                className={`w-full border rounded-xl px-2.5 py-2 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all ${
                  selectedCountry === "All" || selectedCountry === "Remote"
                    ? "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
                    : "bg-slate-50 dark:bg-slate-900 border-teal-300 dark:border-teal-700/60 text-slate-900 dark:text-slate-100 cursor-pointer ring-1 ring-teal-500/20"
                }`}
              >
                {selectedCountry === "All" ? (
                  <option value="All">← Pick Country First</option>
                ) : (
                  (availableCities || []).filter(c => Boolean(c?.value)).map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* 4. Company Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>4. Company:</span>
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setVisibleCount(9);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs md:text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm"
              >
                <option value="All">🏢 All Companies</option>
                {(availableCompanies || []).map(comp => (
                  <option key={comp.slug} value={comp.slug}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Sort Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>5. Sort Order:</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs md:text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm"
              >
                <option value="newest">🔥 Newest First (Last 1 Month)</option>
                <option value="salary">💰 Highest Salary</option>
                <option value="fresher">🎯 Fresher Friendly (0–1 Yrs)</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Filter Pills */}
          <div className="flex flex-col gap-2 pt-2.5">
            {Object.entries(FILTER_CONFIG).map(([category, options]) => (
              <div key={category} className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[75px]">
                  {category}
                </span>
                <div className="flex gap-1.5">
                  {options.map((option) => {
                    const isActive = activeFilters[category] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => toggleFilter(category, option)}
                        className={`px-3 py-1 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-all border ${
                          isActive
                            ? "bg-teal-600 border-teal-600 text-white shadow-sm scale-105"
                            : "bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-slate-200/80 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Active Filter summary & Reset */}
          {isFiltered && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
              <span className="text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1.5 flex-wrap">
                <span>Showing {filteredAndSortedJobs.length} matching {filteredAndSortedJobs.length === 1 ? "posting" : "postings"}</span>
                {selectedCountry !== "All" && (
                  <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
                    {selectedCountry}
                  </span>
                )}
                {selectedState !== "All" && (
                  <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
                    State: {selectedState}
                  </span>
                )}
                {selectedCity !== "All" && (
                  <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
                    📍 {selectedCity}
                  </span>
                )}
                {selectedCompany !== "All" && (
                  <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
                    🏢 {availableCompanies.find(c => c.slug === selectedCompany)?.name || selectedCompany}
                  </span>
                )}
              </span>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold transition-colors bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-900/40"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Feed List */}
      <section className="py-10 bg-slate-50 dark:bg-slate-950 flex-1">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Latest Openings (Last 1 Month)</span>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
                  Newest On Top
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct official career portal openings verified through company career systems
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
              Showing {displayedJobs.length} of {filteredAndSortedJobs.length} postings
            </div>
          </div>

          {/* Job Grid or Empty State */}
          {displayedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No active postings found for this selection
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">
                No openings in &quot;{selectedCity !== 'All' ? selectedCity : selectedState !== 'All' ? selectedState : selectedCountry !== 'All' ? selectedCountry : searchQuery}&quot; within the last 1 month matching your filters.
              </p>
              <Button onClick={resetFilters} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters & Show All
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredAndSortedJobs.length && (
            <div className="mt-12 text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="min-w-[240px] rounded-xl hover:border-teal-500 hover:text-teal-600 transition-all font-semibold shadow-sm"
              >
                Load More Opportunities ({filteredAndSortedJobs.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
