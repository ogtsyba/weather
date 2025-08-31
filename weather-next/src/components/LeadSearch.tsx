"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  MagnifyingGlassIcon,
  SelectionIcon,
  DownloadIcon,
  PlusIcon,
  TargetIcon,
  BookmarkIcon,
  XIcon,
  FunnelIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  GitBranchIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

// type Page =
//   | "dashboard"
//   | "campaigns"
//   | "leads"
//   | "users"
//   | "create-role"
//   | "campaign-show"
//   | "email-templates"
//   | "nurturing-workflows";

// interface LeadSearchProps {
//   onNavigate: (page: Page) => void;
// }

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  country: string;
  language: string;
  industry: string;
  leadScore: number;
  status: "new" | "contacted" | "interested" | "qualified" | "rejected";
  companySize: "startup" | "small" | "medium" | "large" | "enterprise";
  budget: number;
  lastActivity: string;
  source: "website" | "linkedin" | "referral" | "event" | "cold-email";
  tags: string[];
  notes?: string;
}

interface AdvancedFilters {
  country: string[];
  language: string[];
  industry: string[];
  leadScoreRange: [number, number];
  status: string[];
  companySize: string[];
  budgetRange: [number, number];
  source: string[];
  tags: string[];
  lastActivityDays: number;
  hasNotes: boolean | null;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  filters: AdvancedFilters;
  leadCount: number;
  createdAt: string;
  isDefault?: boolean;
}

const LEADS = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@techcorp.com",
    company: "TechCorp Inc.",
    position: "Senior Developer",
    country: "United States",
    language: "English",
    industry: "Technology",
    leadScore: 85,
    status: "new",
    companySize: "large",
    budget: 50000,
    lastActivity: "2024-01-15",
    source: "linkedin",
    tags: ["developer", "enterprise", "saas"],
    notes: "Very interested in API solutions",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@innovate.es",
    company: "Innovate Solutions",
    position: "Product Manager",
    country: "Spain",
    language: "Spanish",
    industry: "Software",
    leadScore: 92,
    status: "contacted",
    companySize: "medium",
    budget: 25000,
    lastActivity: "2024-01-12",
    source: "website",
    tags: ["product-management", "agile", "startup"],
    notes: "Looking for project management tools",
  },
  {
    id: "3",
    name: "Hans Mueller",
    email: "hans.mueller@autotech.de",
    company: "AutoTech GmbH",
    position: "Engineering Lead",
    country: "Germany",
    language: "German",
    industry: "Automotive",
    leadScore: 78,
    status: "interested",
    companySize: "enterprise",
    budget: 100000,
    lastActivity: "2024-01-10",
    source: "event",
    tags: ["automotive", "iot", "enterprise"],
  },
  {
    id: "4",
    name: "Sophie Laurent",
    email: "sophie.laurent@fintech.fr",
    company: "FinTech Paris",
    position: "CTO",
    country: "France",
    language: "French",
    industry: "Finance",
    leadScore: 96,
    status: "qualified",
    companySize: "startup",
    budget: 75000,
    lastActivity: "2024-01-14",
    source: "referral",
    tags: ["fintech", "blockchain", "security"],
    notes: "Ready to discuss implementation timeline",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@startup.co.uk",
    company: "Startup Solutions",
    position: "Founder",
    country: "United Kingdom",
    language: "English",
    industry: "Technology",
    leadScore: 88,
    status: "new",
    companySize: "startup",
    budget: 15000,
    lastActivity: "2024-01-13",
    source: "cold-email",
    tags: ["startup", "mvp", "funding"],
  },
  {
    id: "6",
    name: "Elena Rossi",
    email: "elena.rossi@healthcare.it",
    company: "Healthcare Systems",
    position: "IT Director",
    country: "Italy",
    language: "Italian",
    industry: "Healthcare",
    leadScore: 82,
    status: "contacted",
    companySize: "large",
    budget: 80000,
    lastActivity: "2024-01-11",
    source: "linkedin",
    tags: ["healthcare", "compliance", "data-privacy"],
  },
] as const;

