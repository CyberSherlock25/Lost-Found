package com.university.lostfound.dto;

import java.util.List;
import java.util.Map;

public class AdminDashboardAnalyticsDTO {
    private long totalUsers;
    private long totalItems;
    private long totalLostItems;
    private long totalFoundItems;
    private long pendingClaims;
    private long approvedClaims;
    private long totalAnnouncements;
    private Map<String, Long> categoryAnalytics;
    private Map<String, Long> locationAnalytics;
    private List<ItemDTO> recentItems;
    private List<ClaimDTO> recentClaims;
    private List<AuditLogDTO> recentAuditLogs;

    public AdminDashboardAnalyticsDTO() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalItems() { return totalItems; }
    public void setTotalItems(long totalItems) { this.totalItems = totalItems; }

    public long getTotalLostItems() { return totalLostItems; }
    public void setTotalLostItems(long totalLostItems) { this.totalLostItems = totalLostItems; }

    public long getTotalFoundItems() { return totalFoundItems; }
    public void setTotalFoundItems(long totalFoundItems) { this.totalFoundItems = totalFoundItems; }

    public long getPendingClaims() { return pendingClaims; }
    public void setPendingClaims(long pendingClaims) { this.pendingClaims = pendingClaims; }

    public long getApprovedClaims() { return approvedClaims; }
    public void setApprovedClaims(long approvedClaims) { this.approvedClaims = approvedClaims; }

    public long getTotalAnnouncements() { return totalAnnouncements; }
    public void setTotalAnnouncements(long totalAnnouncements) { this.totalAnnouncements = totalAnnouncements; }

    public Map<String, Long> getCategoryAnalytics() { return categoryAnalytics; }
    public void setCategoryAnalytics(Map<String, Long> categoryAnalytics) { this.categoryAnalytics = categoryAnalytics; }

    public Map<String, Long> getLocationAnalytics() { return locationAnalytics; }
    public void setLocationAnalytics(Map<String, Long> locationAnalytics) { this.locationAnalytics = locationAnalytics; }

    public List<ItemDTO> getRecentItems() { return recentItems; }
    public void setRecentItems(List<ItemDTO> recentItems) { this.recentItems = recentItems; }

    public List<ClaimDTO> getRecentClaims() { return recentClaims; }
    public void setRecentClaims(List<ClaimDTO> recentClaims) { this.recentClaims = recentClaims; }

    public List<AuditLogDTO> getRecentAuditLogs() { return recentAuditLogs; }
    public void setRecentAuditLogs(List<AuditLogDTO> recentAuditLogs) { this.recentAuditLogs = recentAuditLogs; }
}
