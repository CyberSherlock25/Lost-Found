package com.university.lostfound.controller;

import com.university.lostfound.dto.ApiResponse;
import com.university.lostfound.dto.AuditLogDTO;
import com.university.lostfound.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getRecentAuditLogs() {
        List<AuditLogDTO> logs = auditLogService.getRecentAuditLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
