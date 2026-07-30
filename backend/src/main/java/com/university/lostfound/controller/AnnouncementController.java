package com.university.lostfound.controller;

import com.university.lostfound.dto.AnnouncementDTO;
import com.university.lostfound.dto.ApiResponse;
import com.university.lostfound.dto.CreateAnnouncementRequest;
import com.university.lostfound.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnouncementDTO>>> getActiveAnnouncements() {
        return ResponseEntity.ok(ApiResponse.success(announcementService.getActiveAnnouncements()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<AnnouncementDTO>>> getAllAnnouncements() {
        return ResponseEntity.ok(ApiResponse.success(announcementService.getAllAnnouncements()));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<AnnouncementDTO>> createAnnouncement(Authentication authentication,
                                                                          @Valid @RequestBody CreateAnnouncementRequest request) {
        AnnouncementDTO dto = announcementService.createAnnouncement(authentication.getName(), request);
        return new ResponseEntity<>(ApiResponse.success("Announcement created", dto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{announcementId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<String>> deleteAnnouncement(@PathVariable Long announcementId) {
        announcementService.deleteAnnouncement(announcementId);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted", null));
    }
}
