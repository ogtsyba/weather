"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChartLine,
  Users,
  Briefcase,
  UserPlus,
  TrendUp,
  Calendar,
  Target,
  ArrowRight,
  PlusIcon,
  GitBranchIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
import { BarChart3Icon, FolderOpenIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ size?: number; className: string }>;
  description?: string;
}

function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue =
    typeof value === "number"
      ? value
      : parseInt(value.toString().replace(/,/g, "")) || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = numericValue / 50;
      const counter = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setAnimatedValue(numericValue);
          clearInterval(counter);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 30);
      return () => clearInterval(counter);
    }, 200);

    return () => clearTimeout(timer);
  }, [numericValue]);

  return (
    <Card className="interactive-card focus-ring">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon size={20} className="text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "number" ? animatedValue.toLocaleString() : value}
        </div>
        {change && (
          <p
            className={`text-xs flex items-center gap-1 mt-1 ${
              changeType === "positive"
                ? "text-green-600"
                : changeType === "negative"
                  ? "text-red-600"
                  : "text-muted-foreground"
            }`}
          >
            {changeType === "positive" && <TrendUp size={12} />}
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  leads: number;
  conversions: number;
  lastUpdated: string;
  location: string;
  company: string;
  progress: number;
}

function RecentCampaigns({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Campaigns</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="interactive-card focus-ring"
        >
          View All <ArrowRight size={16} className="ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase
              size={48}
              className="mx-auto text-muted-foreground mb-3"
            />
            <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first campaign to start managing leads
            </p>
            <Button>
              <UserPlus size={16} className="mr-2" />
              Create Campaign
            </Button>
          </div>
        ) : (
          campaigns.slice(0, 3).map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-hover transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{campaign.name}</h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === "active"
                        ? "bg-green-100 text-green-700"
                        : campaign.status === "paused"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{campaign.leads} leads</span>
                  <span>{campaign.conversions} conversions</span>
                  <span>Updated {campaign.lastUpdated}</span>
                </div>
                <Progress
                  value={(campaign.conversions / campaign.leads) * 100}
                  className="mt-2 h-2"
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [stats] = useState({
    totalLeads: 1247,
    activeCampaigns: 8,
    totalApplicants: 89,
    hiredCandidates: 23,
  });
  const [campaigns] = useState<Campaign[]>([]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary p-8 text-primary-foreground">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome back, John! 👋</h1>
              <p className="text-primary-foreground/80 text-lg">
                Here's what's happening with your lead management today
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" size="lg">
                <UserPlus size={20} className="mr-2" />
                Add Leads
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => router.push("/leads")}
              >
                <Target size={20} className="mr-2" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={stats.totalLeads}
          change="+12% from last month"
          changeType="positive"
          icon={Users}
          description="Total leads in your database"
        />
        <MetricCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          change="2 new this week"
          changeType="positive"
          icon={Briefcase}
          description="Currently running campaigns"
        />
        <MetricCard
          title="Job Applicants"
          value={stats.totalApplicants}
          change="+8% this week"
          changeType="positive"
          icon={UserPlus}
          description="Candidates who applied"
        />
        <MetricCard
          title="Hired Candidates"
          value={stats.hiredCandidates}
          change="5 this month"
          changeType="positive"
          icon={ChartLine}
          description="Successfully hired candidates"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCampaigns campaigns={campaigns} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <UserPlus size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">5 new leads added</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Campaign "Q4 Recruitment" updated
                </p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Target size={16} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">3 candidates hired</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => router.push("/leads")}
              className="w-full justify-start gap-3"
            >
              <PlusIcon size={20} />
              Create New Campaign from Leads
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/nurturing-workflows")}
              className="w-full justify-start gap-3"
            >
              <GitBranchIcon size={20} />
              Manage Nurturing Workflows
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/email-templates")}
              className="w-full justify-start gap-3"
            >
              <EnvelopeSimpleIcon size={20} />
              Manage Email Templates
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/campaigns")}
              className="w-full justify-start gap-3"
            >
              <BarChart3Icon size={20} />
              View All Campaigns
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/users")}
              className="w-full justify-start gap-3"
            >
              <Users size={20} />
              Manage Users & Roles
            </Button>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Last updates on your campaigns
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/campaigns")}
            >
              Show all campaigns
            </Button>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <FolderOpenIcon
                  size={48}
                  className="mx-auto text-muted-foreground"
                />
                <div className="text-sm text-muted-foreground">
                  Looks like nothing was changed here since your last visit
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign: Campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Company: {campaign.company}, Location:{" "}
                        {campaign.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Left {campaign.lastUpdated}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Progress value={campaign.progress} className="w-20" />
                      <Button
                        size="sm"
                        onClick={() => router.push("/campaigns")}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
