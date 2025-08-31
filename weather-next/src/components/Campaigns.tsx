"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PlusIcon,
  ArchiveIcon,
  BriefcaseIcon,
  UsersIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import {
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
  SearchIcon,
} from "lucide-react";

type Page =
  | "dashboard"
  | "campaigns"
  | "leads"
  | "users"
  | "create-role"
  | "campaign-show";

interface Campaign {
  id: string;
  name: string;
  company: string;
  location: string;
  status: "active" | "paused" | "completed" | "draft";
  progress: number;
  leads: number;
  conversions?: number;
  applicants: number;
  hired: number;
  lastUpdate: string;
  description?: string;
}

export default function CampaignsList() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Frontend Master",
      company: "HFORCE",
      location: "Remote",
      status: "active",
      progress: 68,
      leads: 245,
      applicants: 156,
      hired: 12,
      lastUpdate: "21.08.2025 | 18:15",
      description:
        "Senior Frontend Developer position focusing on React and TypeScript",
    },
    {
      id: "2",
      name: "Backend Engineer",
      company: "TechCorp",
      location: "New York",
      status: "paused",
      progress: 34,
      leads: 189,
      applicants: 89,
      hired: 5,
      lastUpdate: "20.08.2025 | 14:22",
      description: "Backend engineer role with Node.js and Python experience",
    },
    {
      id: "3",
      name: "DevOps Specialist",
      company: "CloudStart",
      location: "San Francisco",
      status: "completed",
      progress: 100,
      leads: 134,
      applicants: 78,
      hired: 18,
      lastUpdate: "19.08.2025 | 09:45",
      description: "DevOps role focusing on AWS and Kubernetes",
    },
  ]);

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    totalLeads: campaigns.reduce((sum, c) => sum + c.leads, 0),
    totalConversions: campaigns.reduce(
      (sum, c) => sum + (c.conversions ?? 1),
      0,
    ),
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(
      campaigns.map((campaign) => {
        if (campaign.id === campaignId) {
          const newStatus = campaign.status === "active" ? "paused" : "active";
          return { ...campaign, status: newStatus };
        }
        return campaign;
      }),
    );
  };

  const archiveCampaign = (campaignId: string) => {
    setCampaigns(
      campaigns.map((campaign) => {
        if (campaign.id === campaignId) {
          return { ...campaign, status: "completed" as const };
        }
        return campaign;
      }),
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your lead generation campaigns
          </p>
        </div>
        <Button onClick={() => router.push("/leads")} className="gap-2">
          <PlusIcon size={20} />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BriefcaseIcon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PlayIcon size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Campaigns
                </p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendUpIcon size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Conversions
                </p>
                <p className="text-2xl font-bold">{stats.totalConversions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "paused" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("paused")}
              >
                Paused
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <SearchIcon size={32} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No campaigns found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria"
                    : "Get started by creating your first campaign"}
                </p>
              </div>
              <Button onClick={() => router.push("/leads")}>
                <PlusIcon size={20} className="mr-2" />
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle
                      className="text-lg cursor-pointer hover:text-primary"
                      onClick={() => router.push(`/campaigns/${campaign.id}`)}
                    >
                      {campaign.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {campaign.company} • {campaign.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontalIcon size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {campaign.description}
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {campaign.leads}
                    </div>
                    <div className="text-xs text-muted-foreground">Leads</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {campaign.applicants}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Applicants
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {campaign.hired}
                    </div>
                    <div className="text-xs text-muted-foreground">Hired</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{campaign.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Last updated: {campaign.lastUpdate}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCampaignStatus(campaign.id)}
                    className="flex-1"
                  >
                    {campaign.status === "active" ? (
                      <>
                        <PauseIcon size={16} className="mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <PlayIcon size={16} className="mr-1" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => archiveCampaign(campaign.id)}
                  >
                    <ArchiveIcon size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
