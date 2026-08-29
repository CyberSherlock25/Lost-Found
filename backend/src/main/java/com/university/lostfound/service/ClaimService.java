package com.university.lostfound.service;

import com.university.lostfound.dto.ClaimDTO;
import com.university.lostfound.dto.CreateClaimRequest;
import com.university.lostfound.dto.ReviewClaimRequest;
import com.university.lostfound.entity.*;
import com.university.lostfound.exception.BadRequestException;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

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

        if (!Boolean.TRUE.equals(item.getIsClaimable())) {
            throw new BadRequestException("This item is not currently claimable.");
        }

        if (claimRepository.findByItemItemIdAndClaimantUserId(item.getItemId(), claimant.getUserId()).isPresent()) {
            throw new BadRequestException("You have already submitted a claim for this item.");
        }

        Claim claim = new Claim();
        claim.setItem(item);
        claim.setClaimant(claimant);
        claim.setProofDescription(request.getProofDescription());
        claim.setProofDocumentUrl(request.getProofDocumentUrl());
        claim.setClaimStatus(ClaimStatus.PENDING);

        Claim savedClaim = claimRepository.save(claim);

        // Update item status to CLAIM_REQUESTED
        itemStatusRepository.findByStatusName("CLAIM_REQUESTED").ifPresent(item::setStatus);
        itemRepository.save(item);

        // Send notification to item uploader or admins
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
            status = ClaimStatus.valueOf(request.getClaimStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid claim status: " + request.getClaimStatus());
        }

        claim.setReviewedBy(reviewer);
        claim.setClaimStatus(status);
        claim.setReviewerRemarks(request.getReviewerRemarks());
        claim.setReviewedAt(LocalDateTime.now());

        Item item = claim.getItem();

        if (status == ClaimStatus.APPROVED) {
            item.setClaimedBy(claim.getClaimant());
            itemStatusRepository.findByStatusName("CLAIM_APPROVED").ifPresent(item::setStatus);
            itemRepository.save(item);

            // Notify Claimant
            notificationService.sendNotification(
                    reviewer,
                    claim.getClaimant(),
                    item.getItemId(),
                    claim.getClaimId(),
                    "Claim Approved!",
                    "Your claim for '" + item.getTitle() + "' has been approved. Please visit the admin desk to collect your item.",
                    "CLAIM_APPROVED"
            );
        } else if (status == ClaimStatus.REJECTED) {
            itemStatusRepository.findByStatusName("CLAIM_REJECTED").ifPresent(item::setStatus);
            itemRepository.save(item);

            // Notify Claimant
            notificationService.sendNotification(
                    reviewer,
                    claim.getClaimant(),
                    item.getItemId(),
                    claim.getClaimId(),
                    "Claim Update",
                    "Your claim for '" + item.getTitle() + "' was reviewed and rejected. Reason: " + (request.getReviewerRemarks() != null ? request.getReviewerRemarks() : "Proof verification insufficient."),
                    "CLAIM_REJECTED"
            );
        }

        return dtoMapper.toClaimDTO(claimRepository.save(claim));
    }

    @Transactional
    public ClaimDTO markCollected(Long claimId, String reviewerEmail) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + claimId));

        claim.setClaimStatus(ClaimStatus.COLLECTED);

        Item item = claim.getItem();
        itemStatusRepository.findByStatusName("COLLECTED").ifPresent(item::setStatus);
        item.setIsActive(false); // Closed item
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
                .filter(claim -> claim.getClaimStatus() == null || claim.getClaimStatus() == ClaimStatus.PENDING || claim.getClaimStatus() == ClaimStatus.UNDER_REVIEW)
                .map(dtoMapper::toClaimDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimDTO uploadProofDocument(Long claimId, MultipartFile file) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + claimId));

        String proofUrl = fileStorageService.storeFile(file);
        claim.setProofDocumentUrl(proofUrl);
        return dtoMapper.toClaimDTO(claimRepository.save(claim));
    }
}
