package com.university.lostfound.controller;

import com.university.lostfound.dto.AdminDashboardAnalyticsDTO;
import com.university.lostfound.dto.ApiResponse;
import com.university.lostfound.dto.StudentDashboardDTO;
import com.university.lostfound.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final AnalyticsService analyticsService;

    public DashboardController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<AdminDashboardAnalyticsDTO>> getAdminAnalytics() {
        AdminDashboardAnalyticsDTO analytics = analyticsService.getAdminDashboardAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse<StudentDashboardDTO>> getStudentDashboard(Authentication authentication) {
        StudentDashboardDTO dashboard = analyticsService.getStudentDashboardMetrics(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