const SEGMENTS = [
  {
    id: "high-value",
    name: "High-Value Prospects",
    description: "Leads with high scores and large budgets",
    filters: {
      country: [],
      language: [],
      industry: [],
      leadScoreRange: [80, 100],
      status: [],
      companySize: ["large", "enterprise"],
      budgetRange: [50000, 200000],
      source: [],
      tags: [],
      lastActivityDays: 30,
      hasNotes: null,
    },
    leadCount: 0,
    createdAt: "2024-01-01",
    isDefault: true,
  },
  {
    id: "new-prospects",
    name: "New Prospects",
    description: "Recently acquired leads that need attention",
    filters: {
      country: [],
      language: [],
      industry: [],
      leadScoreRange: [0, 100],
      status: ["new"],
      companySize: [],
      budgetRange: [0, 200000],
      source: [],
      tags: [],
      lastActivityDays: 7,
      hasNotes: null,
    },
    leadCount: 0,
    createdAt: "2024-01-01",
    isDefault: true,
  },
] as const;

export default function LeadSearch() {
  const router = useRouter();
  const [leads] = useState<Lead[]>(LEADS);
  const [segments, setSegments] = useState<Segment[]>(SEGMENTS);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showSaveSegment, setShowSaveSegment] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState("");
  const [newSegmentDescription, setNewSegmentDescription] = useState("");

  const [filters, setFilters] = useState<AdvancedFilters>({
    country: [],
    language: [],
    industry: [],
    leadScoreRange: [0, 100],
    status: [],
    companySize: [],
    budgetRange: [0, 200000],
    source: [],
    tags: [],
    lastActivityDays: 365,
    hasNotes: null,
  });

  const filteredLeads = leads.filter((lead) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    // Advanced filters
    const matchesCountry =
      filters.country.length === 0 || filters.country.includes(lead.country);
    const matchesLanguage =
      filters.language.length === 0 || filters.language.includes(lead.language);
    const matchesIndustry =
      filters.industry.length === 0 || filters.industry.includes(lead.industry);
    const matchesScore =
      lead.leadScore >= filters.leadScoreRange[0] &&
      lead.leadScore <= filters.leadScoreRange[1];
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(lead.status);
    const matchesCompanySize =
      filters.companySize.length === 0 ||
      filters.companySize.includes(lead.companySize);
    const matchesBudget =
      lead.budget >= filters.budgetRange[0] &&
      lead.budget <= filters.budgetRange[1];
    const matchesSource =
      filters.source.length === 0 || filters.source.includes(lead.source);
    const matchesTags =
      filters.tags.length === 0 ||
      filters.tags.some((tag) => lead.tags.includes(tag));

    // Last activity filter
    const activityDate = new Date(lead.lastActivity);
    const daysSinceActivity = Math.floor(
      (new Date().getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const matchesActivity = daysSinceActivity <= filters.lastActivityDays;

    // Notes filter
    const matchesNotes =
      filters.hasNotes === null ||
      (filters.hasNotes === true && lead.notes) ||
      (filters.hasNotes === false && !lead.notes);

    return (
      matchesSearch &&
      matchesCountry &&
      matchesLanguage &&
      matchesIndustry &&
      matchesScore &&
      matchesStatus &&
      matchesCompanySize &&
      matchesBudget &&
      matchesSource &&
      matchesTags &&
      matchesActivity &&
      matchesNotes
    );
  });

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "interested":
        return "bg-orange-100 text-orange-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompanySizeColor = (size: Lead["companySize"]) => {
    switch (size) {
      case "startup":
        return "bg-purple-100 text-purple-800";
      case "small":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "large":
        return "bg-green-100 text-green-800";
      case "enterprise":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceColor = (source: Lead["source"]) => {
    switch (source) {
      case "website":
        return "bg-blue-100 text-blue-800";
      case "linkedin":
        return "bg-cyan-100 text-cyan-800";
      case "referral":
        return "bg-green-100 text-green-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      case "cold-email":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId],
    );
  };

  const selectAllLeads = () => {
    setSelectedLeads(
      selectedLeads.length === filteredLeads.length
        ? []
        : filteredLeads.map((lead) => lead.id),
    );
  };

  const createCampaignFromSelected = () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select at least one lead to create a campaign");
      return;
    }

    toast.success(`Campaign created with ${selectedLeads.length} leads`);
    setSelectedLeads([]);
    router.push("/campaigns");
  };

  const createWorkflowFromFilters = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads match current filters to create workflow");
      return;
    }

    // Store current filters for workflow creation
    localStorage.setItem("workflow-trigger-filters", JSON.stringify(filters));
    localStorage.setItem(
      "workflow-lead-count",
      filteredLeads.length.toString(),
    );

    toast.success(
      `Navigating to create workflow with ${filteredLeads.length} matching leads`,
    );
    router.push("/nurturing-workflows");
  };

  const exportSelectedLeads = () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to export");
      return;
    }

    const selectedLeadData = leads.filter((lead) =>
      selectedLeads.includes(lead.id),
    );
    const csv = [
      "Name,Email,Company,Position,Country,Language,Industry,Lead Score,Status",
      ...selectedLeadData.map(
        (lead) =>
          `"${lead.name}","${lead.email}","${lead.company}","${lead.position}","${lead.country}","${lead.language}","${lead.industry}",${lead.leadScore},"${lead.status}"`,
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Leads exported successfully");
  };

  const applySegment = (segmentId: string) => {
    const segment = segments.find((s) => s.id === segmentId);
    if (segment) {
      setFilters(segment.filters);
      setSelectedSegment(segmentId);
      toast.success(`Applied segment: ${segment.name}`);
    }
  };

  const saveCurrentFiltersAsSegment = () => {
    if (!newSegmentName.trim()) {
      toast.error("Please enter a segment name");
      return;
    }

    const newSegment: Segment = {
      id: Date.now().toString(),
      name: newSegmentName,
      description: newSegmentDescription,
      filters: { ...filters },
      leadCount: filteredLeads.length,
      createdAt: new Date().toISOString(),
    };

    setSegments((prev) => [...prev, newSegment]);
    setNewSegmentName("");
    setNewSegmentDescription("");
    setShowSaveSegment(false);
    toast.success(`Segment "${newSegmentName}" saved successfully`);
  };

  const deleteSegment = (segmentId: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== segmentId));
    if (selectedSegment === segmentId) {
      setSelectedSegment(null);
    }
    toast.success("Segment deleted");
  };

  const clearFilters = () => {
    setFilters({
      country: [],
      language: [],
      industry: [],
      leadScoreRange: [0, 100],
      status: [],
      companySize: [],
      budgetRange: [0, 200000],
      source: [],
      tags: [],
      lastActivityDays: 365,
      hasNotes: null,
    });
    setSearchTerm("");
    setSelectedSegment(null);
  };

  const toggleArrayFilter = (
    filterKey: keyof AdvancedFilters,
    value: string,
  ) => {
    setFilters((prev) => {
      const currentArray = prev[filterKey] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [filterKey]: newArray };
    });
  };

  // Get unique values for filter options
  const countries = Array.from(new Set(leads.map((lead) => lead.country)));
  const languages = Array.from(new Set(leads.map((lead) => lead.language)));
  const industries = Array.from(new Set(leads.map((lead) => lead.industry)));
  const sources = Array.from(new Set(leads.map((lead) => lead.source)));
  const allTags = Array.from(new Set(leads.flatMap((lead) => lead.tags)));
  const companySizes = ["startup", "small", "medium", "large", "enterprise"];
  const statuses = ["new", "contacted", "interested", "qualified", "rejected"];

  // Calculate segment lead counts
  const updatedSegments = segments.map((segment) => ({
    ...segment,
    leadCount: leads.filter((lead) => {
      // Apply segment filters to calculate count
      const tempFilters = segment.filters;
      const matchesCountry =
        tempFilters.country.length === 0 ||
        tempFilters.country.includes(lead.country);
      const matchesLanguage =
        tempFilters.language.length === 0 ||
        tempFilters.language.includes(lead.language);
      const matchesIndustry =
        tempFilters.industry.length === 0 ||
        tempFilters.industry.includes(lead.industry);
      const matchesScore =
        lead.leadScore >= tempFilters.leadScoreRange[0] &&
        lead.leadScore <= tempFilters.leadScoreRange[1];
      const matchesStatus =
        tempFilters.status.length === 0 ||
        tempFilters.status.includes(lead.status);
      const matchesCompanySize =
        tempFilters.companySize.length === 0 ||
        tempFilters.companySize.includes(lead.companySize);
      const matchesBudget =
        lead.budget >= tempFilters.budgetRange[0] &&
        lead.budget <= tempFilters.budgetRange[1];
      const matchesSource =
        tempFilters.source.length === 0 ||
        tempFilters.source.includes(lead.source);
      const matchesTags =
        tempFilters.tags.length === 0 ||
        tempFilters.tags.some((tag) => lead.tags.includes(tag));

      const activityDate = new Date(lead.lastActivity);
      const daysSinceActivity = Math.floor(
        (new Date().getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const matchesActivity = daysSinceActivity <= tempFilters.lastActivityDays;

      const matchesNotes =
        tempFilters.hasNotes === null ||
        (tempFilters.hasNotes === true && lead.notes) ||
        (tempFilters.hasNotes === false && !lead.notes);

      return (
        matchesCountry &&
        matchesLanguage &&
        matchesIndustry &&
        matchesScore &&
        matchesStatus &&
        matchesCompanySize &&
        matchesBudget &&
        matchesSource &&
        matchesTags &&
        matchesActivity &&
        matchesNotes
      );
    }).length,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Advanced Lead Targeting
          </h1>
          <p className="text-muted-foreground">
            Search, filter, and segment leads for precise campaign targeting
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportSelectedLeads}
            disabled={selectedLeads.length === 0}
          >
            <DownloadIcon size={20} className="mr-2" />
            Export ({selectedLeads.length})
          </Button>
          <Button
            variant="outline"
            onClick={createWorkflowFromFilters}
            disabled={filteredLeads.length === 0}
          >
            <GitBranchIcon size={20} className="mr-2" />
            Create Workflow ({filteredLeads.length})
          </Button>
          <Button
            onClick={createCampaignFromSelected}
            disabled={selectedLeads.length === 0}
          >
            <TargetIcon size={20} className="mr-2" />
            Create Campaign ({selectedLeads.length})
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UsersIcon size={24} className="text-primary" />
              <div>
                <div className="text-2xl font-bold">{filteredLeads.length}</div>
                <div className="text-sm text-muted-foreground">
                  Matching Leads
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ChartBarIcon size={24} className="text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    filteredLeads.reduce(
                      (sum, lead) => sum + lead.leadScore,
                      0,
                    ) / filteredLeads.length,
                  ) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FunnelIcon size={24} className="text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {updatedSegments.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Saved Segments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ClockIcon size={24} className="text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    filteredLeads.reduce((sum, lead) => sum + lead.budget, 0),
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Budget
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookmarkIcon size={20} />
            Saved Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {updatedSegments.map((segment) => (
              <Badge
                key={segment.id}
                variant={selectedSegment === segment.id ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5 text-sm"
                onClick={() => applySegment(segment.id)}
              >
                {segment.name} ({segment.leadCount})
                {!segment.isDefault && (
                  <XIcon
                    size={14}
                    className="ml-2 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSegment(segment.id);
                    }}
                  />
                )}
              </Badge>
            ))}
            <Dialog open={showSaveSegment} onOpenChange={setShowSaveSegment}>
              <DialogTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer px-3 py-1.5 text-sm border-dashed"
                >
                  <PlusIcon size={14} className="mr-1" />
                  Save Current Filters
                </Badge>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Filter Segment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="segment-name">Segment Name</Label>
                    <Input
                      id="segment-name"
                      value={newSegmentName}
                      onChange={(e) => setNewSegmentName(e.target.value)}
                      placeholder="e.g., High-Value Enterprise Leads"
                    />
                  </div>
                  <div>
                    <Label htmlFor="segment-description">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="segment-description"
                      value={newSegmentDescription}
                      onChange={(e) => setNewSegmentDescription(e.target.value)}
                      placeholder="Describe this segment..."
                      rows={3}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    This segment will include {filteredLeads.length} leads with
                    current filters
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowSaveSegment(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveCurrentFiltersAsSegment}>
                      Save Segment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <SelectionIcon size={20} />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search leads by name, email, company, position, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Filters</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral Filters</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Countries */}
                <div>
                  <Label className="text-sm font-medium">Countries</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {countries.map((country) => (
                      <div
                        key={country}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={filters.country.includes(country)}
                          onCheckedChange={() =>
                            toggleArrayFilter("country", country)
                          }
                        />
                        <label className="text-sm">{country}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <Label className="text-sm font-medium">Languages</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {languages.map((language) => (
                      <div
                        key={language}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={filters.language.includes(language)}
                          onCheckedChange={() =>
                            toggleArrayFilter("language", language)
                          }
                        />
                        <label className="text-sm">{language}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <Label className="text-sm font-medium">Industries</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {industries.map((industry) => (
                      <div
                        key={industry}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={filters.industry.includes(industry)}
                          onCheckedChange={() =>
                            toggleArrayFilter("industry", industry)
                          }
                        />
                        <label className="text-sm">{industry}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lead Score Range */}
              <div>
                <Label className="text-sm font-medium">
                  Lead Score Range: {filters.leadScoreRange[0]} -{" "}
                  {filters.leadScoreRange[1]}
                </Label>
                <Slider
                  value={filters.leadScoreRange}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      leadScoreRange: value as [number, number],
                    })
                  }
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Status */}
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Badge
                      key={status}
                      variant={
                        filters.status.includes(status) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter("status", status)}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Size */}
                <div>
                  <Label className="text-sm font-medium">Company Size</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {companySizes.map((size) => (
                      <Badge
                        key={size}
                        variant={
                          filters.companySize.includes(size)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter("companySize", size)}
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Lead Source */}
                <div>
                  <Label className="text-sm font-medium">Lead Source</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sources.map((source) => (
                      <Badge
                        key={source}
                        variant={
                          filters.source.includes(source)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter("source", source)}
                      >
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <Label className="text-sm font-medium">
                  Budget Range: {formatCurrency(filters.budgetRange[0])} -{" "}
                  {formatCurrency(filters.budgetRange[1])}
                </Label>
                <Slider
                  value={filters.budgetRange}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      budgetRange: value as [number, number],
                    })
                  }
                  max={200000}
                  step={5000}
                  className="mt-2"
                />
              </div>

              {/* Tags */}
              <div>
                <Label className="text-sm font-medium">Tags</Label>
                <div className="mt-2 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        filters.tags.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter("tags", tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="behavioral" className="space-y-4 mt-6">
              {/* Last Activity */}
              <div>
                <Label className="text-sm font-medium">
                  Last Activity (within {filters.lastActivityDays} days)
                </Label>
                <Slider
                  value={[filters.lastActivityDays]}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      lastActivityDays: value[0] as number,
                    })
                  }
                  max={365}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Has Notes */}
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <div className="mt-2 flex gap-2">
                  <Badge
                    variant={filters.hasNotes === null ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilters({ ...filters, hasNotes: null })}
                  >
                    All
                  </Badge>
                  <Badge
                    variant={filters.hasNotes === true ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilters({ ...filters, hasNotes: true })}
                  >
                    Has Notes
                  </Badge>
                  <Badge
                    variant={filters.hasNotes === false ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilters({ ...filters, hasNotes: false })}
                  >
                    No Notes
                  </Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} of {leads.length} leads
              {selectedSegment &&
                ` (using segment: ${updatedSegments.find((s) => s.id === selectedSegment)?.name})`}
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lead Results</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedLeads.length === filteredLeads.length &&
                  filteredLeads.length > 0
                }
                onCheckedChange={selectAllLeads}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <MagnifyingGlassIcon
                size={48}
                className="mx-auto text-muted-foreground mb-4"
              />
              <h3 className="text-lg font-medium mb-2">No leads found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedLeads.includes(lead.id)
                      ? "bg-primary/5 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => toggleLeadSelection(lead.id)}
                    />
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-8 gap-4">
                      <div className="lg:col-span-2">
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {lead.email}
                        </div>
                      </div>
                      <div className="lg:col-span-2">
                        <div className="font-medium">{lead.company}</div>
                        <div className="text-sm text-muted-foreground">
                          {lead.position}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm">{lead.country}</div>
                        <div className="text-sm text-muted-foreground">
                          {lead.language}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm">{lead.industry}</div>
                        <div
                          className={`text-sm font-medium ${getScoreColor(lead.leadScore)}`}
                        >
                          Score: {lead.leadScore}
                        </div>
                      </div>
                      <div>
                        <Badge
                          className={getCompanySizeColor(lead.companySize)}
                        >
                          {lead.companySize}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(lead.budget)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                        <Badge
                          className={getSourceColor(lead.source)}
                          variant="outline"
                        >
                          {lead.source}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {getDaysAgo(lead.lastActivity)}d ago
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {lead.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {lead.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {lead.notes && (
                    <div className="mt-3 p-2 bg-muted/30 rounded text-sm">
                      <span className="font-medium">Notes: </span>
                      {lead.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
