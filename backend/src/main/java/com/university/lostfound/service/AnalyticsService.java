package com.university.lostfound.service;

import com.university.lostfound.dto.*;
import com.university.lostfound.entity.ClaimStatus;
import com.university.lostfound.entity.User;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;
    private final AnnouncementRepository announcementRepository;
    private final AuditLogRepository auditLogRepository;
    private final AnnouncementService announcementService;
    private final DTOMapper dtoMapper;

    public AnalyticsService(UserRepository userRepository,
                            ItemRepository itemRepository,
                            ClaimRepository claimRepository,
                            AnnouncementRepository announcementRepository,
                            AuditLogRepository auditLogRepository,
                            AnnouncementService announcementService,
                            DTOMapper dtoMapper) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.claimRepository = claimRepository;
        this.announcementRepository = announcementRepository;
        this.auditLogRepository = auditLogRepository;
        this.announcementService = announcementService;
        this.dtoMapper = dtoMapper;
    }

    public AdminDashboardAnalyticsDTO getAdminDashboardAnalytics() {
        AdminDashboardAnalyticsDTO dto = new AdminDashboardAnalyticsDTO();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalItems(itemRepository.count());
        dto.setTotalLostItems(itemRepository.countByTypeTypeName("LOST"));
        dto.setTotalFoundItems(itemRepository.countByTypeTypeName("FOUND"));
        dto.setPendingClaims(claimRepository.countByClaimStatus(ClaimStatus.PENDING));
        dto.setApprovedClaims(claimRepository.countByClaimStatus(ClaimStatus.APPROVED));
        dto.setTotalAnnouncements(announcementRepository.count());

        // Category breakdown
        Map<String, Long> categoryMap = new HashMap<>();
        List<Object[]> categoryCounts = itemRepository.countItemsByCategory();
        for (Object[] row : categoryCounts) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }
        dto.setCategoryAnalytics(categoryMap);

        // Location breakdown
        Map<String, Long> locationMap = new HashMap<>();
        List<Object[]> locationCounts = itemRepository.countItemsByLocation();
        for (Object[] row : locationCounts) {
            locationMap.put((String) row[0], (Long) row[1]);
        }
        dto.setLocationAnalytics(locationMap);

        // Recent items
        dto.setRecentItems(
                itemRepository.findTop6ByIsActiveTrueOrderByCreatedAtDesc().stream()
                        .map(dtoMapper::toItemDTO)
                        .collect(Collectors.toList())
        );

        // Recent claims
        dto.setRecentClaims(
                claimRepository.findAllByOrderByClaimedAtDesc().stream()
                        .limit(6)
                        .map(dtoMapper::toClaimDTO)
                        .collect(Collectors.toList())
        );

        // Recent audit logs
        dto.setRecentAuditLogs(
                auditLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                        .limit(10)
                        .map(dtoMapper::toAuditLogDTO)
                        .collect(Collectors.toList())
        );

        return dto;
    }

    public StudentDashboardDTO getStudentDashboardMetrics(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + studentEmail));

        StudentDashboardDTO dto = new StudentDashboardDTO();
        dto.setMyReportedItemsCount(itemRepository.countByUploadedByUserId(student.getUserId()));
        dto.setMyClaimsCount(claimRepository.countByClaimantUserId(student.getUserId()));

        List<ClaimDTO> myClaims = claimRepository.findByClaimantUserIdOrderByClaimedAtDesc(student.getUserId()).stream()
                .map(dtoMapper::toClaimDTO)
                .collect(Collectors.toList());

        long pending = myClaims.stream().filter(c -> "PENDING".equalsIgnoreCase(c.getClaimStatus())).count();
        long approved = myClaims.stream().filter(c -> "APPROVED".equalsIgnoreCase(c.getClaimStatus())).count();

        dto.setPendingClaimsCount(pending);
        dto.setApprovedClaimsCount(approved);
        dto.setMyActiveClaims(myClaims.stream().limit(5).collect(Collectors.toList()));

        dto.setRecentFoundItems(
                itemRepository.findTop6ByIsActiveTrueOrderByCreatedAtDesc().stream()
                        .map(dtoMapper::toItemDTO)
                        .collect(Collectors.toList())
        );

        dto.setAnnouncements(announcementService.getActiveAnnouncements());

        return dto;
    }
}
