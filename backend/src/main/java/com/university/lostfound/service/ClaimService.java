package com.university.lostfound.service;

import com.university.lostfound.dto.ClaimDTO;
import com.university.lostfound.dto.CreateClaimRequest;
import com.university.lostfound.dto.ReviewClaimRequest;
import com.university.lostfound.entity.*;
import com.university.lostfound.exception.BadRequestException;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private static final Set<String> CLAIM_REVIEWER_ROLES = Set.of(
            "ADMIN", "ROLE_ADMIN", "STAFF", "ROLE_STAFF", "TEACHER", "ROLE_TEACHER"
    );
    private static final Set<String> ALLOWED_PROOF_TYPES = Set.of(
            "application/pdf", "image/jpeg", "image/png"
    );

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ItemStatusRepository itemStatusRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;
    private final DTOMapper dtoMapper;

    public ClaimService(ClaimRepository claimRepository,
                        ItemRepository itemRepository,
                        UserRepository userRepository,
                        ItemStatusRepository itemStatusRepository,
                        NotificationService notificationService,
                        FileStorageService fileStorageService,
                        DTOMapper dtoMapper) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.itemStatusRepository = itemStatusRepository;
        this.notificationService = notificationService;
        this.fileStorageService = fileStorageService;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public ClaimDTO submitClaim(String claimantEmail, CreateClaimRequest request) {
        User claimant = userRepository.findByEmail(claimantEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + claimantEmail));
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + request.getItemId()));

        if (!Boolean.TRUE.equals(item.getIsActive()) || !Boolean.TRUE.equals(item.getIsVerified())) {
            throw new ResourceNotFoundException("Item not found with ID: " + request.getItemId());
        }
        if (!Boolean.TRUE.equals(item.getIsClaimable())) {
            throw new BadRequestException("This item is not currently claimable.");
        }
        if (item.getUploadedBy() != null && item.getUploadedBy().getUserId() != null
                && item.getUploadedBy().getUserId().equals(claimant.getUserId())) {
            throw new BadRequestException("You cannot submit a claim for an item you reported.");
        }
        if (claimRepository.findByItemItemIdAndClaimantUserId(item.getItemId(), claimant.getUserId()).isPresent()) {
            throw new BadRequestException("You have already submitted a claim for this item.");
        }

        Claim claim = new Claim();
        claim.setItem(item);
        claim.setClaimant(claimant);
        claim.setProofDescription(request.getProofDescription());
        // Never trust proof URLs supplied by the client.
        claim.setProofDocumentUrl(null);
        claim.setClaimStatus(ClaimStatus.PENDING);
        Claim savedClaim = claimRepository.save(claim);

        itemStatusRepository.findByStatusName("CLAIM_REQUESTED").ifPresent(item::setStatus);
        itemRepository.save(item);

        if (item.getUploadedBy() != null) {
            notificationService.sendNotification(
                    claimant,
                    item.getUploadedBy(),
                    item.getItemId(),
                    savedClaim.getClaimId(),
                    "New Claim Submitted",
                    "A new claim has been submitted for item: " + item.getTitle(),
                    "CLAIM_SUBMITTED"
            );
        }
        return dtoMapper.toClaimDTO(savedClaim);
    }

    @Transactional
    public ClaimDTO reviewClaim(Long claimId, String reviewerEmail, ReviewClaimRequest request) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + claimId));
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer user not found"));

        ClaimStatus status;
        try {
            status = ClaimStatus.valueOf(request.getClaimStatus().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new BadRequestException("Invalid claim status: " + request.getClaimStatus());
        }

        if (status != ClaimStatus.APPROVED && status != ClaimStatus.REJECTED && status != ClaimStatus.UNDER_REVIEW) {
            throw new BadRequestException("Review status must be UNDER_REVIEW, APPROVED, or REJECTED.");
        }
        if (claim.getClaimStatus() == ClaimStatus.COLLECTED) {
            throw new BadRequestException("A collected claim cannot be reviewed again.");
        }
        if (claim.getClaimStatus() == ClaimStatus.APPROVED || claim.getClaimStatus() == ClaimStatus.REJECTED) {
            throw new BadRequestException("This claim has already been reviewed.");
        }

        Item item = claim.getItem();
        if (status == ClaimStatus.APPROVED && !Boolean.TRUE.equals(item.getIsClaimable())) {
            throw new BadRequestException("This item is no longer available to be claimed.");
        }

        claim.setReviewedBy(reviewer);
        claim.setClaimStatus(status);
        claim.setReviewerRemarks(request.getReviewerRemarks());
        claim.setReviewedAt(LocalDateTime.now());

        if (status == ClaimStatus.APPROVED) {
            item.setClaimedBy(claim.getClaimant());
            item.setIsClaimable(false);
            itemStatusRepository.findByStatusName("CLAIM_APPROVED").ifPresent(item::setStatus);
            itemRepository.save(item);
            notificationService.sendNotification(
                    reviewer, claim.getClaimant(), item.getItemId(), claim.getClaimId(),
                    "Claim Approved!",
                    "Your claim for '" + item.getTitle() + "' has been approved. Please visit the admin desk to collect your item.",
                    "CLAIM_APPROVED"
            );
        } else if (status == ClaimStatus.REJECTED) {
            itemStatusRepository.findByStatusName("CLAIM_REJECTED").ifPresent(item::setStatus);
            item.setIsClaimable(true);
            itemRepository.save(item);
            notificationService.sendNotification(
                    reviewer, claim.getClaimant(), item.getItemId(), claim.getClaimId(),
                    "Claim Update",
                    "Your claim for '" + item.getTitle() + "' was reviewed and rejected. Reason: "
                            + (request.getReviewerRemarks() != null ? request.getReviewerRemarks() : "Proof verification insufficient."),
                    "CLAIM_REJECTED"
            );
        }
        return dtoMapper.toClaimDTO(claimRepository.save(claim));
    }

    @Transactional
    public ClaimDTO markCollected(Long claimId, String reviewerEmail) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + claimId));
        if (claim.getClaimStatus() != ClaimStatus.APPROVED) {
            throw new BadRequestException("Only an approved claim can be marked as collected.");
        }

        claim.setClaimStatus(ClaimStatus.COLLECTED);
        Item item = claim.getItem();
        itemStatusRepository.findByStatusName("COLLECTED").ifPresent(item::setStatus);
        item.setIsActive(false);
        item.setIsClaimable(false);
        itemRepository.save(item);
        return dtoMapper.toClaimDTO(claimRepository.save(claim));
    }

    public List<ClaimDTO> getMyClaims(String claimantEmail) {
        User claimant = userRepository.findByEmail(claimantEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + claimantEmail));
        return claimRepository.findByClaimantUserIdOrderByClaimedAtDesc(claimant.getUserId()).stream()
                .map(dtoMapper::toClaimDTO)
                .collect(Collectors.toList());
    }

    public List<ClaimDTO> getItemClaims(Long itemId) {
        return claimRepository.findByItemItemIdOrderByClaimedAtDesc(itemId).stream()
                .map(dtoMapper::toClaimDTO)
                .collect(Collectors.toList());
    }

    public List<ClaimDTO> getAllClaims() {
        return claimRepository.findAllByOrderByClaimedAtDesc().stream()
                .filter(claim -> claim.getClaimStatus() == null
                        || claim.getClaimStatus() == ClaimStatus.PENDING
                        || claim.getClaimStatus() == ClaimStatus.UNDER_REVIEW)
                .map(dtoMapper::toClaimDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimDTO uploadProofDocument(Long claimId, String userEmail, MultipartFile file) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + claimId));
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isClaimant = claim.getClaimant() != null && claim.getClaimant().getUserId() != null
                && claim.getClaimant().getUserId().equals(requester.getUserId());
        boolean isReviewer = CLAIM_REVIEWER_ROLES.contains(normalizeRoleName(requester));
        if (!isClaimant && !isReviewer) {
            throw new AccessDeniedException("You are not allowed to upload proof for this claim.");
        }
        if (claim.getClaimStatus() != ClaimStatus.PENDING && claim.getClaimStatus() != ClaimStatus.UNDER_REVIEW) {
            throw new BadRequestException("Proof can only be uploaded while the claim is pending or under review.");
        }
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a proof document to upload.");
        }
        if (file.getSize() > 10L * 1024 * 1024) {
            throw new BadRequestException("Proof document size must not exceed 10MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_PROOF_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("Proof document must be a PDF, JPEG, or PNG file.");
        }

        String proofUrl = fileStorageService.storeFile(file);
        claim.setProofDocumentUrl(proofUrl);
        return dtoMapper.toClaimDTO(claimRepository.save(claim));
    }

    private String normalizeRoleName(User user) {
        if (user == null || user.getRole() == null || user.getRole().getRoleName() == null) {
            return "";
        }
        return user.getRole().getRoleName().trim().toUpperCase(Locale.ROOT);
    }
}
