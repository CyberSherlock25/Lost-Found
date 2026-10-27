package com.university.lostfound.controller;

import com.university.lostfound.dto.ApiResponse;
import com.university.lostfound.dto.ClaimDTO;
import com.university.lostfound.dto.CreateClaimRequest;
import com.university.lostfound.dto.ReviewClaimRequest;
import com.university.lostfound.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {
    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimDTO>> submitClaim(Authentication authentication,
                                                             @Valid @RequestBody CreateClaimRequest request) {
        ClaimDTO claim = claimService.submitClaim(authentication.getName(), request);
        return new ResponseEntity<>(ApiResponse.success("Claim submitted successfully", claim), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ClaimDTO>>> getMyClaims(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(claimService.getMyClaims(authentication.getName())));
    }

    // Claim records may contain claimant identity and proof-document references.
    @GetMapping("/item/{itemId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<ClaimDTO>>> getItemClaims(@PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success(claimService.getItemClaims(itemId)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<ClaimDTO>>> getAllClaims() {
        return ResponseEntity.ok(ApiResponse.success(claimService.getAllClaims()));
    }

    @PostMapping("/{claimId}/review")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<ClaimDTO>> reviewClaim(@PathVariable Long claimId,
                                                             Authentication authentication,
                                                             @Valid @RequestBody ReviewClaimRequest request) {
        ClaimDTO claim = claimService.reviewClaim(claimId, authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Claim reviewed successfully", claim));
    }

    @PostMapping("/{claimId}/collect")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<ClaimDTO>> markCollected(@PathVariable Long claimId,
                                                               Authentication authentication) {
        ClaimDTO claim = claimService.markCollected(claimId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Item marked as collected and claim closed", claim));
    }

    @PostMapping(value = "/{claimId}/proof-document", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ClaimDTO>> uploadProofDocument(@PathVariable Long claimId,
                                                                     Authentication authentication,
                                                                     @RequestParam("file") MultipartFile file) {
        ClaimDTO claim = claimService.uploadProofDocument(claimId, authentication.getName(), file);
        return ResponseEntity.ok(ApiResponse.success("Proof document uploaded successfully", claim));
    }
}
