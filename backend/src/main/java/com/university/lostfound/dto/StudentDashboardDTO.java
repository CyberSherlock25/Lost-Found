package com.university.lostfound.dto;

import java.util.List;

public class StudentDashboardDTO {
    private long myReportedItemsCount;
    private long myClaimsCount;
    private long pendingClaimsCount;
    private long approvedClaimsCount;
    private List<ItemDTO> recentFoundItems;
    private List<ClaimDTO> myActiveClaims;
    private List<AnnouncementDTO> announcements;

    public StudentDashboardDTO() {}

    public long getMyReportedItemsCount() { return myReportedItemsCount; }
    public void setMyReportedItemsCount(long myReportedItemsCount) { this.myReportedItemsCount = myReportedItemsCount; }

    public long getMyClaimsCount() { return myClaimsCount; }
    public void setMyClaimsCount(long myClaimsCount) { this.myClaimsCount = myClaimsCount; }

    public long getPendingClaimsCount() { return pendingClaimsCount; }
    public void setPendingClaimsCount(long pendingClaimsCount) { this.pendingClaimsCount = pendingClaimsCount; }

    public long getApprovedClaimsCount() { return approvedClaimsCount; }
    public void setApprovedClaimsCount(long approvedClaimsCount) { this.approvedClaimsCount = approvedClaimsCount; }

    public List<ItemDTO> getRecentFoundItems() { return recentFoundItems; }
    public void setRecentFoundItems(List<ItemDTO> recentFoundItems) { this.recentFoundItems = recentFoundItems; }

    public List<ClaimDTO> getMyActiveClaims() { return myActiveClaims; }
    public void setMyActiveClaims(List<ClaimDTO> myActiveClaims) { this.myActiveClaims = myActiveClaims; }

    public List<AnnouncementDTO> getAnnouncements() { return announcements; }
    public void setAnnouncements(List<AnnouncementDTO> announcements) { this.announcements = announcements; }
}
